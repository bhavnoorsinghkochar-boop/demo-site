import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, MessageSquarePlus, CheckCircle, ThumbsUp, ShieldCheck } from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { reviews, addReview, restaurantSettings } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewType, setReviewType] = useState<'dining' | 'delivery'>('dining');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    addReview({
      author: authorName,
      rating,
      comment,
      type: reviewType,
      verified: true,
    });

    setFormSuccess(true);
    setTimeout(() => {
      setAuthorName('');
      setComment('');
      setShowAddForm(false);
      setFormSuccess(false);
    }, 1200);
  };

  return (
    <div id="reviews-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6DEC8] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143627] font-cinzel">
            Customer Reviews & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-[#65736C] mt-1">
            Genuine experiences from guests at Wave Mall, Ludhiana
          </p>
        </div>

        <button
          id="write-review-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto flex items-center gap-2"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#C69234]" />
          <span>{showAddForm ? 'Cancel Review' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Ratings Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC8] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E6DEC8]">
          {/* Dining Rating Card */}
          <div className="flex items-center gap-6 md:pr-6">
            <div className="w-20 h-20 rounded-2xl bg-[#FAF0DC] flex flex-col items-center justify-center border border-[#C69234]/30 shadow-xs">
              <span className="text-3xl font-extrabold text-[#9A6B1A]">
                {restaurantSettings.diningRating}
              </span>
              <div className="flex items-center text-amber-500 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(restaurantSettings.diningRating)
                        ? 'fill-amber-500'
                        : 'text-amber-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-cinzel font-bold text-lg text-[#143627]">
                Dining Experience
              </h3>
              <p className="text-xs text-[#65736C] mt-0.5">
                Based on <strong>{restaurantSettings.diningRatingCount}</strong> verified table dining ratings
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                1st Floor Ambience · Wave Mall
              </span>
            </div>
          </div>

          {/* Delivery Rating Card */}
          <div className="pt-6 md:pt-0 md:pl-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#E2F4EA] flex flex-col items-center justify-center border border-[#2E7D58]/30 shadow-xs">
              <span className="text-3xl font-extrabold text-[#1B4D36]">
                {restaurantSettings.deliveryRating}
              </span>
              <div className="flex items-center text-emerald-600 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(restaurantSettings.deliveryRating)
                        ? 'fill-emerald-600'
                        : 'text-emerald-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-cinzel font-bold text-lg text-[#143627]">
                Delivery Experience
              </h3>
              <p className="text-xs text-[#65736C] mt-0.5">
                Based on <strong>{restaurantSettings.deliveryRatingCount}</strong> delivery & takeaway reviews
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                Fresh Packaging & Prompt Service
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded-3xl border-2 border-[#2E7D58] shadow-md space-y-4 animate-in slide-in-from-top-4 duration-300"
        >
          <h3 className="font-bold text-base text-[#143627] font-cinzel">
            Share Your Experience at Madras Leaf
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Jaspreet Kaur"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#235D43]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
                Experience Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewType('dining')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    reviewType === 'dining'
                      ? 'bg-[#143627] text-white border-[#143627]'
                      : 'bg-[#FAF7F2] text-[#2C3B34] border-[#E6DEC8]'
                  }`}
                >
                  Dining at Mall
                </button>
                <button
                  type="button"
                  onClick={() => setReviewType('delivery')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    reviewType === 'delivery'
                      ? 'bg-[#143627] text-white border-[#143627]'
                      : 'bg-[#FAF7F2] text-[#2C3B34] border-[#E6DEC8]'
                  }`}
                >
                  Home Delivery
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#143627] ml-2">
                {rating} out of 5 stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
              Your Review & Comments *
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you enjoy most about the food and service?"
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#235D43]"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-[#E6DEC8] text-xs font-semibold text-[#65736C]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#235D43] hover:bg-[#143627] text-white text-xs font-bold transition-all shadow-sm"
            >
              {formSuccess ? 'Review Submitted!' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            id={`review-item-${rev.id}`}
            className="p-5 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#143627] text-amber-200 font-bold flex items-center justify-center text-sm">
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#143627] text-sm sm:text-base">
                      {rev.author}
                    </h4>
                    {rev.verified && (
                      <span className="flex items-center gap-0.5 text-[11px] text-[#2E7D58] font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#65736C] capitalize">
                    {rev.type} Review · {rev.date}
                  </span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#E6DEC8]">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-xs font-bold text-[#143627]">{rev.rating}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed pt-1">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
