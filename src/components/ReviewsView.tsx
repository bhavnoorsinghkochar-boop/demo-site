import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  MessageSquarePlus,
  CheckCircle,
  ThumbsUp,
  ShieldCheck,
  Sparkles,
  Bot,
  Filter,
} from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { reviews, addReview, restaurantSettings } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewType, setReviewType] = useState<'dining' | 'delivery'>('dining');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [formSuccess, setFormSuccess] = useState(false);

  const POPULAR_TAGS = [
    { id: 'all', label: 'All', count: 65 },
    { id: 'churros', label: 'churros', count: 10 },
    { id: 'waffles', label: 'waffles', count: 8 },
    { id: 'burgers', label: 'burgers', count: 15 },
    { id: 'bubble-waffle', label: 'bubble waffle', count: 2 },
    { id: 'atmosphere', label: 'atmosphere', count: 2 },
    { id: 'lime-soda', label: 'lime soda', count: 6 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    addReview({
      author: authorName.trim(),
      rating,
      comment: comment.trim(),
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

  const filteredReviews = reviews.filter((rev) => {
    if (selectedTag === 'all') return true;
    const text = rev.comment.toLowerCase();
    if (selectedTag === 'churros') return text.includes('churro');
    if (selectedTag === 'bubble-waffle') return text.includes('bubble');
    if (selectedTag === 'waffles') return text.includes('waffle');
    if (selectedTag === 'burgers') return text.includes('burger') || text.includes('smash');
    if (selectedTag === 'atmosphere') return text.includes('atmosphere') || text.includes('vibe') || text.includes('place');
    if (selectedTag === 'lime-soda') return text.includes('lime') || text.includes('soda') || text.includes('colada');
    return true;
  });

  return (
    <div id="reviews-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6DEC8] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
            <span>⭐ Google Verified Reviews · 4.7 Rating</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143627] font-cinzel">
            Customer Reviews & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-[#65736C] mt-1">
            Real feedback from diners at Booth No.20, Main Market, Rajguru Nagar, Ludhiana
          </p>
        </div>

        <button
          id="write-review-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto flex items-center gap-2"
        >
          <MessageSquarePlus className="w-4 h-4 text-white" />
          <span>{showAddForm ? 'Cancel Review' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Ratings Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC8] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E6DEC8]">
          {/* Main 4.7 Overall Rating */}
          <div className="flex items-center gap-6 md:pr-6">
            <div className="w-24 h-24 rounded-2xl bg-red-50 flex flex-col items-center justify-center border border-red-200 shadow-xs shrink-0">
              <span className="text-4xl font-extrabold text-[#DC2626]">
                4.7
              </span>
              <div className="flex items-center text-amber-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < 4 || (i === 4 && true)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-amber-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-cinzel font-bold text-xl text-[#143627]">
                Google Star Rating
              </h3>
              <p className="text-xs sm:text-sm text-[#65736C] mt-1 font-medium">
                Based on <strong>65 verified customer reviews</strong>
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                  Dessert Shop & Burgers
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Takeaway & Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="pt-6 md:pt-0 md:pl-8 space-y-1.5 justify-center flex flex-col">
            {[
              { stars: 5, pct: 85 },
              { stars: 4, pct: 10 },
              { stars: 3, pct: 3 },
              { stars: 2, pct: 1 },
              { stars: 1, pct: 1 },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-right font-bold text-[#143627]">{bar.stars}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-[#DC2626] rounded-full"
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#65736C] w-7 font-mono">{bar.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gemini AI Review Summary Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-50 via-white to-red-50 border border-red-200 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#143627] uppercase tracking-wide">
                Review summary
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                <Bot className="w-3 h-3" />
                Summarized with Gemini
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
              "Diners like this restaurant's unique and flavorful burgers, including the Korean Grilled Chicken Burger and cheese-filled chicken burger, as well as their delicious churros and lime soda. They also highlight the reasonable prices, offering good value for money. Guests mention the cozy and welcoming vibe, along with polite and timely service."
            </p>
          </div>
        </div>
      </div>

      {/* Popular Review Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#65736C]">
          <Filter className="w-3.5 h-3.5" />
          <span>Popular Topics from Reviews:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedTag === tag.id
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-white border border-[#E6DEC8] text-[#143627] hover:bg-red-50'
              }`}
            >
              <span>{tag.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedTag === tag.id ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Review Submission Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded-3xl border-2 border-[#DC2626] shadow-md space-y-4 animate-in slide-in-from-top-4 duration-300"
        >
          <h3 className="font-bold text-base text-[#143627] font-cinzel">
            Share Your Experience at Laa Mamma Mia! Taste Of Singapore
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143627] mb-1">Your Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Harmanpreet Singh"
                className="w-full px-3 py-2 rounded-xl border border-[#E6DEC8] text-xs focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143627] mb-1">Rating</label>
              <div className="flex items-center gap-1 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#143627] mb-1">Your Review</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love about the burgers, churros, bubble waffles, or lime soda?"
              className="w-full px-3 py-2 rounded-xl border border-[#E6DEC8] text-xs focus:outline-none focus:border-[#DC2626]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={reviewType === 'dining'}
                  onChange={() => setReviewType('dining')}
                  className="text-[#DC2626]"
                />
                <span>Dine-In / Counter</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={reviewType === 'delivery'}
                  onChange={() => setReviewType('delivery')}
                  className="text-[#DC2626]"
                />
                <span>Takeaway / Delivery</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={formSuccess}
              className="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold transition-all shadow-xs"
            >
              {formSuccess ? 'Review Submitted!' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 bg-white rounded-3xl border border-[#E6DEC8] shadow-xs space-y-3 hover:border-red-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-[#DC2626] font-bold flex items-center justify-center text-sm">
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#143627]">
                      {rev.author}
                    </h4>
                    {rev.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        <CheckCircle className="w-3 h-3" />
                        Verified Diner
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#65736C]">
                    {rev.date} · {rev.type === 'dining' ? 'Dine-In & Takeaway' : 'Home Delivery'}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating ? 'fill-amber-500' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#2C3B34] leading-relaxed">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
