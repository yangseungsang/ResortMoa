
import React from 'react';
import { RoomType, NearbyPlace, PlaceCategory } from '../../../types';
import { ImageWithFallback } from '../../common/ImageWithFallback';
import { IconCamera, IconUsers, IconBed, IconUtensils, IconTent, IconShoppingBag, IconMapPin } from '../../Icons';

interface RoomsTabProps {
  rooms: RoomType[];
  onSelect: (room: RoomType) => void;
}

export const RoomsTab: React.FC<RoomsTabProps> = ({ rooms, onSelect }) => (
  <div className="space-y-3 p-4 animate-fadeIn pb-10">
    {(rooms || []).map((room) => (
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
    {(!rooms || rooms.length === 0) && (
        <div className="text-center py-8 text-slate-400 text-xs">
            No room information available.
        </div>
    )}
  </div>
);

interface NearbyTabProps {
  places: NearbyPlace[];
  onSelect: (place: NearbyPlace) => void;
}

export const NearbyTab: React.FC<NearbyTabProps> = ({ places, onSelect }) => {
    const getIcon = (category: PlaceCategory) => {
        switch (category) {
          case PlaceCategory.FOOD: return <IconUtensils className="w-5 h-5" />;
          case PlaceCategory.TOUR: return <IconTent className="w-5 h-5" />;
          case PlaceCategory.STORE: return <IconShoppingBag className="w-5 h-5" />;
          default: return <IconMapPin className="w-5 h-5" />;
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
          {(places || []).map((place) => {
            const imageUrl = place.image_url || (place.images && place.images[0]);

            return (
                <div 
                key={place.id} 
                onClick={() => onSelect(place)}
                className="flex bg-white p-3 rounded-xl border border-slate-100 shadow-sm items-center hover:border-teal-200 cursor-pointer transition-colors"
                >
                <div className="mr-3 flex-shrink-0">
                    {imageUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                            <ImageWithFallback 
                                src={imageUrl} 
                                alt={place.name} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    ) : (
                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${getColor(place.category)}`}>
                            {getIcon(place.category)}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-800 text-sm truncate mr-2">{place.name}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${getColor(place.category)}`}>
                            {place.category}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{place.description}</p>
                </div>
                </div>
            );
          })}
          {(!places || places.length === 0) && (
              <div className="text-center py-8 text-slate-400 text-xs">
                  No nearby information added yet.
              </div>
          )}
        </div>
      );
};
