
import { Resort, Review, FilterState, RoomType, NearbyPlace, GuideSection } from '../types';
import { generateBookingRule } from '../core/utils/brandRules';

// Configuration
// Now strictly using the Real API.
const getEnv = (key: string, fallback: string) => {
    try {
        // @ts-ignore
        return import.meta.env?.[key] || fallback;
    } catch {
        return fallback;
    }
};

const API_BASE_URL = getEnv('VITE_API_BASE_URL', 'https://seungsang-server.duckdns.org/api/v1');

// --- Helper: Normalize Image URLs ---
// If the server returns a relative path (e.g., /static/images/...), prepend the API domain.
const normalizeImage = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  try {
      const domain = new URL(API_BASE_URL).origin; 
      return `${domain}${url.startsWith('/') ? '' : '/'}${url}`;
  } catch (e) {
      return url;
  }
};

// --- Helper: Parse Coordinates ---
// Ensure coordinates are numbers and not strings or invalid values
const parseCoordinate = (coord: any): number | undefined => {
  if (coord === null || coord === undefined || coord === '') return undefined;
  const parsed = Number(coord);
  if (Number.isNaN(parsed) || parsed === 0) return undefined;
  return parsed;
};

// --- Helper: Resolve Coordinate from multiple keys ---
const resolveCoordinate = (item: any, keys: string[]) => {
  for (const key of keys) {
    const val = parseCoordinate(item[key]);
    if (val !== undefined) return val;
  }
  return undefined;
};

// Recursively transform resort data to fix image URLs AND COORDINATES
const transformResortData = (resortData: any): Resort => {
  // Handle potential API field casing differences (snake_case vs camelCase)
  const rawNearby = resortData.nearby_places || resortData.nearbyPlaces || [];
  
  // Debug Log for Nearby Places
  if (rawNearby.length > 0) {
      console.log(`[Resort: ${resortData.name}] Processing ${rawNearby.length} nearby places.`);
  }

  // Ensure Booking Rule exists (Polyfill if missing from server)
  // Access application_type from raw data if needed
  const bookingRule = resortData.booking_rule || generateBookingRule(resortData.brand, resortData.application_type);

  // Construct valid Resort object (removing application_type)
  const transformed: Resort = {
    id: resortData.id,
    name: resortData.name,
    brand: resortData.brand,
    region_depth1: resortData.region_depth1,
    region_depth2: resortData.region_depth2,
    latitude: resolveCoordinate(resortData, ['latitude', 'lat', 'mapy']) || 0,
    longitude: resolveCoordinate(resortData, ['longitude', 'lng', 'mapx']) || 0,
    address: resortData.address,
    check_in_out: resortData.check_in_out,
    thumbnail_url: normalizeImage(resortData.thumbnail_url),
    contact: resortData.contact,
    facilities: resortData.facilities,
    booking_rule: bookingRule,
    reviews: resortData.reviews,
    images: (resortData.images || []).map(normalizeImage),
    rooms: (resortData.rooms || []).map((room: RoomType) => ({
      ...room,
      image_path: normalizeImage(room.image_path),
      more_images: (room.more_images || []).map(normalizeImage)
    })),
    nearby_places: rawNearby.map((place: any) => {
      const lat = resolveCoordinate(place, ['latitude', 'lat', 'mapy']);
      const lng = resolveCoordinate(place, ['longitude', 'lng', 'mapx']);
      
      // Log missing coords for debugging
      if (lat === undefined || lng === undefined) {
         console.warn(`[Resort: ${resortData.name}] Nearby place '${place.name}' is missing coordinates.`, place);
      }

      return {
        ...place,
        // Robustly resolve coordinates looking for common aliases
        latitude: lat,
        longitude: lng,
        image_url: normalizeImage(place.image_url || place.imageUrl),
        images: (place.images || []).map(normalizeImage),
        more_images: (place.more_images || []).map(normalizeImage)
      };
    })
  };

  return transformed;
};

// --- Main Service Functions ---

/**
 * Fetch list of resorts with optional server-side filtering
 * STRICT SERVER MODE: No Mock Fallback
 */
export const getResorts = async (filters: FilterState): Promise<Resort[]> => {
  const params = new URLSearchParams();
  if (filters.selectedBrand !== 'ALL') params.append('brand', filters.selectedBrand);
  if (filters.selectedRegion !== 'ALL') params.append('region', filters.selectedRegion);
  if (filters.searchQuery) params.append('keyword', filters.searchQuery);

  const response = await fetch(`${API_BASE_URL}/resorts?${params.toString()}`);
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();
  console.log("[getResorts] Fetched data count:", data.length);
  return data.map(transformResortData);
};

/**
 * Fetch details for a specific resort
 * STRICT SERVER MODE: No Mock Fallback
 */
export const getResortById = async (id: number): Promise<Resort | undefined> => {
  const response = await fetch(`${API_BASE_URL}/resorts/${id}`);
  if (!response.ok) throw new Error('Resort not found');
  const data = await response.json();
  console.log(`[getResortById] Fetched details for ID ${id}`, data);
  return transformResortData(data);
};

/**
 * Submit a new review
 * STRICT SERVER MODE: No Mock Success
 */
export const createReview = async (resortId: number, reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  const response = await fetch(`${API_BASE_URL}/resorts/${resortId}/reviews`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reviewData)
  });
  if (!response.ok) throw new Error('Failed to post review');
  return await response.json();
};

/**
 * Fetch Application Guide
 * STRICT SERVER MODE
 */
export const getApplicationGuide = async (): Promise<GuideSection[]> => {
  const response = await fetch(`${API_BASE_URL}/guide`);
  if (!response.ok) throw new Error('Failed to fetch application guide');
  return await response.json();
};

/**
 * Fetch available regions from server
 */
export const getRegions = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/regions`);
  if (!response.ok) throw new Error('Failed to fetch regions');
  return await response.json();
};

/**
 * Fetch available brands from server
 */
export const getBrands = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/brands`);
  if (!response.ok) throw new Error('Failed to fetch brands');
  return await response.json();
};
