import React, { useState, useEffect, useMemo } from 'react';
import { Resort, Region, Brand, FilterState } from '../types';
import { fetchResorts } from '../services/mockData';
import MapController from '../components/Map/MapController';
import ResortDetailPanel from '../components/ResortDetail/ResortDetailPanel';
import { IconSearch, IconMapPin } from '../components/Icons';

const MainPage: React.FC = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedRegion: 'ALL',
    selectedBrand: 'ALL',
  });

  // Initial Load
  useEffect(() => {
    fetchResorts().then(data => {
      setResorts(data);
      setLoading(false);
    });
  }, []);

  // Filter Logic
  const filteredResorts = useMemo(() => {
    return resorts.filter(resort => {
      const matchesSearch = resort.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
                            resort.address.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesRegion = filters.selectedRegion === 'ALL' || resort.region_depth1 === filters.selectedRegion;
      const matchesBrand = filters.selectedBrand === 'ALL' || resort.brand === filters.selectedBrand;
      
      return matchesSearch && matchesRegion && matchesBrand;
    });
  }, [resorts, filters]);

  // Handlers
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBackToList = () => {
      setSelectedResort(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      
      {/* Sidebar - Persistent on Desktop */}
      <div className="w-96 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-xl z-20 h-full relative">
        
        {/* Conditional Rendering: List View or Detail View */}
        {selectedResort ? (
           <ResortDetailPanel 
              resort={selectedResort} 
              onBack={handleBackToList} 
           />
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center space-x-2 mb-1">
                 <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
                 <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Resort Moa</h1>
              </div>
              <p className="text-xs text-slate-400 font-medium ml-1">Smart Resort Locator</p>
            </div>

            {/* Filters */}
            <div className="p-4 space-y-4 bg-slate-50/50 flex-shrink-0">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resorts..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                />
                <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Region Dropdown */}
                <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">Region</label>
                   <select
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    value={filters.selectedRegion}
                    onChange={(e) => handleFilterChange('selectedRegion', e.target.value)}
                  >
                    <option value="ALL">All Regions</option>
                    {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Brand Dropdown */}
                <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">Brand</label>
                   <select
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    value={filters.selectedBrand}
                    onChange={(e) => handleFilterChange('selectedBrand', e.target.value)}
                  >
                    <option value="ALL">All Brands</option>
                    {Object.values(Brand).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                 <div className="flex justify-center py-10">
                     <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                 </div>
              ) : filteredResorts.length === 0 ? (
                 <div className="text-center py-10 text-slate-400 text-sm">
                     No resorts found matching your criteria.
                 </div>
              ) : (
                filteredResorts.map(resort => (
                  <div
                    key={resort.id}
                    onClick={() => setSelectedResort(resort)}
                    className="group p-3 rounded-xl border bg-white border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all cursor-pointer flex items-start space-x-3"
                  >
                    <img 
                        src={resort.thumbnail_url} 
                        alt={resort.name} 
                        className="w-16 h-16 rounded-lg object-cover bg-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-teal-700 transition-colors">{resort.name}</h3>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded ml-2">{resort.brand}</span>
                      </div>
                      <div className="flex items-center mt-1 text-slate-500 text-xs">
                        <IconMapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{resort.region_depth1} {resort.region_depth2}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                          {resort.facilities.slice(0, 2).map((fac, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100">{fac}</span>
                          ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Status Bar */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-400 flex-shrink-0">
               {filteredResorts.length} Resorts Available
            </div>
          </>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 relative h-full">
        <MapController 
            resorts={filteredResorts} 
            selectedResort={selectedResort}
            onResortSelect={setSelectedResort} 
        />
      </div>

    </div>
  );
};

export default MainPage;