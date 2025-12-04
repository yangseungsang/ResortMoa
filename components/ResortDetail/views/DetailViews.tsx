import React from 'react';
import { RoomType, NearbyPlace, PlaceCategory } from '../../../types';
import { GalleryCarousel } from '../../common/GalleryCarousel';
import { IconArrowLeft, IconUsers, IconBed, IconCamera, IconExternalLink, IconMapPin } from '../../Icons';

interface RoomDetailViewProps {
  room: RoomType;
  onBack: () => void;
}

export const RoomDetailView: React.FC<RoomDetailViewProps> = ({ room, onBack }) => {
  // Combine images and filter out empty strings to avoid broken slides
  const roomImages = [room.image_path, ...(room.more_images || [])].filter(Boolean);
  
  return (
    <div className="bg-white h-full flex flex-col animate-fadeIn whitespace-normal">
       <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0">
          <button onClick={onBack} className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <IconArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-slate-800">Room Details</h3>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 scrollbar-hide">
          <div className="rounded-xl overflow-hidden shadow-sm">
             <GalleryCarousel images={roomImages} showTitle={false} heightClass="h-64" />
          </div>
          <div className="space-y-4">
              <div>
                  <h4 className="text-lg font-bold text-slate-900">{room.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                      {room.capacity && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{room.capacity}</span>
                      )}
                      {room.features && (
                        <span className="text-xs text-slate-500">{room.features}</span>
                      )}
                  </div>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed">{room.description_long || "No description."}</div>
              
              {/* Only render Amenities section if there are items */}
              {room.amenities && room.amenities.length > 0 && (
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
        <div className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0 scrollbar-hide">
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
                {place.address && (
                    <div className="flex items-center text-sm text-slate-500 mt-2">
                        <IconMapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                        <span>{place.address}</span>
                    </div>
                )}
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

            {/* External Links Section */}
            {place.external_links && place.external_links.length > 0 && (
                <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <IconExternalLink className="w-3.5 h-3.5" />
                        <span>External Info</span>
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                        {place.external_links.map((link, idx) => (
                            <a 
                                key={idx} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group"
                            >
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-700">{link.label}</span>
                                <IconExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white p-2 text-sm text-slate-700 leading-relaxed">
                {place.detail_content || place.description}
            </div>
        </div>
      </div>
  );
};