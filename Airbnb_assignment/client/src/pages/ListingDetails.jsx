import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../lib/api.js';
import MapPreview from '../components/MapPreview.jsx';
import ReviewForm from '../components/ReviewForm.jsx';

const API_BASE = 'http://localhost:4000/api';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [bookingMsg, setBookingMsg] = useState(null);
  const [lastBooking, setLastBooking] = useState(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('phonepe');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/listings/${id}`);
        setData(res.data);
      } catch (err) {
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    fetchReviews();
    fetchReviewStats();
  }, [id]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await axios.get(`${API_BASE}/reviews/listing/${id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reviews/listing/${id}/stats`);
      setReviewStats(res.data);
    } catch (err) {
      console.error('Error fetching review stats:', err);
    }
  };

  useEffect(() => {
    // Get current user from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-10">Loading...</div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-10 text-red-600">{error}</div>;
  if (!data) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPropertyTypeLabel = (type) => {
    const labels = {
      apartment: 'Apartment',
      house: 'House',
      condo: 'Condo',
      villa: 'Villa',
      studio: 'Studio',
      loft: 'Loft',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getRoomTypeLabel = (type) => {
    const labels = {
      entire: 'Entire place',
      private: 'Private room',
      shared: 'Shared room'
    };
    return labels[type] || type;
  };


  // Mock amenities data
  const allAmenities = [
    { icon: '🔒', name: 'Lock on bedroom door' },
    { icon: '💡', name: 'Dedicated workspace' },
    { icon: '🏠', name: 'Private patio or balcony' },
    { icon: '🧳', name: 'Luggage drop-off allowed' },
    { icon: '⚠️', name: 'Carbon monoxide alarm' },
    { icon: '📶', name: 'Wifi' },
    { icon: '🚗', name: 'Free on-street parking' },
    { icon: '🌺', name: 'Private back garden - Fully fenced' },
    { icon: '📅', name: 'Long-term stays allowed' },
    { icon: '🚨', name: 'Smoke alarm' },
    { icon: '🏊', name: 'Pool' },
    { icon: '🔥', name: 'Fireplace' },
    { icon: '❄️', name: 'Air conditioning' },
    { icon: '🧺', name: 'Washing machine' },
    { icon: '🍳', name: 'Kitchen' },
    { icon: '📺', name: 'TV' },
    { icon: '🐕', name: 'Pets allowed' },
    { icon: '♿', name: 'Wheelchair accessible' },
    { icon: '🏋️', name: 'Gym' },
    { icon: '🍽️', name: 'Dining area' },
    { icon: '🛏️', name: 'Extra pillows and blankets' }
  ];

  const displayedAmenities = showAllAmenities ? allAmenities : allAmenities.slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-2 h-96">
            <div className="col-span-2">
              {data.images && data.images.length > 0 ? (
                <img 
                  src={data.images[0]} 
                  alt={data.title}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                  No Image
      </div>
              )}
      </div>
            {data.images && data.images.slice(1, 5).map((src, i) => (
              <img 
                key={i} 
                src={src} 
                alt={`${data.title} ${i + 2}`}
                className="w-full h-48 object-cover rounded-2xl"
              />
          ))}
        </div>

          {/* Header Section */}
          <div>
            <h1 className="text-3xl font-semibold mb-2">{data.title}</h1>
            <div className="text-gray-600 mb-4">
              {getRoomTypeLabel(data.roomType)} in {data.location?.city}, {data.location?.state}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {data.maxGuests} guests · {data.bedrooms} bedroom{data.bedrooms !== 1 ? 's' : ''} · {data.bathrooms} bathroom{data.bathrooms !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Ratings Summary */}
          {reviewStats && (
            <div className="border rounded-2xl p-6 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-semibold">{reviewStats.averageOverall.toFixed(1)}</div>
                  <div>
                    <div className="text-lg font-semibold">Guest favourite</div>
                    <div className="text-sm text-gray-600">This home is in the top 5% based on ratings, reviews and reliability</div>
                  </div>
                </div>
                <div className="hidden sm:block text-4xl">🥇</div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Overall rating with bars */}
                <div>
                  <div className="text-sm font-medium text-gray-800 mb-2">Overall rating</div>
                  {[5,4,3,2,1].map((n) => {
                    const count = reviewStats.ratingDistribution[n] || 0;
                    const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                    return (
                      <div key={n} className="flex items-center gap-3 mb-1">
                        <div className="w-3 text-xs text-gray-500">{n}</div>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-black" style={{ width: `${percentage}%` }} />
                        </div>
                        <div className="w-8 text-xs text-gray-500">{count}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Sub ratings */}
                {[
                  { key: 'Cleanliness', value: reviewStats.averageCleanliness, icon: '🧹' },
                  { key: 'Accuracy', value: reviewStats.averageAccuracy, icon: '✔️' },
                  { key: 'Check-in', value: reviewStats.averageCheckin, icon: '🔑' },
                  { key: 'Communication', value: reviewStats.averageCommunication, icon: '💬' },
                  { key: 'Location', value: reviewStats.averageLocation, icon: '🗺️' },
                  { key: 'Value', value: reviewStats.averageValue, icon: '🏷️' }
                ].map((s) => (
                  <div key={s.key} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-gray-800">{s.key}</span>
                    </div>
                    <div className="text-gray-900 font-semibold">{s.value.toFixed(1)}</div>
                  </div>
                ))}
              </div>

              {/* Add Review Button */}
              {currentUser && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Write a Review
                  </button>
                  {!lastBooking?.paid && (
                    <div className="text-xs text-gray-600 mt-2">
                      Tip: Make a reservation and complete payment using "Pay now (mock)" to enable reviews.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Edit Button for Host */}
          {currentUser && data.host && currentUser.id === data.host._id && (
            <div className="mb-4">
              <button
                onClick={() => navigate(`/listing/${id}/edit`)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 smooth-transition hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Listing
              </button>
            </div>
          )}

          {/* Guest Favourite Badge */}
          <div className="flex items-center justify-between p-4 border rounded-2xl bg-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
          <div>
                  <div className="font-semibold">Guest favourite</div>
                  <div className="text-sm text-gray-600">One of the most loved homes on Airbnb, according to guests</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">4.85</div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-600">20 Reviews</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.description}</p>
          </div>

          {/* Amenities */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">What this place offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedAmenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl">{amenity.icon}</span>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowAllAmenities(!showAllAmenities)}
              className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              {showAllAmenities ? 'Show less' : `Show all ${allAmenities.length} amenities`}
            </button>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">★</span>
              <span className="text-2xl font-semibold">
                {reviewStats ? reviewStats.averageOverall.toFixed(1) : '0.0'}
              </span>
              <span className="text-gray-600">
                · {reviewStats ? reviewStats.totalReviews : 0} reviews
              </span>
            </div>
            
            {loadingReviews ? (
              <div className="text-center py-8">Loading reviews...</div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                  <div key={review._id} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {review.guest?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.guest?.name || 'Anonymous'}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.overallRating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review this listing!
              </div>
            )}
            
            {reviews.length > 3 && (
              <button 
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {showAllReviews ? 'Show less' : `Show all ${reviews.length} reviews`}
              </button>
            )}
          </div>

          {/* Map Section */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">Where you'll be</h2>
            <div className="h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <MapPreview
                lat={data.location?.coordinates?.lat || 15.2993}
                lng={data.location?.coordinates?.lng || 74.1240}
                label={`${data.location?.address || 'Canacona'}, ${data.location?.city || 'Goa'}`}
              />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold text-lg mb-2">{data.location?.city || 'Canacona'}</div>
                <div className="text-gray-600 mb-4">{data.location?.address || 'Near Palolem Beach, Goa'}</div>
                <div className="text-sm text-gray-500">
                  This area is known for its beautiful beaches and peaceful atmosphere. 
                  Perfect for a relaxing getaway with easy access to local attractions.
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">🚶</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Walkable area</div>
                    <div className="text-xs text-gray-600">Guests say this area is easy to get around</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">🏖️</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Near the beach</div>
                    <div className="text-xs text-gray-600">Just a 3-4 minute walk to the beach</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🍽️</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Great restaurants</div>
                    <div className="text-xs text-gray-600">Many dining options within walking distance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Host Information - Moved to end of page */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">Meet your host</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Host Profile Card */}
              <div className="lg:col-span-2">
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face" 
                        alt="Host"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xl mb-1">{data.host?.name || 'Santosh'}</div>
                      <div className="text-gray-600 mb-3">Host</div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-semibold">54 Reviews</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">4.72</span>
                          <span className="text-yellow-400 text-lg">★</span>
                          <span className="text-gray-600">Rating</span>
                        </div>
                        <div>
                          <div className="font-semibold">2 Years hosting</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Host Personal Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs">👤</span>
                      </div>
                      <span>Born in the 90s</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs">🎵</span>
                      </div>
                      <span>Favourite song in secondary school: Purple rain</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs">🌍</span>
                      </div>
                      <span>Speaks English</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs">❤️</span>
                      </div>
                      <span>I'm obsessed with: Music, travel, hosting</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Details Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">Host details</h3>
                  <div className="space-y-3 text-sm mb-6">
                    <div>
                      <div className="font-medium">Response rate: 100%</div>
                    </div>
                    <div>
                      <div className="font-medium">Responds within an hour</div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-3 border rounded-lg hover:bg-gray-50 font-medium transition-colors">
                    Message host
                  </button>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                      <span>To help protect your payment, always use Airbnb to send money and communicate with hosts.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {/* Rare Find Banner */}
            <div className="bg-gray-100 rounded-lg p-3 mb-4 flex items-center gap-2">
              <span className="text-pink-500">💎</span>
              <span className="text-sm font-medium">Rare find! This place is usually booked</span>
            </div>

            {/* Price and Booking Card */}
            <div className="border rounded-2xl p-6 shadow-lg">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-semibold">{formatPrice(data.pricePerNight)}</span>
                <span className="text-gray-600">night</span>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="border rounded-lg p-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Check-in</div>
                  <input 
                    type="date" 
                    value={checkIn} 
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-sm border-none outline-none"
                  />
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Checkout</div>
                  <input 
                    type="date" 
                    value={checkOut} 
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-sm border-none outline-none"
                  />
                </div>
              </div>

              {/* Guests Selection */}
              <div className="border rounded-lg p-3 mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Guests</div>
                <select 
                  value={guests} 
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full text-sm border-none outline-none"
                >
                  {Array.from({ length: Math.max(1, data.maxGuests) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} guest{n !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Reserve Button */}
          <button
            onClick={async () => {
              setBookingMsg(null);
              try {
                const res = await api.post('/bookings', { listingId: id, checkIn, checkOut, guests });
                setLastBooking(res.data);
                setBookingMsg(`Booking confirmed: ${res.data.nights} nights, total ₹${res.data.totalPrice}. Choose a payment method.`);
                setShowPaymentModal(true);
              } catch (err) {
                setBookingMsg(err?.response?.data?.error || 'Failed to book');
              }
            }}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
          >
            Reserve
          </button>

              <div className="text-center text-sm text-gray-600 mt-2">
                You won't be charged yet
        </div>

              {bookingMsg && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  {bookingMsg}
          </div>
        )}

        {/* Payment is now handled in the modal */}

              <div className="mt-6 text-center">
                <button className="text-sm text-gray-600 hover:underline flex items-center gap-1 mx-auto">
                  <span>🚩</span>
                  <span>Report this listing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          listingId={id}
          bookingId={lastBooking?.paid ? lastBooking?.id : undefined}
          onReviewSubmitted={() => {
            setShowReviewForm(false);
            fetchReviews();
            fetchReviewStats();
          }}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Static Payment Modal */}
      {showPaymentModal && lastBooking?.id && !lastBooking?.paid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Complete your payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 cursor-pointer" onClick={() => setSelectedPaymentMethod('phonepe')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">P</div>
                  <div className="flex-1">
                    <div className="font-medium">PhonePe</div>
                    <div className="text-xs text-gray-600">Pay securely with PhonePe</div>
                  </div>
                  <input type="radio" name="pay" checked={selectedPaymentMethod==='phonepe'} onChange={() => setSelectedPaymentMethod('phonepe')} />
                </div>
              </div>
              <div className="border rounded-lg p-4 cursor-pointer" onClick={() => setSelectedPaymentMethod('upi')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-green-600 text-white flex items-center justify-center text-lg font-bold">U</div>
                  <div className="flex-1">
                    <div className="font-medium">UPI</div>
                    <div className="text-xs text-gray-600">Use any UPI app (static)</div>
                  </div>
                  <input type="radio" name="pay" checked={selectedPaymentMethod==='upi'} onChange={() => setSelectedPaymentMethod('upi')} />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Amount payable: <span className="font-semibold">{formatPrice(lastBooking?.totalPrice || 0)}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={async () => {
                  try {
                    const res = await api.post('/bookings/mock-pay', { bookingId: lastBooking.id });
                    if (res.data?.paid) {
                      setBookingMsg('Payment successful. Your trip is confirmed.');
                      setLastBooking({ ...lastBooking, paid: true });
                      setShowPaymentModal(false);
                    }
                  } catch (_e) {
                    setBookingMsg('Payment failed. Please try again.');
                  }
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Pay now
              </button>
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 border py-3 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">This is a static payment simulation. No real transaction occurs.</div>
          </div>
        </div>
      )}
    </div>
  );
}