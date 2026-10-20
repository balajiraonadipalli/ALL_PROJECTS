import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeartIcon, ShareIcon, MapPinIcon, StarIcon, ClockIcon, UsersIcon, CheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { api } from '../lib/api';
import MapPreview from '../components/MapPreview';
import ReviewForm from '../components/ReviewForm';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('phonepe');
  const [paymentMsg, setPaymentMsg] = useState(null);

  useEffect(() => {
    if (id) {
      fetchService();
      fetchReviews();
      fetchReviewStats();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/services/${id}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
      // Set a fallback service for demo purposes
      setService({
        _id: id,
        title: "Luxury Private Dining by Chef Jimmy Matiz",
        description: "Winner of Food Network's Chopped with over a decade in Michelin-starred kitchens across the world. I create refined, seasonal dining experiences in Southern California designed to surprise and delight.",
        images: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
          'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800'
        ],
        pricePerGuest: 14558,
        minimumBooking: 114695,
        rating: 5.0,
        totalReviews: 10,
        location: {
          city: "Los Angeles",
          country: "United States",
          coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        category: "chefs",
        subcategory: "fine-dining",
        duration: 3,
        maxGuests: 8,
        highlights: [
          "Refined seasonal dining experiences",
          "Professional table service",
          "Premium tableware and presentation",
          "Customized menu based on preferences"
        ],
        provider: {
          name: "Chef Jimmy Matiz",
          bio: "Winner of Food Network's Chopped with over a decade in Michelin-starred kitchens across the world",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60",
          verified: true
        },
        availability: "available"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await api.get(`/reviews?serviceId=${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await api.get(`/reviews/stats?serviceId=${id}`);
      setReviewStats(response.data);
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    fetchReviews();
    fetchReviewStats();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service not found</h1>
          <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/services')}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolidIcon
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <button
            onClick={() => navigate('/services')}
            className="text-gray-600 hover:text-gray-900 mb-4 transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images and Details */}
          <div className="space-y-6 animate-slideInUp" style={{ animationDelay: '100ms' }}>
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-2 h-96">
              <div className="row-span-2 group cursor-pointer">
                <img
                  src={service.images?.[0] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'}
                  alt={service.title}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="group cursor-pointer">
                <img
                  src={service.images?.[1] || service.images?.[0] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="group cursor-pointer">
                <img
                  src={service.images?.[2] || service.images?.[0] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* What you'll get section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">What you'll get</h2>
              
              <div className="space-y-4">
                {service.highlights?.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{highlight}</h3>
                      <p className="text-gray-600 text-sm">
                        {index === 0 && "Professional service with attention to every detail for an exceptional experience."}
                        {index === 1 && "Expert guidance and support throughout the entire service process."}
                        {index === 2 && "Premium materials and tools to ensure the highest quality results."}
                        {index === 3 && "Customized approach tailored to your specific needs and preferences."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4" />
                <span>Service provided at your location</span>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                >
                  Write a Review
                </button>
              </div>

              {/* Rating Summary */}
              {reviewStats && (
                <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <div className="flex items-center gap-1 mb-1">
                      <StarSolidIcon className="w-6 h-6 text-yellow-400" />
                      <span className="text-2xl font-bold text-gray-900">
                        {reviewStats.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{reviewStats.totalReviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-2">{rating}</span>
                        <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${(reviewStats.ratingDistribution[rating] || 0) / reviewStats.totalReviews * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {reviewStats.ratingDistribution[rating] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual Reviews */}
              <div className="space-y-4">
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={review.guest.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40'}
                          alt={review.guest.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.guest.name}</h4>
                          <div className="flex items-center gap-1">
                            {renderStars(review.overallRating)}
                            <span className="text-sm text-gray-600 ml-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet. Be the first to review this service!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Service area</h2>
              <div className="h-96 rounded-2xl overflow-hidden">
                {(() => {
                  const fallback = { lat: 15.2993, lng: 74.1240 };
                  const coords = (service.location?.coordinates && typeof service.location.coordinates.lat === 'number' && typeof service.location.coordinates.lng === 'number')
                    ? service.location.coordinates
                    : fallback;
                  return (
                    <MapPreview
                      center={coords}
                      label={`${service.location?.city || 'Goa'}, ${service.location?.country || 'India'}`}
                      zoom={15}
                    />
                  );
                })()}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPinIcon className="w-4 h-4" />
                <span>Service available in {service.location?.city || 'Goa'}, {service.location?.country || 'India'}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:sticky lg:top-8 lg:h-fit animate-slideInUp" style={{ animationDelay: '200ms' }}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <StarSolidIcon className="w-5 h-5 text-yellow-400" />
                      <span className="font-semibold">{(service.rating || 0).toFixed(1)}</span>
                      <span className="text-gray-600">({service.totalReviews || 0} reviews)</span>
                    </div>
                    <div className="text-gray-600">
                      {service.location?.city || 'Location'} · {service.category || 'Service'}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={toggleFavorite}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                    <ShareIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Provider Info */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
                <img
                  src={service.provider?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60'}
                  alt={service.provider?.name || 'Provider'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Provided by {service.provider?.name || 'Local Provider'}</p>
                  <p className="text-sm text-gray-600">{service.provider?.bio || 'Professional service provider'}</p>
                  {service.provider?.verified && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{service.duration || 3} hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <UsersIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Up to {service.maxGuests || 8} guests</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{service.location?.city || 'Location'}, {service.location?.country || 'Country'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 capitalize">{service.availability || 'Available'}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{(service.pricePerGuest || 0).toLocaleString()}
                  </span>
                  <span className="text-gray-600">/ guest</span>
                </div>
                {service.minimumBooking && (
                  <div className="text-sm text-gray-600 mb-2">
                    Minimum ₹{service.minimumBooking.toLocaleString()} to book
                  </div>
                )}
                <p className="text-sm text-red-600 mb-4">Free cancellation</p>
                
                <button
                  onClick={() => {
                    setPaymentMsg(null);
                    setShowPaymentModal(true);
                  }}
                  className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-colors"
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <ReviewForm
              serviceId={id}
              onReviewSubmitted={handleReviewSubmitted}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}

      {/* Static Payment Modal for Services */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Complete your payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {paymentMsg && (
              <div className="mb-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{paymentMsg}</div>
            )}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 cursor-pointer" onClick={() => setSelectedPaymentMethod('phonepe')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">P</div>
                  <div className="flex-1">
                    <div className="font-medium">PhonePe</div>
                    <div className="text-xs text-gray-600">Pay securely with PhonePe</div>
                  </div>
                  <input type="radio" name="pay-svc" checked={selectedPaymentMethod==='phonepe'} onChange={() => setSelectedPaymentMethod('phonepe')} />
                </div>
              </div>
              <div className="border rounded-lg p-4 cursor-pointer" onClick={() => setSelectedPaymentMethod('upi')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-green-600 text-white flex items-center justify-center text-lg font-bold">U</div>
                  <div className="flex-1">
                    <div className="font-medium">UPI</div>
                    <div className="text-xs text-gray-600">Use any UPI app (static)</div>
                  </div>
                  <input type="radio" name="pay-svc" checked={selectedPaymentMethod==='upi'} onChange={() => setSelectedPaymentMethod('upi')} />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Amount: <span className="font-semibold">₹{(service?.pricePerGuest || 0).toLocaleString()}</span> / guest
                {service?.minimumBooking ? (
                  <span className="block">Minimum booking: ₹{service.minimumBooking.toLocaleString()}</span>
                ) : null}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setPaymentMsg('Payment successful (static). Your reservation is noted.');
                  setTimeout(() => setShowPaymentModal(false), 800);
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
};

export default ServiceDetails;
