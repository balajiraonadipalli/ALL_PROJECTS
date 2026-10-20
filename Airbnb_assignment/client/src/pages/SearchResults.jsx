import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import MapPreview from '../components/MapPreview.jsx';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '1',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    propertyType: searchParams.get('propertyType') || '',
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.location) params.append('location', filters.location);
      if (filters.checkIn) params.append('checkIn', filters.checkIn);
      if (filters.checkOut) params.append('checkOut', filters.checkOut);
      if (filters.guests) params.append('guests', filters.guests);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await api.get(`/listings?${params.toString()}`);
      setListings(response.data.listings || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchListings();
  };

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

  const getTotalPrice = (pricePerNight, nights = 5) => {
    return pricePerNight * nights;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex">
          <div className="w-2/3 p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg">
                  <div className="w-64 h-48 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/3 bg-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">{listings.length} homes</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Prices include all fees</span>
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <button
                onClick={() => setShowMap(!showMap)}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Listings Section */}
        <div className={`${showMap ? 'w-2/3' : 'w-full'} p-6`}>
          {/* Filters */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Where to?"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check-in</label>
                <input
                  type="date"
                  value={filters.checkIn}
                  onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check-out</label>
                <input
                  type="date"
                  value={filters.checkOut}
                  onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Guests</label>
                <select
                  value={filters.guests}
                  onChange={(e) => handleFilterChange('guests', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5+ guests</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min price"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max price"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Any type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={fetchListings}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/listing/${listing._id}`)}
                >
                  {/* Image */}
                  <div className="relative w-64 h-48 flex-shrink-0">
                    <div className="w-full h-full rounded-lg overflow-hidden">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to wishlist functionality
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Guest Favourite Badge */}
                    {Math.random() > 0.7 && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-xs font-medium">
                        <span>🏆</span>
                        <span>Guest favourite</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span>★ {Math.random() > 0.5 ? '5.0' : '4.7'}</span>
                          <span>({Math.floor(Math.random() * 100) + 10})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {formatPrice(getTotalPrice(listing.pricePerNight))}
                        </div>
                        <div className="text-sm text-gray-600">for 5 nights</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      {getPropertyTypeLabel(listing.propertyType)} in {listing.location?.city}
                    </div>

                    <div className="text-sm text-gray-600">
                      {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''} · {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      {filters.checkIn && filters.checkOut 
                        ? `${filters.checkIn} - ${filters.checkOut}`
                        : 'Available dates'
                      }
                    </div>
                  </div>
                </div>
              ))}

              {listings.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-600 mb-4">No listings found</div>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Back to Search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map Section */}
        {showMap && (
          <div className="w-1/3 border-l">
            <div className="sticky top-20 h-screen">
              <MapPreview
                listings={listings}
                center={{
                  lat: listings[0]?.location?.coordinates?.lat || 17.6868,
                  lng: listings[0]?.location?.coordinates?.lng || 83.2185
                }}
                zoom={12}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
