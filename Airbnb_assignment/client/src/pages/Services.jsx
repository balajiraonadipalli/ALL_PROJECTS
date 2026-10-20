import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { api } from '../lib/api';
import MapPreview from '../components/MapPreview';

const ServiceCard = ({ service, onToggleFavorite, favorites }) => {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [cardRating, setCardRating] = useState(service.rating || 0);
  const [cardTotalReviews, setCardTotalReviews] = useState(service.totalReviews || 0);
  
  if (!service) return null;
  
  const serviceId = service.id || service._id;
  const isFavorite = favorites.includes(serviceId);
  const imageUrl = service.images && service.images.length > 0 ? service.images[0] : 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400';
  const rating = cardRating || 0;
  const totalReviews = cardTotalReviews || 0;
  const pricePerGuest = service.pricePerGuest || 0;
  const location = service.location || {};
  const city = location.city || 'Location';
  const country = location.country || '';
  const coordFallback = { lat: 15.2993, lng: 74.1240 }; // Goa fallback
  const coordinates = (location.coordinates && typeof location.coordinates.lat === 'number' && typeof location.coordinates.lng === 'number')
    ? location.coordinates
    : coordFallback;

  // Refresh stats on interval and when tab regains focus
  useEffect(() => {
    let alive = true;
    const fetchStats = async () => {
      try {
        const res = await api.get(`/reviews/service/${serviceId}/stats`);
        if (!alive) return;
        setCardRating(Number(res.data?.averageRating || 0));
        setCardTotalReviews(Number(res.data?.totalReviews || 0));
      } catch (_e) {}
    };
    fetchStats();
    const onFocus = () => fetchStats();
    window.addEventListener('focus', onFocus);
    const intervalId = setInterval(fetchStats, 20000);
    return () => {
      alive = false;
      window.removeEventListener('focus', onFocus);
      clearInterval(intervalId);
    };
  }, [serviceId]);
  
  return (
    <div 
      className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
      onClick={() => navigate(`/service/${serviceId}`)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={service.title || 'Service'}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(serviceId);
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110"
        >
          {isFavorite ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500 transition-all duration-200" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600 transition-all duration-200" />
          )}
        </button>
        {service.label && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            service.label === 'popular' ? 'bg-yellow-100 text-yellow-800' :
            service.label === 'new' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {service.label === 'popular' ? 'Popular' : 
             service.label === 'new' ? 'New' : 'Coming Soon'}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-gray-700 transition-colors duration-200">
            {service.title || 'Untitled Service'}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}>★</span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {rating.toFixed(1)} · {totalReviews} reviews
          </span>
        </div>
        
        <div className="text-gray-600 text-sm mb-3 group-hover:text-gray-500 transition-colors duration-200">
          {city}{country ? `, ${country}` : ''}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
              From ₹{pricePerGuest.toLocaleString()} / guest
            </div>
            {service.minimumBooking && (
              <div className="text-sm text-gray-500">
                Minimum ₹{service.minimumBooking.toLocaleString()} to book
              </div>
            )}
          </div>
          
        </div>

        
        {service.availability === 'coming-soon' && (
          <div className="mt-3 text-sm text-orange-600 font-medium">
            Coming soon
          </div>
        )}
      </div>
      
    </div>
  );
};

// Internal helper to load stats without re-render loops
const StatsLoader = ({ serviceId, onStats }) => {
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get(`/reviews/service/${serviceId}/stats`);
        const avg = Number(res.data?.averageRating || 0);
        const total = Number(res.data?.totalReviews || 0);
        if (alive) onStats(avg, total);
      } catch (_e) {}
    })();
    return () => { alive = false; };
  }, [serviceId]);
  return null;
};

const ServiceCategory = ({ title, services, onToggleFavorite, favorites }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollContainerRef = useRef(null);
  const isScrollingRef = useRef(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollByStep = (direction) => {
    const container = scrollContainerRef.current;
    if (!container || isScrollingRef.current) return;

    const firstChild = container.firstElementChild;
    if (!firstChild) return;

    // Card width + gap (gap-6 => 24px)
    const cardWidth = firstChild.clientWidth;
    const gap = 24;
    const step = cardWidth + gap;

    const current = container.scrollLeft;
    const delta = direction === 'left' ? -step : step;
    const target = Math.max(0, current + delta);

    isScrollingRef.current = true;
    container.scrollTo({ left: target, behavior: 'smooth' });
    // Re-enable buttons shortly after scroll completes
    setTimeout(() => {
      isScrollingRef.current = false;
      checkScrollButtons();
    }, 400);
  };

  const scrollLeft = () => scrollByStep('left');
  const scrollRight = () => scrollByStep('right');

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [services]);

  if (!services || services.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-3 rounded-full border shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              !canScrollLeft 
                ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                : 'hover:bg-gray-50 hover:shadow-md bg-white'
            }`}
          >
            <ChevronLeftIcon className={`w-5 h-5 transition-colors duration-200 ${
              !canScrollLeft ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-3 rounded-full border shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              !canScrollRight 
                ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                : 'hover:bg-gray-50 hover:shadow-md bg-white'
            }`}
          >
            <ChevronRightIcon className={`w-5 h-5 transition-colors duration-200 ${
              !canScrollRight ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory'
        }}
      >
        {services.map((service) => (
          <div key={service.id || service._id} style={{ scrollSnapAlign: 'start' }}>
            <ServiceCard
              service={service}
              onToggleFavorite={onToggleFavorite}
              favorites={favorites}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchServices();
    // hydrate favorites from API if logged in; fallback to local
    (async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/favorites');
          if (res.data?.services) setFavorites(res.data.services);
          return;
        } catch (_e) {}
      }
      try {
        const stored = JSON.parse(localStorage.getItem('favorites:services') || '[]');
        if (Array.isArray(stored)) setFavorites(stored);
      } catch (_e) {}
    })();
  }, []);

  useEffect(() => {
    // persist favorites
    try {
      localStorage.setItem('favorites:services', JSON.stringify(favorites));
    } catch (_e) {}
  }, [favorites]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services/categories');
      setServices(response.data.categories);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const onToggleFavorite = async (serviceId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.post('/favorites/toggle', { type: 'service', id: serviceId });
        if (res.data?.services) {
          setFavorites(res.data.services);
          return;
        }
      } catch (_e) {}
    }
    setFavorites(prev => prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]);
  };

  const getCategoryTitle = (category) => {
    const titles = {
      'chefs': 'Chefs',
      'training': 'Training',
      'photography': 'Photography',
      'massage': 'Massage',
      'makeup': 'Make-up',
      'hair': 'Hair',
      'spa': 'Spa treatments',
      'catering': 'Catering',
      'nails': 'Nails',
      'prepared-meals': 'Prepared meals'
    };
    return titles[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slideInUp">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Services in South Goa</h1>
          <p className="text-gray-600">Discover unique services from local providers</p>
        </div>

        <div className="space-y-16">
          {services.map((category, index) => (
            <div 
              key={category._id} 
              className="animate-slideInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ServiceCategory
                title={getCategoryTitle(category._id)}
                services={category.services}
                onToggleFavorite={onToggleFavorite}
                favorites={favorites}
              />
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
