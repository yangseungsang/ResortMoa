import { useState, useEffect } from 'react';
import { Resort, RoomType, NearbyPlace, Review, ApplicationType } from '../../types';
import { createReview } from '../../services/resortService';

export enum DetailTab {
  OVERVIEW = 'Overview',
  ROOMS = 'Rooms',
  NEARBY = 'Nearby',
}

export const useResortDetail = (resort: Resort) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<DetailTab>(DetailTab.OVERVIEW);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [selectedNearby, setSelectedNearby] = useState<NearbyPlace | null>(null);

  // Review State
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reset state when resort changes
  useEffect(() => {
    setLocalReviews(resort.reviews || []);
    setSelectedRoom(null);
    setSelectedNearby(null);
    setActiveTab(DetailTab.OVERVIEW);
    setReviewExpanded(false);
    setNewReviewComment("");
    setNewReviewAuthor("");
    setNewReviewRating(5);
  }, [resort]);

  // Review Submission Logic
  const submitReview = async () => {
    if (!newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const reviewData = {
        author: newReviewAuthor.trim() || "Anonymous",
        rating: newReviewRating,
        comment: newReviewComment
      };

      // Call Service API
      const newReview = await createReview(resort.id, reviewData);

      setLocalReviews([newReview, ...localReviews]);
      setNewReviewComment("");
      setNewReviewAuthor("");
      setReviewExpanded(true);
    } catch (error) {
      console.error("Failed to submit review", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Helper for Application Guide Logic
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

  return {
    state: {
      activeTab,
      selectedRoom,
      selectedNearby,
      localReviews,
      reviewExpanded,
      newReviewRating,
      newReviewComment,
      newReviewAuthor,
      isSubmittingReview
    },
    actions: {
      setActiveTab,
      setSelectedRoom,
      setSelectedNearby,
      setReviewExpanded,
      setNewReviewRating,
      setNewReviewComment,
      setNewReviewAuthor,
      submitReview,
    },
    helpers: {
      getApplicationGuide
    }
  };
};
