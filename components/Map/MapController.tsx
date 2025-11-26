import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Resort, PlaceCategory } from '../../types';

// Define marker icons using CDN links because importing images directly 
// is not supported in browser-native ES modules without a bundler loader.
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

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

const MapController: React.FC<MapControllerProps> = ({ resorts, selectedResort, onResortSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const nearbyMarkersRef = useRef<L.CircleMarker[]>([]);

  // Helper to validate coordinates strict check
  const isValidCoordinate = (lat: any, lng: any): boolean => {
    const numLat = Number(lat);
    const numLng = Number(lng);
    return Number.isFinite(numLat) && Number.isFinite(numLng);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default icon setup
    L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
    });

    try {
        // Create Map - Centered on South Korea
        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            maxBounds: KOREA_BOUNDS, // Restrict panning to Korea
            maxBoundsViscosity: 1.0, // Solid bounce on edges
            minZoom: 6,
            maxZoom: 14, // Cap zoom to prevent markers from feeling too huge/overlapping excessively
        });

        // Safe initial view set
        map.setView([36.5, 127.8], 7);

        // Add Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);

        // Add zoom control to bottom right
        L.control.zoom({
            position: 'bottomright'
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

    // Clear existing resort markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    resorts.forEach(resort => {
      const lat = Number(resort.latitude);
      const lng = Number(resort.longitude);

      // Validate coordinates before creating marker
      if (!isValidCoordinate(lat, lng)) {
        return;
      }

      try {
          const marker = L.marker(L.latLng(lat, lng), {
              title: resort.name,
              opacity: selectedResort && selectedResort.id !== resort.id ? 0.6 : 1.0 // Dim others if one selected
          })
          .addTo(map)
          .on('click', () => {
              onResortSelect(resort);
          });
          
          // Add tooltip
          if (!selectedResort) {
              marker.bindTooltip(resort.name, {
                  permanent: false,
                  direction: 'top',
                  offset: [0, -30],
                  className: 'px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg border-0'
              });
          }

          markersRef.current.push(marker);
      } catch (e) {
          console.error(`Failed to create marker for ${resort.name}`, e);
      }
    });

  }, [resorts, onResortSelect, selectedResort]); // Re-run when selection changes to update opacity

  // Handle Selection Focus & Nearby Places
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Ensure map knows its container size (prevents flyTo issues)
    map.invalidateSize();

    // Clear previous nearby markers
    nearbyMarkersRef.current.forEach(m => m.remove());
    nearbyMarkersRef.current = [];

    if (selectedResort) {
        const lat = Number(selectedResort.latitude);
        const lng = Number(selectedResort.longitude);

        // Validate before flying
        if (isValidCoordinate(lat, lng)) {
            try {
                const target = L.latLng(lat, lng);
                // Fly to selected resort FASTER
                map.flyTo(target, 12, {
                    duration: 0.8
                });
            } catch (e) {
                console.warn("FlyTo failed, falling back to setView", e);
                try {
                    map.setView(L.latLng(lat, lng), 12);
                } catch (innerE) {
                    console.error("setView fallback failed", innerE);
                }
            }
        }

        // Add nearby markers
        if (selectedResort.nearby_places && Array.isArray(selectedResort.nearby_places)) {
            selectedResort.nearby_places.forEach(place => {
                const pLat = Number(place.latitude);
                const pLng = Number(place.longitude);

                if (isValidCoordinate(pLat, pLng)) {
                    let color = '#64748b'; // default slate
                    if (place.category === PlaceCategory.FOOD) color = '#f97316'; // orange
                    if (place.category === PlaceCategory.TOUR) color = '#22c55e'; // green
                    if (place.category === PlaceCategory.STORE) color = '#3b82f6'; // blue

                    try {
                        const marker = L.circleMarker(L.latLng(pLat, pLng), {
                            radius: 8,
                            fillColor: color,
                            color: '#fff',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.9
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
        // Reset View logic
        try {
            const center = L.latLng(36.5, 127.8);
            map.flyTo(center, 7, { duration: 0.8 });
        } catch (e) {
            console.warn("FlyTo reset failed, falling back to setView", e);
             try {
                map.setView(L.latLng(36.5, 127.8), 7);
            } catch (innerE) {
                console.error("setView reset failed", innerE);
            }
        }
    }
  }, [selectedResort]);

  return (
    <div className="relative w-full h-full z-0">
      <div ref={mapContainerRef} className="w-full h-full bg-slate-200" />
      
      {/* Overlay Information for Offline/GeoJSON note */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded text-[10px] text-slate-500 z-[400] pointer-events-none shadow-sm">
        Korea Vector Map {selectedResort ? '• Nearby Places Active' : ''}
      </div>
    </div>
  );
};

export default MapController;