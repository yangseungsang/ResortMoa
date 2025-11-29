import { useState, useEffect, useCallback } from 'react';
import { Resort, FilterState } from '../../types';
import { getResorts } from '../../services/resortService';

// Debounce helper to prevent excessive API calls
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export const useResorts = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedRegion: 'ALL',
    selectedBrand: 'ALL',
  });

  // Debounce search query to avoid calling API on every keystroke
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 400);

  const fetchFilteredResorts = useCallback(async () => {
    setLoading(true);
    try {
      const activeFilters = { ...filters, searchQuery: debouncedSearchQuery };
      const data = await getResorts(activeFilters);
      setResorts(data);
    } catch (error) {
      console.error("Failed to load resorts", error);
    } finally {
      setLoading(false);
    }
  }, [filters.selectedRegion, filters.selectedBrand, debouncedSearchQuery]);

  // Effect triggers when filters (region/brand) change or search query is debounced
  useEffect(() => {
    fetchFilteredResorts();
  }, [fetchFilteredResorts]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    resorts,
    totalCount: resorts.length,
    loading,
    filters,
    updateFilter
  };
};
