
import React from 'react';
import { Resort } from '../../../types';
import { ImageWithFallback } from '../../common/ImageWithFallback';
import { GalleryCarousel } from '../../common/GalleryCarousel';
import { IconClock, IconPhone, IconInfo, IconStar, IconCheckCircle, IconExternalLink } from '../../Icons';
import { useResortDetail } from '../../../core/hooks/useResortDetail';

interface OverviewTabProps {
  resort: Resort;
  hookData: ReturnType<typeof useResortDetail>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ resort, hookData }) => {
  const { state, actions } = hookData;
  const { localReviews, reviewExpanded, newReviewRating, newReviewComment, newReviewAuthor } = state;
  const displayedReviews = reviewExpanded ? localReviews : localReviews.slice(0, 2);
  
  // Use unified booking rule object
  const rule = resort.booking_rule;

  // Prepare images for the hero slider (Prioritize gallery images, fallback to thumbnail)
  const heroImages = (resort.images && resort.images.length > 0) 
    ? resort.images 
    : [resort.thumbnail_url];

  return (
    <div className="space-y-6 animate-fadeIn pb-10 whitespace-normal">
        {/* Hero Image Slider */}
        <div className="mx-4 mt-4">
            <GalleryCarousel 
                images={heroImages} 
                showTitle={false} 
                heightClass="h-48"
                className="mb-0" 
                overlayDots={false}
            >
                {/* Gradient Overlay for Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-none z-20">
                  <h2 className="text-xl font-bold text-white leading-tight">{resort.name}</h2>
                  <p className="text-white/90 text-xs mt-0.5">{resort.address}</p>
                </div>
            </GalleryCarousel>
        </div>

        <div className="px-4">
            {/* Guide Card (Using Unified Booking Rule) */}
            {rule && (
                <div className={`p-4 rounded-xl border mb-6 ${rule.ui_theme.bg} ${rule.ui_theme.border}`}>
                    <div className="flex items-center space-x-2 mb-2">
                        <IconInfo className={`w-4 h-4 ${rule.ui_theme.icon_color}`} />
                        <span className={`font-bold text-sm uppercase tracking-wide ${rule.ui_theme.text}`}>{rule.name}</span>
                    </div>
                    {/* Render newlines in description */}
                    <div className={`text-xs opacity-90 leading-relaxed whitespace-pre-line ${rule.ui_theme.text}`}>
                        {(rule.description || '').replace(/\\n/g, '\n')}
                    </div>
                </div>
            )}

            {/* Basic Info */}
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

            {/* Facilities */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                    {(resort.facilities || []).map((fac, i) => (
                        <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full font-medium border border-teal-100">{fac}</span>
                    ))}
                </div>
            </div>

            {/* AI Review Summary */}
            {resort.review_summary && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                        <IconCheckCircle className="w-4 h-4 text-indigo-600" />
                        <span>Review Summary</span>
                    </h3>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-slate-700 leading-relaxed shadow-sm">
                        {resort.review_summary}
                    </div>
                </div>
            )}

            {/* External Links Section */}
            {resort.external_links && resort.external_links.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                        <IconExternalLink className="w-4 h-4 text-slate-600" />
                        <span>External Info</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {resort.external_links.map((link, idx) => (
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

            {/* Reviews Section */}
            <div>
                <div className="flex justify-between items-end mb-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Reviews ({localReviews.length})</h3>
                </div>
                
                {/* Write Review Input */}
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

                {/* Review List */}
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
