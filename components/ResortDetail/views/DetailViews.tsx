
import React from 'react';
import { RoomType, NearbyPlace, PlaceCategory } from '../../../types';
import { GalleryCarousel } from '../../common/GalleryCarousel';
import { IconArrowLeft, IconUsers, IconBed, IconCamera } from '../../Icons';

interface RoomDetailViewProps {
  room: RoomType;
  onBack: () => void;
}

export const RoomDetailView: React.FC<RoomDetailViewProps> = ({ room, onBack }) => {
  const roomImages = [room.image_path, ...(room.more_images || [])];
  
  return (
    <div className="bg-white h-full flex flex-col animate-fadeIn whitespace-normal">
       <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0">
          <button onClick={onBack} className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <IconArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-slate-800">Room Details</h3>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
          <div className="rounded-xl overflow-hidden shadow-sm">
             <GalleryCarousel images={roomImages} showTitle={false} heightClass="h-64" />
          </div>
          <div className="space-y-4">
              <div>
                  <h4 className="text-lg font-bold text-slate-900">{room.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{room.capacity}</span>
                      <span className="text-xs text-slate-500">{room.features}</span>
                  </div>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed">{room.description_long || "No description."}</div>
              {room.amenities && (
                  <div>
                      <h5 className="font-bold text-slate-800 text-sm mb-2">Amenities</h5>
                      <div className="grid grid-cols-2 gap-2">
                          {room.amenities.map((item, i) => (
                              <div key={i} className="flex items-center text-xs text-slate-600">
                                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>{item}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
       </div>
    </div>
  );
};

interface NearbyDetailViewProps {
  place: NearbyPlace;
  onBack: () => void;
}

export const NearbyDetailView: React.FC<NearbyDetailViewProps> = ({ place, onBack }) => {
  // Combine all image sources: thumbnail, existing images list, and new more_images list
  const rawImages = [
      place.image_url,
      ...(place.images || []),
      ...(place.more_images || [])
  ].filter((img): img is string => !!img);

  // Remove duplicates to be safe (e.g. if image_url is also in images array)
  const placeImages = Array.from(new Set(rawImages));

  return (
      <div className="bg-white h-full flex flex-col animate-fadeIn whitespace-normal">
        <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0">
            <button onClick={onBack} className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <IconArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-800">Place Details</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0">
            {placeImages.length > 0 && (
                <div className="rounded-xl overflow-hidden shadow-sm">
                     <GalleryCarousel images={placeImages} showTitle={false} heightClass="h-56" />
                </div>
            )}
            <div>
                <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold text-slate-900">{place.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${place.category === PlaceCategory.FOOD ? 'bg-orange-100 text-orange-600' : place.category === PlaceCategory.TOUR ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {place.category}
                    </span>
                </div>
            </div>
            
            {/* Dynamic Info Attributes */}
            {place.info_attributes && place.info_attributes.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="grid grid-cols-1 gap-2">
                        {place.info_attributes.map((attr, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 text-xs font-medium">{attr.label}</span>
                                <span className="text-slate-800 font-semibold text-right">{attr.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white p-2 text-sm text-slate-700 leading-relaxed">
                <h5 className="font-bold text-slate-900 text-sm mb-1">About</h5>
                {place.detail_content || place.description}
            </div>
        </div>
      </div>
  );
};
