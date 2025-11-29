import L from 'leaflet';

// Helper to strictly validate coordinates
export const isValidCoordinate = (lat: any, lng: any): boolean => {
  const numLat = Number(lat);
  const numLng = Number(lng);
  return Number.isFinite(numLat) && Number.isFinite(numLng);
};

// Helper to safely create LatLng object
export const safeLatLng = (lat: any, lng: any): L.LatLng | null => {
  if (isValidCoordinate(lat, lng)) {
    return L.latLng(Number(lat), Number(lng));
  }
  return null;
};
