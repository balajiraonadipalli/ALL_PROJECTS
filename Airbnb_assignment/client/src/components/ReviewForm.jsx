import { useState } from 'react';
import api from '../lib/api.js';

export default function ReviewForm({ listingId, experienceId, serviceId, bookingId, onReviewSubmitted, onCancel }) {
  const [formData, setFormData] = useState({
    overallRating: 5,
    subRatings: {
      cleanliness: 5,
      accuracy: 5,
      checkin: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (category, value) => {
    if (category === 'overall') {
      setFormData(prev => ({ ...prev, overallRating: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        subRatings: { ...prev.subRatings, [category]: value }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Only listings require a paid booking; experiences/services do not
      if (listingId && !bookingId) {
        throw new Error('You need a completed, paid booking to review this stay.');
      }

      await api.post('/reviews', {
        listingId,
        experienceId,
        serviceId,
        bookingId,
        ...formData
      });

      onReviewSubmitted();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium w-24">{label}:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Write a Review</h2>
        {listingId && !bookingId && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
            You must have a paid booking for this listing before reviewing. Reserve the stay and complete payment first.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-lg font-medium mb-3">Overall Rating</label>
            <StarRating
              value={formData.overallRating}
              onChange={(value) => handleRatingChange('overall', value)}
              label="Overall"
            />
          </div>

          {/* Sub Ratings */}
          <div>
            <label className="block text-lg font-medium mb-3">Rate your experience</label>
            <div className="space-y-3">
              <StarRating
                value={formData.subRatings.cleanliness}
                onChange={(value) => handleRatingChange('cleanliness', value)}
                label="Cleanliness"
              />
              <StarRating
                value={formData.subRatings.accuracy}
                onChange={(value) => handleRatingChange('accuracy', value)}
                label="Accuracy"
              />
              <StarRating
                value={formData.subRatings.checkin}
                onChange={(value) => handleRatingChange('checkin', value)}
                label="Check-in"
              />
              <StarRating
                value={formData.subRatings.communication}
                onChange={(value) => handleRatingChange('communication', value)}
                label="Communication"
              />
              <StarRating
                value={formData.subRatings.location}
                onChange={(value) => handleRatingChange('location', value)}
                label="Location"
              />
              <StarRating
                value={formData.subRatings.value}
                onChange={(value) => handleRatingChange('value', value)}
                label="Value"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-lg font-medium mb-3">Tell us about your stay</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience with other guests..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={4}
              required
              minLength={10}
              maxLength={1000}
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.comment.length}/1000 characters
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.comment.length < 10}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
