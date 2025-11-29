
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Resort, PlaceCategory } from '../../types';
import { safeLatLng } from '../../core/utils/mapUtils';
import { IconHome, IconPlus, IconMinus } from '../Icons';

// No external CDN imports needed for markers anymore.

interface MapControllerProps {
  resorts: Resort[];
  selectedResort: Resort | null;
  onResortSelect: (resort: Resort) => void;
}

// South Korea Bounds
const KOREA_BOUNDS = L.latLngBounds(
    [32.8, 124.5], // South West
    [38.9, 132.0]  // North East
);

const INITIAL_CENTER = L.latLng(36.5, 127.8);
const INITIAL_ZOOM = 7;

// Custom SVG Marker (Offline compatible) - Resort Pin
const createCustomMarker = (color: string = '#0d9488') => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3" fill="white"></circle>
  </svg>`;
  
  return L.divIcon({
    className: 'custom-marker',
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Custom SVG Marker (Offline compatible) - Nearby Dot (Fallback)
const createNearbyMarkerIcon = (color: string) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>`;

  return L.divIcon({
    className: 'nearby-marker',
    html: svg,
    iconSize: [14, 14], // Fixed small size to act like a pin but unobtrusive
    iconAnchor: [7, 7],
    popupAnchor: [0, -7]
  });
};

// Custom Image Marker - Nearby Pin with Thumbnail
const createNearbyImageMarker = (imageUrl: string, color: string) => {
  // Inline styles are used to ensure correct rendering within Leaflet's DivIcon structure
  // Note: We include an onerror handler to hide the image if it fails to load
  const html = `
    <div style="position: relative; width: 44px; height: 50px;">
        <div style="
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 3px solid ${color};
            background: white;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            z-index: 10;
            position: relative;
        ">
            <img 
                src="${imageUrl}" 
                style="width: 100%; height: 100%; object-fit: cover;" 
                onerror="this.style.display='none'; this.parentElement.style.background='${color}';" 
            />
        </div>
        <div style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0; 
            height: 0; 
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid ${color};
            z-index: 5;
        "></div>
    </div>
  `;

  return L.divIcon({
    className: '', // Reset default classes
    html: html,
    iconSize: [44, 50],
    iconAnchor: [22, 50], // Center X, Bottom Y
    popupAnchor: [0, -50]
  });
};

const MapController: React.FC<MapControllerProps> = ({ resorts, selectedResort, onResortSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const nearbyMarkersRef = useRef<L.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
        const map = L.map(mapContainerRef.current, {
            zoomControl: false, // Disable default zoom control to use custom buttons
            maxBounds: KOREA_BOUNDS,
            maxBoundsViscosity: 1.0,
            minZoom: 6,
            maxZoom: 14,
        });

        map.setView(INITIAL_CENTER, INITIAL_ZOOM);

        // OpenStreetMap Standard Tiles (Displays local language - Korean in Korea)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
    } catch (error) {
        console.error("Error initializing map:", error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Main Resort Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new
    resorts.forEach(resort => {
      const latLng = safeLatLng(resort.latitude, resort.longitude);
      if (!latLng) return;

      try {
          // Use DivIcon instead of default icon to avoid external PNG dependencies
          const isSelected = selectedResort && selectedResort.id === resort.id;
          const markerIcon = createCustomMarker(isSelected ? '#dc2626' : '#0d9488'); // Red if selected, Teal otherwise

          const marker = L.marker(latLng, {
              title: resort.name,
              icon: markerIcon,
              opacity: selectedResort && selectedResort.id !== resort.id ? 0.8 : 1.0,
              zIndexOffset: isSelected ? 1000 : 100
          })
          .addTo(map)
          .on('click', () => onResortSelect(resort));
          
          if (!selectedResort) {
              marker.bindTooltip(resort.name, {
                  permanent: false,
                  direction: 'top',
                  offset: [0, -36],
                  className: 'px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg border-0 font-sans'
              });
          }

          markersRef.current.push(marker);
      } catch (e) {
          console.error(`Failed to create marker for ${resort.name}`, e);
      }
    });

  }, [resorts, onResortSelect, selectedResort]);

  // Handle Selection Focus & Nearby Places
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    map.invalidateSize();

    // Clear nearby
    nearbyMarkersRef.current.forEach(m => m.remove());
    nearbyMarkersRef.current = [];

    if (selectedResort) {
        const latLng = safeLatLng(selectedResort.latitude, selectedResort.longitude);

        if (latLng) {
            try {
                map.flyTo(latLng, 12, { duration: 0.8 });
            } catch (e) {
                console.warn("FlyTo failed, fallback to setView", e);
                map.setView(latLng, 12);
            }
        }

        // Add nearby markers
        if (selectedResort.nearby_places?.length) {
            selectedResort.nearby_places.forEach(place => {
                const pLatLng = safeLatLng(place.latitude, place.longitude);
                if (pLatLng) {
                    let color = '#64748b';
                    if (place.category === PlaceCategory.FOOD) color = '#f97316'; // orange-500
                    if (place.category === PlaceCategory.TOUR) color = '#22c55e'; // green-500
                    if (place.category === PlaceCategory.STORE) color = '#3b82f6'; // blue-500

                    try {
                        const imageUrl = place.images && place.images.length > 0 
                            ? place.images[0] 
                            : place.image_url;
                        
                        let markerIcon;
                        
                        if (imageUrl) {
                             markerIcon = createNearbyImageMarker(imageUrl, color);
                        } else {
                             markerIcon = createNearbyMarkerIcon(color);
                        }

                        const marker = L.marker(pLatLng, {
                            icon: markerIcon,
                            zIndexOffset: 500
                        }).addTo(map);

                        // Simple tooltip for quick ID
                        marker.bindTooltip(place.name, {
                            permanent: false,
                            direction: 'bottom',
                            offset: [0, 8],
                            className: 'px-2 py-1 bg-white text-slate-800 text-xs rounded shadow border font-sans font-bold'
                        });

                        // Detailed Popup
                        marker.bindPopup(`
                            <div class="text-xs font-sans p-1">
                                <strong class="block mb-1 text-slate-800 text-sm">${place.name}</strong>
                                <span class="text-white px-2 py-0.5 rounded-full text-[10px]" style="background-color: ${color}">${place.category}</span>
                                <p class="mt-1 text-slate-500">${place.description}</p>
                            </div>
                        `);
                        
                        nearbyMarkersRef.current.push(marker);
                    } catch (e) {
                        console.error("Failed to create nearby marker", e);
                    }
                }
            });
        }
    } else {
        // Handle when selection is cleared (optional, button handles manual reset)
    }
  }, [selectedResort]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { duration: 0.8 });
      } catch (e) {
        mapInstanceRef.current.setView(INITIAL_CENTER, INITIAL_ZOOM);
      }
    }
  };

  const handleZoomIn = () => {
      if (mapInstanceRef.current) {
          mapInstanceRef.current.zoomIn();
      }
  };

  const handleZoomOut = () => {
      if (mapInstanceRef.current) {
          mapInstanceRef.current.zoomOut();
      }
  };

  return (
    <div className="relative w-full h-full z-0">
      <div ref={mapContainerRef} className="w-full h-full bg-slate-200" />
      
      {/* Map Controls Container - Right Aligned Stack */}
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col items-center space-y-3">
          
          {/* Reset View Button */}
          <button 
            onClick={handleResetView}
            className="bg-white w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-teal-600 hover:bg-slate-50 shadow-md transition-colors cursor-pointer"
            title="Reset View"
          >
            <IconHome className="w-5 h-5" />
          </button>

          {/* Zoom Controls Group */}
          <div className="flex flex-col rounded-lg shadow-md border border-slate-200 overflow-hidden bg-white">
            <button 
                onClick={handleZoomIn} 
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 border-b border-slate-100 transition-colors"
                title="Zoom In"
            >
                <IconPlus className="w-5 h-5" />
            </button>
            <button 
                onClick={handleZoomOut} 
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"
                title="Zoom Out"
            >
                <IconMinus className="w-5 h-5" />
            </button>
          </div>

      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded text-[10px] text-slate-500 z-[400] pointer-events-none shadow-sm">
        OpenStreetMap {selectedResort ? '• Nearby Places Active' : ''}
      </div>
    </div>
  );
};

export default MapController;
