
import { Resort, Review, FilterState, GuideSection } from '../types';
import { generateBookingRule } from '../core/utils/brandRules';

// --- Configuration ---
const getEnv = (key: string, fallback: string) => {
    try {
        // @ts-ignore
        return import.meta.env?.[key] || fallback;
    } catch {
        return fallback;
    }
};

const API_BASE_URL = getEnv('VITE_API_BASE_URL', 'https://seungsang-server.duckdns.org/api/v1');

// --- Helper Functions ---

/**
 * Ensures clean URL construction by removing trailing slashes from base URL
 */
const getBaseUrl = () => {
    return API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
};

/**
 * Ensures image URLs are absolute, prepending API_BASE_URL if relative.
 */
const normalizeImage = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  try {
      const domain = new URL(API_BASE_URL).origin; 
      return `${domain}${url.startsWith('/') ? '' : '/'}${url}`;
  } catch {
      return url;
  }
};

/**
 * Attempts to resolve a coordinate (lat/lng) from multiple possible keys in the raw data.
 */
const resolveCoordinate = (item: any, keys: string[]): number | undefined => {
  for (const key of keys) {
    if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
        const parsed = Number(item[key]);
        if (!Number.isNaN(parsed) && parsed !== 0) return parsed;
    }
  }
  return undefined;
};

// --- Data Transformation ---

const transformResortData = (data: any): Resort => {
  const rawNearby = data.nearby_places || data.nearbyPlaces || [];
  
  // Combine all image sources and remove duplicates
  const allImages = [
      data.thumbnail_url,
      ...(data.images || []),
      ...(data.more_images || [])
  ].filter(Boolean).map(normalizeImage);
  
  const uniqueImages = Array.from(new Set(allImages));

  return {
    id: data.id,
    name: data.name,
    brand: data.brand,
    region_depth1: data.region_depth1,
    region_depth2: data.region_depth2,
    latitude: resolveCoordinate(data, ['latitude', 'lat', 'mapy']) || 0,
    longitude: resolveCoordinate(data, ['longitude', 'lng', 'mapx']) || 0,
    address: data.address,
    check_in_out: data.check_in_out,
    thumbnail_url: normalizeImage(data.thumbnail_url),
    contact: data.contact,
    facilities: data.facilities || [],
    // Booking rule polyfill: Generate if missing from server
    booking_rule: data.booking_rule || generateBookingRule(data.brand, data.application_type),
    reviews: data.reviews || [],
    review_summary: data.review_summary,
    images: uniqueImages,
    rooms: (data.rooms || []).map((room: any) => ({
      ...room,
      image_path: normalizeImage(room.image_path),
      more_images: (room.more_images || []).map(normalizeImage)
    })),
    nearby_places: rawNearby.map((place: any) => ({
      ...place,
      latitude: resolveCoordinate(place, ['latitude', 'lat', 'mapy']),
      longitude: resolveCoordinate(place, ['longitude', 'lng', 'mapx']),
      image_url: normalizeImage(place.image_url || place.imageUrl),
      images: (place.images || []).map(normalizeImage),
      more_images: (place.more_images || []).map(normalizeImage)
    }))
  };
};

// --- API Methods ---

export const verifyPassword = async (password: string): Promise<boolean> => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/verify-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    // Handle HTTP Errors (4xx, 5xx) explicitly
    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error("Authentication Error:", error);
    // Re-throw so the UI can distinguish between 'Invalid Password' (true/false) and 'Network Error' (throw)
    throw error;
  }
};

export const getResorts = async (filters: FilterState): Promise<Resort[]> => {
  const params = new URLSearchParams();
  if (filters.selectedBrand !== 'ALL') params.append('brand', filters.selectedBrand);
  if (filters.selectedRegion !== 'ALL') params.append('region', filters.selectedRegion);
  if (filters.searchQuery) params.append('keyword', filters.searchQuery);

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/resorts?${params.toString()}`);
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  
  const data = await response.json();
  return data.map(transformResortData);
};

export const getResortById = async (id: number): Promise<Resort | undefined> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/resorts/${id}`);
  if (!response.ok) throw new Error('Resort not found');
  
  const data = await response.json();
  return transformResortData(data);
};

export const createReview = async (resortId: number, reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/resorts/${resortId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  
  if (!response.ok) throw new Error('Failed to post review');
  return await response.json();
};

export const getApplicationGuide = async (): Promise<GuideSection[]> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/guide`);
  if (!response.ok) throw new Error('Failed to fetch guide');
  return await response.json();
};

export const getRegions = async (): Promise<string[]> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/regions`);
  if (!response.ok) throw new Error('Failed to fetch regions');
  return await response.json();
};

export const getBrands = async (): Promise<string[]> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/brands`);
  if (!response.ok) throw new Error('Failed to fetch brands');
  return await response.json();
};
