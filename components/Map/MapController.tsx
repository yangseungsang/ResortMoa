
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import { Resort, PlaceCategory, NearbyPlace } from '../../types';
import { safeLatLng } from '../../core/utils/mapUtils';
import { IconHome, IconPlus, IconMinus } from '../Icons';

// No external CDN imports needed for markers anymore.

export interface MapControllerHandle {
  flyToLocation: (lat: number, lng: number) => void;
}

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

// Group/Cluster Marker for overlapping places
const createGroupMarkerIcon = (count: number) => {
  const html = `
    <div style="
        background-color: #334155;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15);
        font-family: ui-sans-serif, system-ui, sans-serif;
    ">
      ${count}
    </div>
  `;
  return L.divIcon({
    className: 'group-marker',
    html: html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const MapController = forwardRef<MapControllerHandle, MapControllerProps>(({ resorts, selectedResort, onResortSelect }, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const nearbyLayerRef = useRef<L.LayerGroup | null>(null);

  // Expose flyToLocation to parent via ref
  useImperativeHandle(ref, () => ({
    flyToLocation: (lat: number, lng: number) => {
      const map = mapInstanceRef.current;
      if (!map) return;
      
      const latLng = safeLatLng(lat, lng);
      if (latLng) {
         const targetZoom = 15;
         let targetCenter = latLng;

         // Mobile Adjustment: Account for Bottom Sheet (~60% height)
         // We want the pin to appear in the top ~40% of the screen.
         // By shifting the map center DOWN (positive Y), the pin moves UP relative to the viewport.
         if (window.innerWidth < 768) {
            const mapSize = map.getSize();
            // Shift center down by 25% of screen height to place pin in the visible top area.
            // Screen center is 50%, Visible center (of top 40%) is 20%. Diff is 30%.
            // We use 0.25 (25%) to provide a little headroom.
            const offsetY = mapSize.y * 0.25; 

            // Project to pixel coordinates at target zoom
            const point = map.project(latLng, targetZoom);
            const newPoint = point.add([0, offsetY]);
            targetCenter = map.unproject(newPoint, targetZoom);
         }

         try {
            map.flyTo(targetCenter, targetZoom, { duration: 1.2 });
         } catch (e) {
            map.setView(targetCenter, targetZoom);
         }
      }
    }
  }));

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
        const map = L.map(mapContainerRef.current, {
            zoomControl: false, // Disable default zoom control to use custom buttons
            maxBounds: KOREA_BOUNDS,
            maxBoundsViscosity: 1.0,
            minZoom: 6,
            maxZoom: 18, // Increased max zoom for better detail
        });

        map.setView(INITIAL_CENTER, INITIAL_ZOOM);

        // OpenStreetMap Standard Tiles (Displays local language - Korean in Korea)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Initialize LayerGroup for nearby markers
        const nearbyGroup = L.layerGroup().addTo(map);
        nearbyLayerRef.current = nearbyGroup;

        mapInstanceRef.current = map;
    } catch (error) {
        console.error("Error initializing map:", error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        nearbyLayerRef.current = null;
      }
    };
  }, []);

  // Update Main Resort Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing resort markers
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
    if (!mapInstanceRef.current || !nearbyLayerRef.current) return;
    
    // Clear nearby markers from the LayerGroup
    nearbyLayerRef.current.clearLayers();

    if (selectedResort && selectedResort.nearby_places?.length) {
        // Group places by their location to detect overlaps
        const groupedPlaces: { [key: string]: NearbyPlace[] } = {};

        selectedResort.nearby_places.forEach(place => {
            // Use resort coordinates as fallback if place coordinates are missing
            let lat = place.latitude ?? selectedResort.latitude;
            let lng = place.longitude ?? selectedResort.longitude;

            // Rounding to detect overlaps (e.g. up to 5 decimal places is roughly ~1 meter precision)
            const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
            if (!groupedPlaces[key]) groupedPlaces[key] = [];
            
            // Store the effective coordinates in the object for rendering
            groupedPlaces[key].push({ ...place, latitude: lat, longitude: lng });
        });

        // Iterate through groups and render markers
        Object.values(groupedPlaces).forEach(group => {
            const firstPlace = group[0];
            const lat = firstPlace.latitude!;
            const lng = firstPlace.longitude!;
            const latLng = safeLatLng(lat, lng);

            if (!latLng) return;

            // IF GROUP HAS MULTIPLE ITEMS -> RENDER GROUP MARKER
            if (group.length > 1) {
                const marker = L.marker(latLng, {
                    icon: createGroupMarkerIcon(group.length),
                    zIndexOffset: 2000 // Higher zIndex to sit on top of resort marker if needed
                });

                // Build Popup List with better layout and hidden scrollbar
                const listHtml = group.map(p => {
                    let color = '#64748b'; // default
                    if (p.category === PlaceCategory.FOOD) color = '#f97316';
                    if (p.category === PlaceCategory.TOUR) color = '#22c55e';
                    if (p.category === PlaceCategory.STORE) color = '#3b82f6';
                    
                    return `
                       <div class="flex items-center justify-between py-2.5 px-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                           <div class="min-w-0 pr-3 flex-1">
                               <div class="font-bold text-slate-800 text-sm truncate leading-tight mb-0.5" title="${p.name}">${p.name}</div>
                               <div class="text-[11px] text-slate-500 truncate leading-tight">${p.description || 'No description'}</div>
                           </div>
                           <span class="text-[10px] text-white px-2 py-0.5 rounded-full flex-shrink-0 font-bold tracking-wide" style="background-color: ${color}">
                               ${p.category}
                           </span>
                       </div>
                    `;
               }).join('');
       
               const popupContent = `
                   <div class="font-sans min-w-[240px]">
                       <div class="bg-slate-700 text-white px-4 py-3 text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
                           ${group.length} Places Here
                       </div>
                       <div class="max-h-[200px] overflow-y-auto scrollbar-hide bg-white">
                           ${listHtml}
                       </div>
                   </div>
               `;

               // Bind popup with custom class to enable white close button
               marker.bindPopup(popupContent, { 
                   maxWidth: 300,
                   className: 'popup-dark-header' 
               });
               nearbyLayerRef.current?.addLayer(marker);

            } else {
                // IF SINGLE ITEM -> RENDER NORMAL MARKER
                const place = group[0];
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

                    const marker = L.marker(latLng, {
                        icon: markerIcon,
                        zIndexOffset: 500
                    });

                    marker.bindTooltip(place.name, {
                        permanent: false,
                        direction: 'bottom',
                        offset: [0, 8],
                        className: 'px-2 py-1 bg-white text-slate-800 text-xs rounded shadow border font-sans font-bold'
                    });

                    // Add padding wrapper since global popup padding was removed
                    marker.bindPopup(`
                        <div class="text-xs font-sans p-3 min-w-[180px]">
                            <strong class="block mb-1 text-slate-800 text-sm leading-tight">${place.name}</strong>
                            <div class="flex items-center space-x-2 mt-1 mb-1.5">
                                <span class="text-white px-2 py-0.5 rounded-full text-[10px] font-bold" style="background-color: ${color}">${place.category}</span>
                            </div>
                            <p class="text-slate-500 leading-normal">${place.description || ''}</p>
                        </div>
                    `);
                    
                    nearbyLayerRef.current?.addLayer(marker);

                } catch (e) {
                    console.error("Failed to create nearby marker", e);
                }
            }
        });
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
            type="button"
            onClick={handleResetView}
            className="bg-white w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-teal-600 hover:bg-slate-50 shadow-md transition-colors cursor-pointer"
            title="Reset View"
          >
            <IconHome className="w-5 h-5" />
          </button>

          {/* Zoom Controls Group */}
          <div className="flex flex-col rounded-lg shadow-md border border-slate-200 overflow-hidden bg-white">
            <button 
                type="button"
                onClick={handleZoomIn} 
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 border-b border-slate-100 transition-colors"
                title="Zoom In"
            >
                <IconPlus className="w-5 h-5" />
            </button>
            <button 
                type="button"
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
});

export default MapController;
