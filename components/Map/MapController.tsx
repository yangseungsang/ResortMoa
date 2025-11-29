import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Resort, PlaceCategory } from '../../types';
import { safeLatLng } from '../../core/utils/mapUtils';

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

// Custom SVG Marker (Offline compatible) - Nearby Dot
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
            zoomControl: false,
            maxBounds: KOREA_BOUNDS,
            maxBoundsViscosity: 1.0,
            minZoom: 6,
            maxZoom: 14,
        });

        map.setView([36.5, 127.8], 7);

        // CartoDB Voyager (Does not require API Key, widely used)
        // If completely offline, this tile layer might fail. 
        // For strict offline, you would serve tiles from local server.
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);
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
              zIndexOffset: isSelected ? 1000 : 0
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
                    if (place.category === PlaceCategory.FOOD) color = '#f97316';
                    if (place.category === PlaceCategory.TOUR) color = '#22c55e';
                    if (place.category === PlaceCategory.STORE) color = '#3b82f6';

                    try {
                        // Use L.marker with DivIcon for consistent animation with resort pins
                        const marker = L.marker(pLatLng, {
                            icon: createNearbyMarkerIcon(color),
                            zIndexOffset: 500
                        }).addTo(map);

                        marker.bindPopup(`
                            <div class="text-xs font-sans">
                                <strong class="block mb-1 text-slate-800">${place.name}</strong>
                                <span class="text-slate-500">${place.category}</span>
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
        // Reset View
        try {
            const center = L.latLng(36.5, 127.8);
            map.flyTo(center, 7, { duration: 0.8 });
        } catch (e) {
             try {
                map.setView([36.5, 127.8], 7);
            } catch (innerE) {}
        }
    }
  }, [selectedResort]);

  return (
    <div className="relative w-full h-full z-0">
      <div ref={mapContainerRef} className="w-full h-full bg-slate-200" />
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded text-[10px] text-slate-500 z-[400] pointer-events-none shadow-sm">
        Korea Vector Map {selectedResort ? '• Nearby Places Active' : ''}
      </div>
    </div>
  );
};

export default MapController;