
import React, { useState, useEffect, useRef } from 'react';
import { Resort } from '../types';
import { useResorts } from '../core/hooks/useResorts';
import { getResortById, getRegions, getBrands } from '../services/resortService';
import MapController, { MapControllerHandle } from '../components/Map/MapController';
import ResortDetailPanel from '../components/ResortDetail/ResortDetailPanel';
import ApplicationGuide from '../components/Guide/ApplicationGuide';
import { MobileBottomSheet } from '../components/Layout/MobileBottomSheet';
import { IconSearch, IconMapPin, IconChevronLeft, IconMenu, IconBookOpen, IconCalendar, IconX, IconMap, IconList } from '../components/Icons';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const MainPage: React.FC = () => {
  // --- State ---
  const { resorts, loading, filters, updateFilter } = useResorts();
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  
  // Filter Options
  const [regionOptions, setRegionOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  
  const mapRef = useRef<MapControllerHandle>(null);
  const [cameFromMobileList, setCameFromMobileList] = useState(false);

  // --- Effects ---
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

  // Map resize trigger when sidebar toggles
  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
    return () => clearTimeout(timer);
  }, [isSidebarCollapsed]);

  // --- Handlers ---
  const handleBackToList = () => {
      setSelectedResort(null);
      if (cameFromMobileList) {
          setIsMobileListOpen(true);
          setCameFromMobileList(false);
      }
  };

  const handleResortSelect = async (resort: Resort) => {
    setCameFromMobileList(isMobileListOpen);

    // Optimistic Update
    setSelectedResort(resort);
    setShowGuide(false);
    setIsMobileListOpen(false);
    setIsSidebarCollapsed(false);
    
    mapRef.current?.flyToLocation(resort.latitude, resort.longitude);

    // Fetch Full Details
    try {
        const fullData = await getResortById(resort.id);
        if (fullData) setSelectedResort(fullData);
    } catch (error) {
        console.error("Failed to fetch resort details", error);
    }
  };

  const handleFlyToCoords = (lat: number, lng: number) => {
      mapRef.current?.flyToLocation(lat, lng);
  };

  const toggleGuide = () => {
      const nextState = !showGuide;
      setShowGuide(nextState);
      if (nextState) {
          setSelectedResort(null);
          setIsSidebarCollapsed(false);
      }
  };

  // --- Render Helpers ---
  const renderResortCard = (resort: Resort) => {
    const rule = resort.booking_rule;
    
    // Facility Display Logic: Show max 3, then +N
    const facilities = resort.facilities || [];
    const visibleFacilities = facilities.slice(0, 3);
    const hiddenCount = facilities.length - 3;

    return (
        <div key={resort.id} onClick={() => handleResortSelect(resort)}
            className="group rounded-xl border bg-white border-slate-100 hover:border-teal-200 hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden"
        >
            <ImageWithFallback src={resort.thumbnail_url} alt={resort.name} className="w-full h-40 object-cover bg-slate-200" />
            <div className="p-4 w-full">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 text-base truncate group-hover:text-teal-700">{resort.name}</h3>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded ml-2 flex-shrink-0">{resort.brand}</span>
                </div>
                <div className="flex items-center mt-2 text-slate-500 text-sm">
                    <IconMapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{resort.region_depth1} {resort.region_depth2}</span>
                </div>
                {rule && (
                    <div className={`mt-3 flex items-center px-2 py-1.5 rounded border ${rule.ui_theme.bg} ${rule.ui_theme.border}`}>
                        <IconCalendar className={`w-3 h-3 mr-1.5 ${rule.ui_theme.icon_color}`} />
                        <span className={`text-[10px] font-bold ${rule.ui_theme.text}`}>{rule.badge_text}</span>
                    </div>
                )}
                
                {/* Facilities List */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {visibleFacilities.map((fac, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 rounded border border-slate-100 whitespace-nowrap">
                            {fac}
                        </span>
                    ))}
                    {hiddenCount > 0 && (
                        <span className="text-[10px] px-2 py-1 bg-slate-50 text-slate-400 rounded border border-slate-100 font-medium">
                            +{hiddenCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 relative">
      {/* Sidebar */}
      <div className={`
            flex flex-col bg-white border-r border-slate-200 shadow-xl z-30 
            transition-all duration-300 ease-in-out h-full overflow-hidden relative
            md:relative md:flex
            ${isSidebarCollapsed ? 'md:w-0 md:border-none' : 'md:w-96'}
            ${isMobileListOpen ? 'fixed inset-0 z-[600] w-full' : 'hidden'}
      `}>
        <div className="w-full md:w-96 flex flex-col h-full whitespace-nowrap bg-white">
            {selectedResort ? (
                <ResortDetailPanel 
                    resort={selectedResort} 
                    onBack={handleBackToList}
                    onMoveToLocation={() => handleFlyToCoords(selectedResort.latitude, selectedResort.longitude)}
                    onFlyToLocation={handleFlyToCoords}
                />
            ) : showGuide ? (
                <ApplicationGuide onBack={() => setShowGuide(false)} />
            ) : (
            <>
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex-shrink-0 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <ImageWithFallback 
                          src="https://seungsang-server.duckdns.org/static/images/logo.png" 
                          alt="Resort Moa" 
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-800 leading-none tracking-tight">Resort Moa</h1>
                            <p className="text-[11px] text-slate-400 font-medium">Smart Resort Locator</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button onClick={toggleGuide} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-teal-600 transition-colors" title="Guide">
                            <IconBookOpen className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsMobileListOpen(false)} className="md:hidden p-2 hover:bg-slate-100 rounded-full text-slate-400" title="Close">
                            <IconX className="w-6 h-6" />
                        </button>
                        <button onClick={() => setIsSidebarCollapsed(true)} className="hidden md:flex p-2 hover:bg-slate-100 rounded-full text-slate-400" title="Collapse">
                            <IconChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 space-y-4 bg-slate-50/50 flex-shrink-0 border-b border-slate-100">
                    <div className="relative">
                        <input
                            type="text" placeholder="Search resorts..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
                            value={filters.searchQuery} onChange={(e) => updateFilter('searchQuery', e.target.value)}
                        />
                        <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">Region</label>
                            <select 
                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                value={filters.selectedRegion} onChange={(e) => updateFilter('selectedRegion', e.target.value)}
                            >
                                <option value="ALL">All Regions</option>
                                {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">Brand</label>
                            <select 
                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                value={filters.selectedBrand} onChange={(e) => updateFilter('selectedBrand', e.target.value)}
                            >
                                <option value="ALL">All Brands</option>
                                {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 md:pb-4 scrollbar-hide">
                    {loading ? (
                        <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div></div>
                    ) : resorts.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">No resorts found.</div>
                    ) : (
                        resorts.map(renderResortCard)
                    )}
                </div>
                
                <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-400 flex-shrink-0 hidden md:block">
                    Made by Resort Moa Team
                </div>

                {/* Mobile Floating Map Button (Only on List View) */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[400] md:hidden">
                    <button onClick={() => setIsMobileListOpen(false)} className="bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-lg font-semibold text-sm flex items-center space-x-2 active:scale-95 transition-transform">
                        <IconMap className="w-4 h-4" /><span>Map View</span>
                    </button>
                </div>
            </>
            )}
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative h-full">
        <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className={`
                hidden md:flex absolute top-4 left-4 z-20 
                w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md 
                items-center justify-center text-slate-600 hover:text-teal-600 
                transition-all duration-300 active:scale-95
                ${!isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} 
            `}
            title="Open Sidebar"
        >
            <IconMenu className="w-5 h-5" />
        </button>

        <MapController 
            ref={mapRef} 
            resorts={resorts} 
            selectedResort={selectedResort} 
            onResortSelect={handleResortSelect} 
        />

        <MobileBottomSheet isVisible={!!selectedResort} onClose={handleBackToList}>
            {selectedResort && (
                <ResortDetailPanel 
                    resort={selectedResort} 
                    onBack={handleBackToList}
                    onMoveToLocation={() => handleFlyToCoords(selectedResort.latitude, selectedResort.longitude)}
                    onFlyToLocation={handleFlyToCoords}
                />
            )}
        </MobileBottomSheet>

        {showGuide && (
            <div className="fixed inset-0 z-[500] bg-white md:hidden flex flex-col animate-fadeIn">
                <ApplicationGuide onBack={() => setShowGuide(false)} />
            </div>
        )}

        {!selectedResort && !showGuide && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[400] md:hidden">
                <button onClick={() => setIsMobileListOpen(true)} className="bg-white text-slate-800 px-5 py-2.5 rounded-full shadow-lg font-semibold text-sm flex items-center space-x-2 border border-slate-100 active:scale-95 transition-transform">
                    <IconList className="w-4 h-4" /><span>List View</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
