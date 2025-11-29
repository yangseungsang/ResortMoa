
import React from 'react';
import { Resort, RoomType, NearbyPlace, PlaceCategory } from '../../../types';
import { ImageWithFallback } from '../../common/ImageWithFallback';
import { IconCamera, IconUsers, IconBed, IconUtensils, IconTent, IconShoppingBag, IconMapPin } from '../../Icons';

interface RoomsTabProps {
  rooms: RoomType[];
  onSelect: (room: RoomType) => void;
}

export const RoomsTab: React.FC<RoomsTabProps> = ({ rooms, onSelect }) => (
  <div className="space-y-3 p-4 animate-fadeIn pb-10">
    {rooms.map((room) => (
      <div 
          key={room.id} 
          onClick={() => onSelect(room)}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-teal-200 transition-all cursor-pointer"
      >
        <div className="h-40 w-full overflow-hidden relative">
          <ImageWithFallback src={room.image_path} alt={room.name} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full flex items-center">
               <IconCamera className="w-3 h-3 mr-1" />
               More Info
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-slate-800">{room.name}</h4>
            <div className="flex items-center space-x-1 text-slate-600 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold">
              <IconUsers className="w-3 h-3" />
              <span>{room.capacity}</span>
            </div>
          </div>
          <div className="flex items-start space-x-2 text-slate-500 text-xs">
            <IconBed className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>{room.features}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface NearbyTabProps {
  places: NearbyPlace[];
  onSelect: (place: NearbyPlace) => void;
}

export const NearbyTab: React.FC<NearbyTabProps> = ({ places, onSelect }) => {
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
        <div className="space-y-3 p-4 animate-fadeIn pb-10">
          {places.map((place) => (
            <div 
              key={place.id} 
              onClick={() => onSelect(place)}
              className="flex bg-white p-3 rounded-xl border border-slate-100 shadow-sm items-start hover:border-teal-200 cursor-pointer transition-colors"
            >
              <div className={`p-2 rounded-lg ${getColor(place.category)} mr-3 flex-shrink-0`}>
                {getIcon(place.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">{place.name}</h4>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full ml-2 whitespace-nowrap">{place.distance_text}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">{place.description}</p>
              </div>
            </div>
          ))}
          {(!places || places.length === 0) && (
              <div className="text-center py-8 text-slate-400 text-xs">
                  No nearby information added yet.
              </div>
          )}
        </div>
      );
};
