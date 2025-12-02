import React from 'react';
import { Resort } from '../../types';
import { useResortDetail, DetailTab } from '../../core/hooks/useResortDetail';
import { IconArrowLeft } from '../Icons';
import { RoomDetailView, NearbyDetailView } from './views/DetailViews';
import { OverviewTab } from './tabs/OverviewTab';
import { RoomsTab, NearbyTab } from './tabs/DetailTabs';

interface ResortDetailPanelProps {
  resort: Resort;
  onBack: () => void;
  onMoveToLocation?: () => void;
  onFlyToLocation?: (lat: number, lng: number) => void;
}

const ResortDetailPanel: React.FC<ResortDetailPanelProps> = ({ 
  resort, 
  onBack, 
  onMoveToLocation, 
  onFlyToLocation 
}) => {
  const detailHook = useResortDetail(resort);
  const { state, actions } = detailHook;
  const { activeTab, selectedRoom, selectedNearby } = state;

  // 1. Show Room Detail View
  if (selectedRoom) {
    return <RoomDetailView room={selectedRoom} onBack={() => actions.setSelectedRoom(null)} />;
  }

  // 2. Show Nearby Place Detail View
  if (selectedNearby) {
    return <NearbyDetailView place={selectedNearby} onBack={() => actions.setSelectedNearby(null)} />;
  }

  // 3. Main Resort Detail Panel
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0">
        <button onClick={onBack} className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <IconArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1 cursor-pointer hover:opacity-70 transition-opacity" onClick={onMoveToLocation} title="Move map to resort">
          <h2 className="text-lg font-bold text-slate-800 truncate leading-tight">{resort.name}</h2>
          <p className="text-xs text-slate-500 truncate">{resort.region_depth1} {resort.region_depth2}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 flex-shrink-0">
        {Object.values(DetailTab).map((tab) => (
          <button
            key={tab}
            onClick={() => actions.setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 relative ${
              activeTab === tab
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        {activeTab === DetailTab.OVERVIEW && (
            <OverviewTab resort={resort} hookData={detailHook} />
        )}
        {activeTab === DetailTab.ROOMS && (
            <RoomsTab rooms={resort.rooms} onSelect={actions.setSelectedRoom} />
        )}
        {activeTab === DetailTab.NEARBY && (
            <NearbyTab 
                places={resort.nearby_places} 
                onSelect={(place) => {
                    actions.setSelectedNearby(place);
                    if (onFlyToLocation && place.latitude && place.longitude) {
                        onFlyToLocation(place.latitude, place.longitude);
                    }
                }} 
            />
        )}
      </div>
    </div>
  );
};

export default ResortDetailPanel;