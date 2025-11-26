import React, { useState, useEffect } from 'react';
import { Resort, PlaceCategory, RoomType, NearbyPlace, ApplicationType, Review } from '../../types';
import { IconArrowLeft, IconBed, IconUsers, IconUtensils, IconTent, IconShoppingBag, IconPhone, IconClock, IconMapPin, IconInfo, IconStar, IconCamera } from '../Icons';

interface ResortDetailPanelProps {
  resort: Resort;
  onBack: () => void;
}

enum Tab {
  OVERVIEW = 'Overview',
  ROOMS = 'Rooms',
  NEARBY = 'Nearby',
}

const ResortDetailPanel: React.FC<ResortDetailPanelProps> = ({ resort, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OVERVIEW);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [selectedNearby, setSelectedNearby] = useState<NearbyPlace | null>(null);
  
  // Review State
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  useEffect(() => {
      // Initialize with resort reviews when resort changes
      setLocalReviews(resort.reviews || []);
      setSelectedRoom(null);
      setSelectedNearby(null);
      setActiveTab(Tab.OVERVIEW);
      setReviewExpanded(false);
      setNewReviewComment("");
      setNewReviewRating(5);
  }, [resort]);

  const handleSubmitReview = () => {
      if(!newReviewComment.trim()) return;
      
      const newReview: Review = {
          id: Date.now(),
          author: "Guest (You)",
          rating: newReviewRating,
          comment: newReviewComment,
          date: new Date().toISOString().split('T')[0]
      };
      
      setLocalReviews([newReview, ...localReviews]);
      setNewReviewComment("");
      setReviewExpanded(true); // Show the new review
  };

  const getApplicationGuide = (type: ApplicationType) => {
    switch (type) {
      case ApplicationType.LOTTERY:
        return { color: 'bg-purple-50 border-purple-200 text-purple-800', label: 'Lottery System', desc: 'Applications accepted 1 month prior. Selection by random draw.' };
      case ApplicationType.FIRST_COME:
        return { color: 'bg-blue-50 border-blue-200 text-blue-800', label: 'First-Come First-Served', desc: 'Direct booking available from the 1st of each month.' };
      case ApplicationType.APPROVE:
        return { color: 'bg-orange-50 border-orange-200 text-orange-800', label: 'Manager Approval', desc: 'Submit request. Approval required from department head.' };
      default:
        return { color: 'bg-slate-50 border-slate-200 text-slate-800', label: 'General', desc: 'Please contact HR for details.' };
    }
  };

  // --- SUB PAGES ---

  const renderRoomDetail = (room: RoomType) => (
    <div className="bg-white h-full flex flex-col animate-fadeIn">
       <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0">
          <button onClick={() => setSelectedRoom(null)} className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <IconArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-slate-800">Room Details</h3>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="rounded-xl overflow-hidden shadow-sm">
             <img src={room.image_path} alt={room.name} className="w-full h-56 object-cover"/>
          </div>
          
          <div className="space-y-4">
              <div>
                  <h4 className="text-lg font-bold text-slate-900">{room.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{room.capacity}</span>
                      <span className="text-xs text-slate-500">{room.features}</span>
                  </div>
              </div>

              <div className="text-sm text-slate-600 leading-relaxed">
                  {room.description_long || "No detailed description available."}
              </div>

              {room.amenities && (
                  <div>
                      <h5 className="font-bold text-slate-800 text-sm mb-2">Amenities</h5>
                      <div className="grid grid-cols-2 gap-2">
                          {room.amenities.map((item, i) => (
                              <div key={i} className="flex items-center text-xs text-slate-600">
                                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                                  {item}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {room.more_images && room.more_images.length > 0 && (
                  <div>
                      <h5 className="font-bold text-slate-800 text-sm mb-2">Gallery</h5>
                      <div className="grid grid-cols-2 gap-2">
                          {room.more_images.map((img, i) => (
                              <img key={i} src={img} className="rounded-lg w-full h-24 object-cover" />
                          ))}
                      </div>
                  </div>
              )}
          </div>
       </div>
    </div>
  );

  const renderNearbyDetail = (place: NearbyPlace) => (
      <div className="bg-white h-full flex flex-col animate-fadeIn">
        <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0">
            <button onClick={() => setSelectedNearby(null)} className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <IconArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-800">Place Details</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {place.image_url && (
                <div className="rounded-xl overflow-hidden shadow-sm">
                    <img src={place.image_url} alt={place.name} className="w-full h-48 object-cover"/>
                </div>
            )}
            
            <div>
                <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold text-slate-900">{place.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${place.category === PlaceCategory.FOOD ? 'bg-orange-100 text-orange-600' : place.category === PlaceCategory.TOUR ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {place.category}
                    </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{place.distance_text}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100">
                {place.detail_content || place.description}
            </div>
        </div>
      </div>
  );

  // --- MAIN TABS ---

  const renderOverview = () => {
    const guide = getApplicationGuide(resort.application_type);
    const displayedReviews = reviewExpanded ? localReviews : localReviews.slice(0, 2);

    return (
        <div className="space-y-6 animate-fadeIn pb-10">
            <div className="relative h-48 rounded-xl overflow-hidden shadow-sm mx-4 mt-4">
                <img src={resort.thumbnail_url} alt={resort.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h2 className="text-xl font-bold text-white">{resort.name}</h2>
                <p className="text-white/90 text-xs">{resort.address}</p>
                </div>
            </div>

            <div className="px-4">
                {/* Application Guide Banner */}
                <div className={`p-4 rounded-xl border mb-6 ${guide.color}`}>
                    <div className="flex items-center space-x-2 mb-1">
                        <IconInfo className="w-4 h-4" />
                        <span className="font-bold text-sm uppercase tracking-wide">{guide.label}</span>
                    </div>
                    <p className="text-xs opacity-90">{guide.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 p-3 rounded-lg flex items-center space-x-2 border border-slate-100">
                        <div className="p-1.5 bg-white rounded-full shadow-sm text-teal-600">
                        <IconClock className="w-4 h-4" />
                        </div>
                        <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Check In/Out</p>
                        <p className="text-xs font-semibold text-slate-800">{resort.check_in_out}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg flex items-center space-x-2 border border-slate-100">
                        <div className="p-1.5 bg-white rounded-full shadow-sm text-teal-600">
                        <IconPhone className="w-4 h-4" />
                        </div>
                        <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Contact</p>
                        <p className="text-xs font-semibold text-slate-800">{resort.contact}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Facilities</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {resort.facilities.map((facility, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs rounded-full font-medium border border-teal-100">
                            {facility}
                        </span>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Reviews ({localReviews.length})</h3>
                    </div>
                    
                    {/* Review Form */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                        <p className="text-xs font-bold text-slate-700 mb-2">Write a Review</p>
                        <div className="flex space-x-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setNewReviewRating(star)} type="button">
                                    <IconStar 
                                        filled={star <= newReviewRating} 
                                        className={`w-5 h-5 ${star <= newReviewRating ? "text-yellow-400" : "text-slate-300"}`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newReviewComment}
                                onChange={(e) => setNewReviewComment(e.target.value)}
                                placeholder="Share your experience..." 
                                className="flex-1 text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                            />
                            <button 
                                onClick={handleSubmitReview}
                                disabled={!newReviewComment.trim()}
                                className="bg-teal-600 text-white px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-3">
                        {displayedReviews.map((review) => (
                            <div key={review.id} className="border-b border-slate-100 pb-3 last:border-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-slate-700">{review.author}</span>
                                    <span className="text-[10px] text-slate-400">{review.date}</span>
                                </div>
                                <div className="flex text-yellow-400 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <IconStar key={i} className="w-3 h-3" filled={i < review.rating} />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-600">{review.comment}</p>
                            </div>
                        ))}
                        
                        {!reviewExpanded && localReviews.length > 2 && (
                            <button 
                                onClick={() => setReviewExpanded(true)}
                                className="w-full py-2 text-xs text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors"
                            >
                                Show All Reviews
                            </button>
                        )}
                        {localReviews.length === 0 && (
                            <p className="text-center text-xs text-slate-400 py-2">No reviews yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderRooms = () => (
    <div className="space-y-4 animate-fadeIn p-4 pb-10">
      {resort.rooms.map((room) => (
        <div 
            key={room.id} 
            onClick={() => setSelectedRoom(room)}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="h-40 w-full overflow-hidden relative">
            <img src={room.image_path} alt={room.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 flex items-center">
                 <IconCamera className="w-3 h-3 mr-1" /> View Details
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-bold text-slate-800">{room.name}</h4>
              <div className="flex items-center space-x-1 text-slate-600 bg-slate-100 px-2 py-1 rounded text-[10px]">
                <IconUsers className="w-3 h-3" />
                <span>{room.capacity}</span>
              </div>
            </div>
            <div className="flex items-start space-x-2 text-slate-500 text-xs">
              <IconBed className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{room.features}</span>
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
      <div className="space-y-3 animate-fadeIn p-4 pb-10">
        {resort.nearby_places.map((place) => (
          <div 
            key={place.id} 
            onClick={() => setSelectedNearby(place)}
            className="flex bg-white p-3 rounded-xl border border-slate-100 shadow-sm items-start cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${getColor(place.category)} mr-3 flex-shrink-0`}>
              {getIcon(place.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <h4 className="font-bold text-sm text-slate-800 truncate">{place.name}</h4>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">{place.distance_text}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{place.description}</p>
            </div>
          </div>
        ))}
        {resort.nearby_places.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
                No nearby information added by admin yet.
            </div>
        )}
      </div>
    );
  };

  // --- RENDER CONTROL ---

  if (selectedRoom) return renderRoomDetail(selectedRoom);
  if (selectedNearby) return renderNearbyDetail(selectedNearby);

  return (
    <div className="flex flex-col h-full bg-white animate-fadeIn">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0 bg-white z-10">
        <button onClick={onBack} className="mr-2 p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <IconArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-800 truncate">{resort.name}</h2>
            <p className="text-xs text-slate-500 truncate">{resort.region_depth1} {resort.region_depth2}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
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
      <div className="flex-1 overflow-y-auto bg-white">
        {activeTab === Tab.OVERVIEW && renderOverview()}
        {activeTab === Tab.ROOMS && renderRooms()}
        {activeTab === Tab.NEARBY && renderNearby()}
      </div>
    </div>
  );
};

export default ResortDetailPanel;