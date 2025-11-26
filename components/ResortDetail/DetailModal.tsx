import React, { useState } from 'react';
import { Resort, PlaceCategory } from '../../types';
import { IconX, IconBed, IconUsers, IconUtensils, IconTent, IconShoppingBag, IconPhone, IconClock, IconMapPin } from '../Icons';

interface DetailModalProps {
  resort: Resort;
  onClose: () => void;
}

enum Tab {
  OVERVIEW = 'Overview',
  ROOMS = 'Rooms',
  NEARBY = 'Nearby',
}

const DetailModal: React.FC<DetailModalProps> = ({ resort, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OVERVIEW);

  const renderOverview = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="relative h-56 rounded-xl overflow-hidden shadow-sm">
        <img src={resort.thumbnail_url} alt={resort.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white">{resort.name}</h2>
          <p className="text-white/90 text-sm">{resort.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg flex items-center space-x-3">
          <div className="p-2 bg-white rounded-full shadow-sm text-teal-600">
            <IconClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Check In / Out</p>
            <p className="font-semibold text-slate-800">{resort.check_in_out}</p>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg flex items-center space-x-3">
          <div className="p-2 bg-white rounded-full shadow-sm text-teal-600">
            <IconPhone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Contact</p>
            <p className="font-semibold text-slate-800">{resort.contact}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Facilities</h3>
        <div className="flex flex-wrap gap-2">
          {resort.facilities.map((facility, idx) => (
            <span key={idx} className="px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full font-medium border border-teal-100">
              {facility}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-4 animate-fadeIn">
      {resort.rooms.map((room) => (
        <div key={room.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-40 w-full overflow-hidden">
            <img src={room.image_path} alt={room.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-bold text-slate-800">{room.name}</h4>
              <div className="flex items-center space-x-1 text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">
                <IconUsers className="w-3 h-3" />
                <span>{room.capacity}</span>
              </div>
            </div>
            <div className="flex items-start space-x-2 text-slate-600 text-sm">
              <IconBed className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{room.features}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNearby = () => {
    const getIcon = (category: PlaceCategory) => {
      switch (category) {
        case PlaceCategory.FOOD: return <IconUtensils className="w-4 h-4" />;
        case PlaceCategory.TOUR: return <IconTent className="w-4 h-4" />;
        case PlaceCategory.STORE: return <IconShoppingBag className="w-4 h-4" />;
        default: return <IconMapPin className="w-4 h-4" />;
      }
    };

    const getColor = (category: PlaceCategory) => {
      switch (category) {
        case PlaceCategory.FOOD: return 'bg-orange-100 text-orange-600';
        case PlaceCategory.TOUR: return 'bg-green-100 text-green-600';
        case PlaceCategory.STORE: return 'bg-blue-100 text-blue-600';
        default: return 'bg-slate-100 text-slate-600';
      }
    };

    return (
      <div className="space-y-3 animate-fadeIn">
        {resort.nearby_places.map((place) => (
          <div key={place.id} className="flex bg-white p-3 rounded-xl border border-slate-100 shadow-sm items-start">
            <div className={`p-2 rounded-lg ${getColor(place.category)} mr-3 flex-shrink-0`}>
              {getIcon(place.category)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold text-slate-800">{place.name}</h4>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{place.distance_text}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{place.description}</p>
            </div>
          </div>
        ))}
        {resort.nearby_places.length === 0 && (
            <div className="text-center py-8 text-slate-400">
                No nearby information added by admin yet.
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-800">Resort Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <IconX className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {Object.values(Tab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-teal-600 text-teal-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/30">
          {activeTab === Tab.OVERVIEW && renderOverview()}
          {activeTab === Tab.ROOMS && renderRooms()}
          {activeTab === Tab.NEARBY && renderNearby()}
        </div>
        
        {/* Footer CTA */}
        <div className="p-4 border-t border-slate-100 bg-white">
            <button className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-200 transition-all transform active:scale-95">
                Reserve Now
            </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;