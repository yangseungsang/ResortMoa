
import React, { useState, useEffect, useRef } from 'react';
import { Resort, Region, Brand } from '../types';
import { useResorts } from '../core/hooks/useResorts';
import { getResortById, getRegions, getBrands } from '../services/resortService';
import MapController, { MapControllerHandle } from '../components/Map/MapController';
import ResortDetailPanel from '../components/ResortDetail/ResortDetailPanel';
import ApplicationGuide from '../components/Guide/ApplicationGuide';
import { MobileBottomSheet } from '../components/Layout/MobileBottomSheet';
import { IconSearch, IconMapPin, IconChevronLeft, IconMenu, IconBookOpen, IconCalendar, IconList, IconMap, IconX } from '../components/Icons';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const MainPage: React.FC = () => {
  const { resorts, totalCount, loading, filters, updateFilter } = useResorts();
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [regionOptions, setRegionOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const mapRef = useRef<MapControllerHandle>(null);

  // Fetch Options on Mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [regions, brands] = await Promise.all([getRegions(), getBrands()]);
        setRegionOptions(regions);
        setBrandOptions(brands);
      } catch (error) {
        console.error("Failed to load options", error);
      }
    };
    fetchOptions();
  }, []);

  const handleBackToList = () => {
      setSelectedResort(null);
  };

  const handleResortSelect = async (resort: Resort) => {
    // 1. Optimistic Update: Show summary data immediately
    setSelectedResort(resort);
    setShowGuide(false);
    setIsMobileListOpen(false); // Close mobile list view if open
    setIsSidebarCollapsed(false); // Auto-open sidebar on selection
    
    // Auto-move map to selected resort
    if (mapRef.current) {
        mapRef.current.flyToLocation(resort.latitude, resort.longitude);
    }

    // 2. Fetch Full Details: Get complete data (nearby_places, etc.) from server
    try {
        const fullData = await getResortById(resort.id);
        if (fullData) {
            setSelectedResort(fullData);
        }
    } catch (error) {
        console.error("Failed to fetch resort details", error);
        // Keep showing summary data if fetch fails
    }
  };

  const handleMoveToLocation = () => {
      if (selectedResort && mapRef.current) {
          mapRef.current.flyToLocation(selectedResort.latitude, selectedResort.longitude);
      }
  };

  const handleFlyToCoords = (lat: number, lng: number) => {
      if (mapRef.current) {
          mapRef.current.flyToLocation(lat, lng);
      }
  };

  const toggleGuide = () => {
      setShowGuide(!showGuide);
      if (!showGuide) {
          setSelectedResort(null);
          setIsSidebarCollapsed(false);
      }
  };

  // Trigger map resize when sidebar toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 350); // Wait for transition (300ms) to finish
    return () => clearTimeout(timer);
  }, [isSidebarCollapsed]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 relative">
      
      {/* Sidebar Container */}
      <div 
        className={`
            flex flex-col bg-white border-r border-slate-200 shadow-xl z-30 
            transition-all duration-300 ease-in-out h-full overflow-hidden relative
            md:relative md:flex
            ${isSidebarCollapsed ? 'md:w-0 md:border-none' : 'md:w-96'}
            ${isMobileListOpen ? 'fixed inset-0 z-[600] w-full' : 'hidden'}
        `}
      >
        {/* Sidebar Content */}
        <div className="w-full md:w-96 flex flex-col h-full whitespace-nowrap bg-white">
            {/* Conditional Rendering Logic */}
            {selectedResort ? (
                <ResortDetailPanel 
                    resort={selectedResort} 
                    onBack={handleBackToList}
                    onMoveToLocation={handleMoveToLocation}
                    onFlyToLocation={handleFlyToCoords}
                />
            ) : showGuide ? (
                <ApplicationGuide onBack={() => setShowGuide(false)} />
            ) : (
            <>
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex-shrink-0 flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
                            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Resort Moa</h1>
                        </div>
                        <p className="text-xs text-slate-400 font-medium ml-1">Smart Resort Locator</p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                        {/* Guide Toggle Button */}
                        <button 
                            onClick={toggleGuide}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-teal-600 transition-colors"
                            title="Application Guide"
                        >
                            <IconBookOpen className="w-5 h-5" />
                        </button>
                        
                        {/* Mobile: Close List Button */}
                        <button 
                            onClick={() => setIsMobileListOpen(false)}
                            className="md:hidden p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            title="Back to Map"
                        >
                            <IconX className="w-6 h-6" />
                        </button>

                        {/* Close Sidebar Button (Desktop) */}
                        <button 
                            onClick={() => setIsSidebarCollapsed(true)}
                            className="hidden md:flex p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            title="Close Sidebar"
                        >
                            <IconChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
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
                    onChange={(e) => updateFilter('searchQuery', e.target.value)}
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
                        onChange={(e) => updateFilter('selectedRegion', e.target.value)}
                    >
                        <option value="ALL">All Regions</option>
                        {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    </div>

                    {/* Brand Dropdown */}
                    <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">Brand</label>
                    <select
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        value={filters.selectedBrand}
                        onChange={(e) => updateFilter('selectedBrand', e.target.value)}
                    >
                        <option value="ALL">All Brands</option>
                        {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    </div>
                </div>
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 md:pb-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : resorts.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        No resorts found matching your criteria.
                    </div>
                ) : (
                    resorts.map(resort => {
                        const rule = resort.booking_rule;
                        return (
                        <div
                            key={resort.id}
                            onClick={() => handleResortSelect(resort)}
                            className="group rounded-xl border bg-white border-slate-100 hover:border-teal-200 hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden"
                        >
                            <ImageWithFallback 
                                src={resort.thumbnail_url} 
                                alt={resort.name} 
                                className="w-full h-40 object-cover bg-slate-200"
                            />
                            <div className="p-4 w-full">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-800 text-base truncate group-hover:text-teal-700 transition-colors">{resort.name}</h3>
                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded ml-2 flex-shrink-0">{resort.brand}</span>
                                </div>
                                <div className="flex items-center mt-2 text-slate-500 text-sm">
                                    <IconMapPin className="w-3.5 h-3.5 mr-1" />
                                    <span className="truncate">{resort.region_depth1} {resort.region_depth2}</span>
                                </div>
                                
                                {/* Brand Booking Info Badge (Using Unified Rule) */}
                                {rule && (
                                    <div className={`mt-3 flex items-center px-2 py-1.5 rounded border ${rule.ui_theme.bg} ${rule.ui_theme.border}`}>
                                        <IconCalendar className={`w-3 h-3 mr-1.5 ${rule.ui_theme.icon_color}`} />
                                        <span className={`text-[10px] font-bold ${rule.ui_theme.text}`}>{rule.badge_text}</span>
                                    </div>
                                )}

                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {(resort.facilities || []).slice(0, 3).map((fac, i) => (
                                        <span key={i} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 rounded border border-slate-100">{fac}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )})
                )}
                </div>
                
                {/* Status Bar */}
                <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-400 flex-shrink-0 hidden md:block">
                  Made by Resort Moa Team
                </div>

                {/* Mobile Floating Button inside List View to close it */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[400] md:hidden">
                    <button
                        onClick={() => setIsMobileListOpen(false)}
                        className="bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-lg font-semibold text-sm flex items-center space-x-2 active:scale-95 transition-transform"
                    >
                        <IconMap className="w-4 h-4" />
                        <span>Map View</span>
                    </button>
                </div>
            </>
            )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative h-full">
        {/* Mobile/Desktop Sidebar Toggle Button (Only visible on Desktop when sidebar is closed) */}
        <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className={`
                hidden md:flex absolute top-4 left-4 z-20 
                w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md 
                items-center justify-center text-slate-600 hover:text-teal-600 
                transition-all duration-300 active:scale-95
                ${!isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} 
            `}
            title="Open List"
        >
            <IconMenu className="w-5 h-5" />
        </button>

        <MapController 
            ref={mapRef}
            resorts={resorts} 
            selectedResort={selectedResort}
            onResortSelect={handleResortSelect} 
        />

        {/* MOBILE Bottom Sheet for Resort Detail ONLY */}
        <MobileBottomSheet 
            isVisible={!!selectedResort} 
            onClose={() => setSelectedResort(null)}
        >
            {selectedResort && (
                <ResortDetailPanel 
                    resort={selectedResort} 
                    onBack={() => setSelectedResort(null)}
                    onMoveToLocation={handleMoveToLocation}
                    onFlyToLocation={handleFlyToCoords}
                />
            )}
        </MobileBottomSheet>

        {/* MOBILE Full Page Guide Overlay */}
        {showGuide && (
            <div className="fixed inset-0 z-[500] bg-white md:hidden flex flex-col animate-fadeIn">
                <ApplicationGuide onBack={() => setShowGuide(false)} />
            </div>
        )}

        {/* MOBILE: List Toggle Button (Bottom Center) - Only visible when no resort selected */}
        {!selectedResort && !showGuide && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[400] md:hidden">
                <button
                    onClick={() => setIsMobileListOpen(true)}
                    className="bg-white text-slate-800 px-5 py-2.5 rounded-full shadow-lg font-semibold text-sm flex items-center space-x-2 border border-slate-100 active:scale-95 transition-transform"
                >
                    <IconList className="w-4 h-4" />
                    <span>List View</span>
                </button>
            </div>
        )}
      </div>

    </div>
  );
};

export default MainPage;
