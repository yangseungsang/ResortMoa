import { Resort, Review, FilterState } from '../types';
import { MOCK_RESORTS } from './mockData';

// Configuration: Set to true to use real backend API
const USE_REAL_API = false;
const API_BASE_URL = '/api/v1';

/**
 * Fetch list of resorts with optional server-side filtering
 */
export const getResorts = async (filters: FilterState): Promise<Resort[]> => {
  if (USE_REAL_API) {
    // Real API Implementation
    const params = new URLSearchParams();
    if (filters.selectedBrand !== 'ALL') params.append('brand', filters.selectedBrand);
    if (filters.selectedRegion !== 'ALL') params.append('region', filters.selectedRegion);
    if (filters.searchQuery) params.append('keyword', filters.searchQuery);

    try {
      const response = await fetch(`${API_BASE_URL}/resorts?${params.toString()}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch resorts from API", error);
      throw error;
    }
  } else {
    // Mock Adapter (Simulates Server-side filtering)
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...MOCK_RESORTS];

        // 1. Filter by Brand
        if (filters.selectedBrand !== 'ALL') {
          results = results.filter(r => r.brand === filters.selectedBrand);
        }

        // 2. Filter by Region
        if (filters.selectedRegion !== 'ALL') {
          results = results.filter(r => r.region_depth1 === filters.selectedRegion);
        }

        // 3. Search by Keyword (Name or Address)
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase().trim();
          results = results.filter(r => 
            r.name.toLowerCase().includes(query) || 
            r.address.toLowerCase().includes(query)
          );
        }

        resolve(results);
      }, 300); // Simulate network latency
    });
  }
};

/**
 * Fetch details for a specific resort
 */
export const getResortById = async (id: number): Promise<Resort | undefined> => {
  if (USE_REAL_API) {
    const response = await fetch(`${API_BASE_URL}/resorts/${id}`);
    if (!response.ok) throw new Error('Resort not found');
    return response.json();
  } else {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_RESORTS.find(r => r.id === id));
      }, 200);
    });
  }
};

/**
 * Submit a new review
 */
export const createReview = async (resortId: number, reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  if (USE_REAL_API) {
    const response = await fetch(`${API_BASE_URL}/resorts/${resortId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) throw new Error('Failed to post review');
    return response.json();
  } else {
    // Mock Adapter
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview: Review = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          ...reviewData
        };
        
        // In-memory update for mock experience
        const resort = MOCK_RESORTS.find(r => r.id === resortId);
        if (resort) {
          if (!resort.reviews) resort.reviews = [];
          resort.reviews.unshift(newReview);
        }
        
        resolve(newReview);
      }, 500);
    });
  }
};
