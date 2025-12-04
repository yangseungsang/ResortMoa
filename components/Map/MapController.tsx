
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import { Resort, PlaceCategory, NearbyPlace } from '../../types';
import { safeLatLng } from '../../core/utils/mapUtils';
import { IconHome, IconPlus, IconMinus } from '../Icons';

export interface MapControllerHandle {
  flyToLocation: (lat: number, lng: number) => void;
}

interface MapControllerProps {
  resorts: Resort[];
  selectedResort: Resort | null;
  onResortSelect: (resort: Resort) => void;
  onNearbySelect?: (placeId: number) => void;
}

const KOREA_BOUNDS = L.latLngBounds([32.8, 124.5], [38.9, 132.0]);
const INITIAL_CENTER = L.latLng(36.5, 127.8);
const INITIAL_ZOOM = 7;

// --- Marker Factories ---

const createCustomMarker = (color: string) => L.divIcon({
  className: 'custom-marker',
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="white"></circle>
    </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const createNearbyMarkerIcon = (color: string) => L.divIcon({
  className: 'nearby-marker',
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -7]
});

const createNearbyImageMarker = (imageUrl: string, color: string) => L.divIcon({
  className: '',
  html: `
    <div style="position: relative; width: 44px; height: 50px;">
        <div style="width: 44px; height: 44px; border-radius: 50%; border: 3px solid ${color}; background: white; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); z-index: 10; position: relative;">
            <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.style.background='${color}';" />
        </div>
        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${color}; z-index: 5;"></div>
    </div>`,
  iconSize: [44, 50],
  iconAnchor: [22, 50],
  popupAnchor: [0, -50]
});

const createGroupMarkerIcon = (count: number) => L.divIcon({
  className: 'group-marker',
  html: `
    <div style="background-color: #334155; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15); font-family: ui-sans-serif, system-ui, sans-serif;">
      ${count}
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// --- Component ---

const MapController = forwardRef<MapControllerHandle, MapControllerProps>(({ resorts, selectedResort, onResortSelect, onNearbySelect }, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const nearbyLayerRef = useRef<L.LayerGroup | null>(null);
  
  const onResortSelectRef = useRef(onResortSelect);
  const onNearbySelectRef = useRef(onNearbySelect);

  useEffect(() => {
    onResortSelectRef.current = onResortSelect;
    onNearbySelectRef.current = onNearbySelect;
  }, [onResortSelect, onNearbySelect]);

  // Setup Global Handler for Popup Clicks (Bridge between Leaflet HTML and React)
  useEffect(() => {
    (window as any).resortMoaOnNearbyClick = (id: number) => {
        if (onNearbySelectRef.current) {
            onNearbySelectRef.current(id);
        }
    };
    return () => {
        delete (window as any).resortMoaOnNearbyClick;
    }
  }, []);

  useImperativeHandle(ref, () => ({
    flyToLocation: (lat: number, lng: number) => {
      const map = mapInstanceRef.current;
      if (!map) return;
      
      const latLng = safeLatLng(lat, lng);
      if (latLng) {
         const targetZoom = 15;
         let targetCenter = latLng;

         // Mobile Adjustment
         if (window.innerWidth < 768) {
            const mapSize = map.getSize();
            const offsetY = mapSize.y * 0.25; 
            const point = map.project(latLng, targetZoom);
            const newPoint = point.add([0, offsetY]);
            targetCenter = map.unproject(newPoint, targetZoom);
         }

         try {
            map.flyTo(targetCenter, targetZoom, { 
                duration: 1.5,
                easeLinearity: 0.25,
                noMoveStart: true 
            });
         } catch {
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
            zoomControl: false,
            maxBounds: KOREA_BOUNDS,
            maxBoundsViscosity: 1.0,
            minZoom: 6,
            maxZoom: 18,
            preferCanvas: true,
            zoomSnap: 0, 
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 120
        });

        const isMobile = window.innerWidth < 768;
        map.setView(INITIAL_CENTER, isMobile ? 6 : INITIAL_ZOOM);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        nearbyLayerRef.current = L.layerGroup().addTo(map);
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

  // Marker Lifecycle Management (Create/Remove)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const currentMarkers = markersRef.current;
    const resortIds = new Set(resorts.map(r => r.id));

    // Remove
    for (const [id, marker] of currentMarkers.entries()) {
        if (!resortIds.has(id)) {
            marker.remove();
            currentMarkers.delete(id);
        }
    }

    // Add
    resorts.forEach(resort => {
        if (!currentMarkers.has(resort.id)) {
            const latLng = safeLatLng(resort.latitude, resort.longitude);
            if (!latLng) return;

            const markerIcon = createCustomMarker('#0d9488');
            const marker = L.marker(latLng, {
                title: resort.name,
                icon: markerIcon,
                opacity: 1.0,
                zIndexOffset: 100
            }).addTo(map);

            marker.on('click', () => onResortSelectRef.current(resort));
            
            marker.bindTooltip(resort.name, {
                permanent: false, direction: 'top', offset: [0, -36],
                className: 'px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg border-0 font-sans'
            });

            currentMarkers.set(resort.id, marker);
        }
    });
  }, [resorts]);

  // Visual Updates (State Changes)
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
        const isSelected = selectedResort?.id === id;
        
        const newColor = isSelected ? '#dc2626' : '#0d9488';
        const newIcon = createCustomMarker(newColor);
        
        marker.setIcon(newIcon);
        marker.setZIndexOffset(isSelected ? 1000 : 100);
        
        const opacity = (selectedResort && !isSelected) ? 0.8 : 1.0;
        marker.setOpacity(opacity);
    });
  }, [selectedResort]);

  // Update Nearby Places
  useEffect(() => {
    if (!mapInstanceRef.current || !nearbyLayerRef.current) return;
    nearbyLayerRef.current.clearLayers();

    if (selectedResort && selectedResort.nearby_places?.length) {
        const groupedPlaces: { [key: string]: NearbyPlace[] } = {};

        selectedResort.nearby_places.forEach(place => {
            const lat = place.latitude ?? selectedResort.latitude;
            const lng = place.longitude ?? selectedResort.longitude;
            const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
            if (!groupedPlaces[key]) groupedPlaces[key] = [];
            groupedPlaces[key].push({ ...place, latitude: lat, longitude: lng });
        });

        Object.values(groupedPlaces).forEach(group => {
            const firstPlace = group[0];
            const latLng = safeLatLng(firstPlace.latitude, firstPlace.longitude);
            if (!latLng) return;

            if (group.length > 1) {
                // Cluster
                const marker = L.marker(latLng, { icon: createGroupMarkerIcon(group.length), zIndexOffset: 2000 });
                const listHtml = group.map(p => `
                       <div 
                         onclick="window.resortMoaOnNearbyClick(${p.id})"
                         class="flex items-center justify-between py-2 px-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer active:bg-slate-100 transition-colors"
                       >
                           <span class="font-bold text-slate-800 text-xs truncate pointer-events-none">${p.name}</span>
                           <span class="text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold pointer-events-none" style="background-color: ${getColorForCategory(p.category)}">${p.category}</span>
                       </div>`).join('');
       
               marker.bindPopup(`
                   <div class="font-sans min-w-[200px]">
                       <div class="bg-slate-700 text-white px-3 py-2 text-xs font-bold uppercase sticky top-0 z-10">${group.length} Places</div>
                       <div class="max-h-[200px] overflow-y-auto scrollbar-hide bg-white">${listHtml}</div>
                   </div>
               `, { maxWidth: 300, className: 'popup-dark-header' });
               nearbyLayerRef.current?.addLayer(marker);
            } else {
                // Single
                const place = group[0];
                const color = getColorForCategory(place.category);
                const imageUrl = (place.images && place.images.length > 0) ? place.images[0] : place.image_url;
                const markerIcon = imageUrl ? createNearbyImageMarker(imageUrl, color) : createNearbyMarkerIcon(color);

                const marker = L.marker(latLng, { icon: markerIcon, zIndexOffset: 500 });
                
                // Add click handler to marker for direct navigation
                marker.on('click', () => {
                    if (onNearbySelectRef.current) {
                        onNearbySelectRef.current(place.id);
                    }
                });

                marker.bindTooltip(place.name, {
                    permanent: false, direction: 'bottom', offset: [0, 8],
                    className: 'px-2 py-1 bg-white text-slate-800 text-xs rounded shadow border font-sans font-bold'
                });
                
                // Popup removed to allow direct navigation on click
                nearbyLayerRef.current?.addLayer(marker);
            }
        });
    }
  }, [selectedResort]);

  const getColorForCategory = (cat: PlaceCategory) => {
    switch(cat) {
      case PlaceCategory.FOOD: return '#f97316';
      case PlaceCategory.TOUR: return '#22c55e';
      case PlaceCategory.STORE: return '#3b82f6';
      default: return '#64748b';
    }
  };

  return (
    <div className="relative w-full h-full z-0">
      <div ref={mapContainerRef} className="w-full h-full bg-slate-200" />
      
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col items-center space-y-3">
          <button onClick={() => mapInstanceRef.current?.setView(INITIAL_CENTER, INITIAL_ZOOM)} 
            className="bg-white w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-teal-600 shadow-md">
            <IconHome className="w-5 h-5" />
          </button>
          <div className="flex flex-col rounded-lg shadow-md border border-slate-200 overflow-hidden bg-white">
            <button onClick={() => mapInstanceRef.current?.zoomIn()} className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 border-b border-slate-100"><IconPlus className="w-5 h-5" /></button>
            <button onClick={() => mapInstanceRef.current?.zoomOut()} className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600"><IconMinus className="w-5 h-5" /></button>
          </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded text-[10px] text-slate-500 z-[400] pointer-events-none shadow-sm">
        OpenStreetMap {selectedResort ? '• Nearby Places Active' : ''}
      </div>
    </div>
  );
});

export default MapController;
