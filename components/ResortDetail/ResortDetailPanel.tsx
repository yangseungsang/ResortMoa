import React, { useState, useRef } from 'react';
import { Resort, PlaceCategory, RoomType, NearbyPlace } from '../../types';
import { useResortDetail, DetailTab } from '../../core/hooks/useResortDetail';
import { IconArrowLeft, IconBed, IconUsers, IconUtensils, IconTent, IconShoppingBag, IconPhone, IconClock, IconMapPin, IconInfo, IconStar, IconCamera, IconX } from '../Icons';

interface ResortDetailPanelProps {
  resort: Resort;
  onBack: () => void;
}

// --- Internal Component: Gallery Carousel ---
const GalleryCarousel = ({ images, onImageClick }: { images?: string[], onImageClick: (img: string) => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag State
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragDistance = useRef(0); // Track how far we moved to distinguish click vs drag

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    dragDistance.current = 0; // Reset distance
  };
  
  const handleMouseLeave = () => {
    setIsDown(false);
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDown(false);
    // Logic handled in onClick of items usually, or here if we want to capture generic up
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
    dragDistance.current += Math.abs(e.movementX);
  };

  const handleItemClick = (img: string) => {
      // Only trigger if we haven't dragged much
      if (dragDistance.current < 5) {
          onImageClick(img);
      }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
    e.currentTarget.className = "w-full h-full object-cover bg-slate-100 p-8 opacity-50";
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="mb-6 select-none">
       <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Gallery</h3>
       <div className="relative group">
          <div 
             ref={containerRef}
             onScroll={handleScroll}
             onMouseDown={handleMouseDown}
             onMouseLeave={handleMouseLeave}
             onMouseUp={handleMouseUp}
             onMouseMove={handleMouseMove}
             className={`flex overflow-x-auto rounded-xl [&::-webkit-scrollbar]:hidden ${
                isDown ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'
             }`}
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
             {images.map((img, idx) => (
                <div 
                    key={idx} 
                    className="w-full flex-shrink-0 snap-center"
                    onClick={() => handleItemClick(img)}
                >
                   <img 
                      src={img} 
                      onError={handleImageError} 
                      draggable={false}
                      alt={`Gallery ${idx + 1}`} 
                      className="w-full h-48 object-cover bg-slate-50 pointer-events-none" 
                    />
                </div>
             ))}
          </div>
          {/* Dot Indicators */}
          <div className="flex justify-center mt-3 space-x-1.5">
             {images.map((_, idx) => (
                <div 
                   key={idx}
                   className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex ? 'w-4 bg-teal-600' : 'w-1.5 bg-slate-300'
                   }`}
                />
             ))}
          </div>
       </div>
    </div>
  );
};

const ResortDetailPanel: React.FC<ResortDetailPanelProps> = ({ resort, onBack }) => {
  const { state, actions, helpers } = useResortDetail(resort);
  const { activeTab, selectedRoom, selectedNearby, localReviews, reviewExpanded, newReviewRating, newReviewComment, newReviewAuthor } = state;
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Image Error Handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
    e.currentTarget.className = e.currentTarget.className + " bg-slate-100 p-8 opacity-50";
  };

  // --- SUB COMPONENTS (Pure UI) ---

  const renderRoomDetail = (room: RoomType) => (
    <div className="bg-white h-full flex flex-col animate-fadeIn">
       <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0">
          <button onClick={() => actions.setSelectedRoom(null)} className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <IconArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-slate-800">Room Details</h3>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="rounded-xl overflow-hidden shadow-sm cursor-zoom-in" onClick={() => setZoomedImage(room.image_path)}>
             <img src={room.image_path} onError={handleImageError} alt={room.name} className="w-full h-56 object-cover"/>
          </div>
          <div className="space-y-4">
              <div>
                  <h4 className="text-lg font-bold text-slate-900">{room.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{room.capacity}</span>
                      <span className="text-xs text-slate-500">{room.features}</span>
                  </div>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-normal">{room.description_long || "No description."}</div>
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
              {room.more_images && (
                  <div>
                      <h5 className="font-bold text-slate-800 text-sm mb-2">Gallery</h5>
                      <div className="grid grid-cols-2 gap-2">
                          {room.more_images.map((img, i) => (
                              <img 
                                key={i} 
                                src={img} 
                                onError={handleImageError} 
                                onClick={() => setZoomedImage(img)}
                                className="rounded-lg w-full h-24 object-cover cursor-zoom-in hover:opacity-90 transition-opacity" 
                              />
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
            <button onClick={() => actions.setSelectedNearby(null)} className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <IconArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-800">Place Details</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {place.image_url && (
                <div className="rounded-xl overflow-hidden shadow-sm cursor-zoom-in" onClick={() => setZoomedImage(place.image_url!)}>
                    <img src={place.image_url} onError={handleImageError} alt={place.name} className="w-full h-48 object-cover"/>
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
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100 whitespace-normal">
                {place.detail_content || place.description}
            </div>
        </div>
      </div>
  );

  // --- TABS (Partial UI) ---

  const renderOverview = () => {
    const guide = helpers.getApplicationGuide(resort.application_type);
    const displayedReviews = reviewExpanded ? localReviews : localReviews.slice(0, 2);

    return (
        <div className="space-y-6 animate-fadeIn pb-10 whitespace-normal">
            <div className="relative h-48 rounded-xl overflow-hidden shadow-sm mx-4 mt-4">
                <img src={resort.thumbnail_url} onError={handleImageError} alt={resort.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h2 className="text-xl font-bold text-white">{resort.name}</h2>
                <p className="text-white/90 text-xs">{resort.address}</p>
                </div>
            </div>

            <div className="px-4">
                <div className={`p-4 rounded-xl border mb-6 ${guide.color}`}>
                    <div className="flex items-center space-x-2 mb-1">
                        <IconInfo className="w-4 h-4" />
                        <span className="font-bold text-sm uppercase tracking-wide">{guide.label}</span>
                    </div>
                    <p className="text-xs opacity-90">{guide.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 p-3 rounded-lg flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-full text-teal-600 shadow-sm"><IconClock className="w-4 h-4" /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Check In/Out</p>
                            <p className="text-sm font-semibold text-slate-700">{resort.check_in_out}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-full text-teal-600 shadow-sm"><IconPhone className="w-4 h-4" /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Contact</p>
                            <p className="text-sm font-semibold text-slate-700">{resort.contact}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                        {resort.facilities.map((fac, i) => (
                            <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full font-medium border border-teal-100">{fac}</span>
                        ))}
                    </div>
                </div>

                {/* Gallery Carousel */}
                <GalleryCarousel images={resort.images} onImageClick={setZoomedImage} />

                {/* Reviews */}
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Reviews ({localReviews.length})</h3>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                        <p className="text-xs font-bold text-slate-700 mb-2">Write a Review</p>
                        <div className="flex space-x-1 mb-3">
                             {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => actions.setNewReviewRating(star)}>
                                    <IconStar className="w-5 h-5 text-yellow-400" filled={star <= newReviewRating} />
                                </button>
                             ))}
                        </div>
                        <input 
                           type="text" 
                           placeholder="Your Name"
                           className="w-full text-sm p-2 rounded-lg border border-slate-200 mb-2 focus:outline-none focus:border-teal-500"
                           value={newReviewAuthor}
                           onChange={(e) => actions.setNewReviewAuthor(e.target.value)}
                        />
                        <div className="flex space-x-2">
                             <input 
                                type="text" 
                                placeholder="Share your experience..." 
                                className="flex-1 text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500"
                                value={newReviewComment}
                                onChange={(e) => actions.setNewReviewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && actions.submitReview()}
                             />
                             <button 
                                onClick={actions.submitReview}
                                disabled={state.isSubmittingReview || !newReviewComment.trim()}
                                className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                             >
                                {state.isSubmittingReview ? '...' : 'Post'}
                             </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {displayedReviews.map((review) => (
                            <div key={review.id} className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-slate-800 text-sm">{review.author}</span>
                                    <span className="text-[10px] text-slate-400">{review.date}</span>
                                </div>
                                <div className="flex mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <IconStar key={i} className="w-3 h-3 text-yellow-400" filled={i < review.rating} />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-600">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                    
                    {!reviewExpanded && localReviews.length > 2 && (
                        <button 
                           onClick={() => actions.setReviewExpanded(true)}
                           className="w-full mt-3 py-2 text-xs text-slate-500 font-medium hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                           Show all reviews
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
  };

  const renderRooms = () => (
    <div className="space-y-3 p-4 animate-fadeIn pb-10">
      {resort.rooms.map((room) => (
        <div 
            key={room.id} 
            onClick={() => actions.setSelectedRoom(room)}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-teal-200 transition-all cursor-pointer"
        >
          <div className="h-40 w-full overflow-hidden relative">
            <img src={room.image_path} onError={handleImageError} alt={room.name} className="w-full h-full object-cover" />
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
      <div className="space-y-3 p-4 animate-fadeIn pb-10">
        {resort.nearby_places.map((place) => (
          <div 
            key={place.id} 
            onClick={() => actions.setSelectedNearby(place)}
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
        {(!resort.nearby_places || resort.nearby_places.length === 0) && (
            <div className="text-center py-8 text-slate-400 text-xs">
                No nearby information added yet.
            </div>
        )}
      </div>
    );
  };

  // Main Render Logic
  if (selectedRoom) return renderRoomDetail(selectedRoom);
  if (selectedNearby) return renderNearbyDetail(selectedNearby);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Lightbox Overlay */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setZoomedImage(null)}>
           <button onClick={() => setZoomedImage(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <IconX className="w-8 h-8" />
           </button>
           <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full object-contain rounded shadow-2xl" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-100 flex-shrink-0">
        <button onClick={onBack} className="mr-3 p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <IconArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {activeTab === DetailTab.OVERVIEW && renderOverview()}
        {activeTab === DetailTab.ROOMS && renderRooms()}
        {activeTab === DetailTab.NEARBY && renderNearby()}
      </div>
    </div>
  );
};

export default ResortDetailPanel;
