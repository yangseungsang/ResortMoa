
import { useState, useEffect } from 'react';
import { Resort, RoomType, NearbyPlace, Review } from '../../types';
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
    helpers: {}
  };
};
