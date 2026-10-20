import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../lib/api.js';

const API_BASE = 'http://localhost:4000/api';

export default function Experiences() {
  const navigate = useNavigate();
  const [originals, setOriginals] = useState([]);
  const [popular, setPopular] = useState([]);
  const [location, setLocation] = useState('South Goa');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const originalsRef = useRef(null);
  const popularRef = useRef(null);

  useEffect(() => {
    fetchExperiences();
    // hydrate favorites from API if logged in; fall back to localStorage
    (async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/favorites');
          if (res.data?.experiences) setFavorites(res.data.experiences);
          return;
        } catch (_e) {}
      }
      try {
        const stored = JSON.parse(localStorage.getItem('favorites:experiences') || '[]');
        if (Array.isArray(stored)) setFavorites(stored);
      } catch (_e) {}
    })();
  }, []);

  useEffect(() => {
    // persist favorites
    try {
      localStorage.setItem('favorites:experiences', JSON.stringify(favorites));
    } catch (_e) {}
  }, [favorites]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      
      // Fetch original experiences
      const originalsRes = await axios.get(`${API_BASE}/experiences/originals`);
      setOriginals(originalsRes.data.experiences || []);

      // Fetch popular experiences for location
      const popularRes = await axios.get(`${API_BASE}/experiences/popular`);
      setPopular(popularRes.data.experiences || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      // Set mock data if API fails
      setOriginals(getMockOriginals());
      setPopular(getMockPopular());
    } finally {
      setLoading(false);
    }
  };

  const scrollingRefs = useRef({});
  const scroll = (ref, direction) => {
    const container = ref.current;
    if (!container) return;

    const key = ref === originalsRef ? 'originals' : 'popular';
    if (scrollingRefs.current[key]) return; // throttle rapid clicks

    const firstChild = container.firstElementChild;
    if (!firstChild) return;

    const cardWidth = firstChild.clientWidth; //  w-80
    const gap = 16; // gap-4
    const step = cardWidth + gap;

    const current = container.scrollLeft;
    const delta = direction === 'left' ? -step : step;
    const target = Math.max(0, current + delta);

    scrollingRefs.current[key] = true;
    container.scrollTo({ left: target, behavior: 'smooth' });
    setTimeout(() => {
      scrollingRefs.current[key] = false;
    }, 400);
  };

  const toggleFavorite = async (id) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.post('/favorites/toggle', { type: 'experience', id });
        if (res.data?.experiences) {
          setFavorites(res.data.experiences);
          return;
        }
      } catch (_e) {}
    }
    // fallback local toggle
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const ExperienceCard = ({ experience }) => {
    const formatPrice = (price) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(price);
    };

    const isFavorite = favorites.includes(experience._id);
    return (
      <div 
        className="flex-shrink-0 w-80 cursor-pointer group transform hover:-translate-y-2 transition-all duration-300"
        onClick={() => navigate(`/experience/${experience._id}`)}
      >
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            {experience.images && experience.images.length > 0 ? (
              <img 
                src={experience.images[0]} 
                alt={experience.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            
            {/* Label */}
            {experience.label && (
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  experience.label === 'original' ? 'bg-purple-600 text-white' : 
                  experience.label === 'popular' ? 'bg-red-600 text-white' : 
                  'bg-blue-600 text-white'
                }`}>
                  {experience.label.charAt(0).toUpperCase() + experience.label.slice(1)}
                </span>
              </div>
            )}
            
            {/* Heart Icon */}
            <button 
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(experience._id);
              }}
            >
              {isFavorite ? (
                <svg className="w-5 h-5 text-red-500 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.59 4.81 14.26 4 16 4 18.5 4 20.5 6 20.5 8.5c0 3.78-3.4 6.86-8.05 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600 transition-colors duration-200 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-gray-700 transition-colors duration-200">
              {experience.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2 group-hover:text-gray-500 transition-colors duration-200">
              {experience.location?.city}, {experience.location?.country}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 transition-transform duration-200 group-hover:scale-110">★</span>
                <span className="text-sm font-medium">{experience.rating?.toFixed(2) || '0.0'}</span>
              </div>
              <div className="text-sm font-semibold group-hover:text-gray-700 transition-colors duration-200">
                From {formatPrice(experience.pricePerGuest)} / guest
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">Loading experiences...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Airbnb Originals Section */}
        <section className="mb-12 animate-slideInUp">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-semibold">Airbnb Originals</h2>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(originalsRef, 'left')}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll(originalsRef, 'right')}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-gray-600 mb-6">Unique experiences, exclusively on our platform.</p>
          
          <div 
            ref={originalsRef}
            className="flex gap-4 overflow-x-auto no-scrollbar pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {originals.length > 0 ? (
              originals.map((exp) => (
                <div key={exp._id} style={{ scrollSnapAlign: 'start' }}>
                  <ExperienceCard experience={exp} />
                </div>
              ))
            ) : (
              <div className="text-gray-500">No original experiences available</div>
            )}
          </div>
        </section>

        {/* Popular Experiences Section */}
        <section className="animate-slideInUp" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-semibold">All experiences in {location}</h2>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(popularRef, 'left')}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll(popularRef, 'right')}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div 
            ref={popularRef}
            className="flex gap-4 overflow-x-auto no-scrollbar pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {popular.length > 0 ? (
              popular.map((exp) => (
                <div key={exp._id} style={{ scrollSnapAlign: 'start' }}>
                  <ExperienceCard experience={exp} />
                </div>
              ))
            ) : (
              <div className="text-gray-500">No popular experiences available</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// Mock data functions for fallback
function getMockOriginals() {
  return [
    {
      _id: '1',
      title: 'Celebrate Brazilian cuisine with Kátia Barbosa',
      location: { city: 'Rio de Janeiro', country: 'Brazil' },
      pricePerGuest: 7507,
      rating: 5.0,
      label: 'original',
      images: ['https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400']
    },
    {
      _id: '2',
      title: 'Carve marble with a third-generation sculptor',
      location: { city: 'Athens', country: 'Greece' },
      pricePerGuest: 5142,
      rating: 5.0,
      label: 'original',
      images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400']
    },
    {
      _id: '3',
      title: 'Experience a sacred Buddhist ritual and yoga class',
      location: { city: 'Haiya Sub-district', country: 'Thailand' },
      pricePerGuest: 1337,
      rating: 4.98,
      label: 'original',
      images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400']
    }
  ];
}

function getMockPopular() {
  return [
    {
      _id: '4',
      title: 'Uncover Fontainhas\' heritage',
      location: { city: 'South Goa', country: 'India' },
      pricePerGuest: 1100,
      rating: 4.9,
      label: 'popular',
      images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400']
    },
    {
      _id: '5',
      title: 'Trek to a hidden waterfall in Goa\'s forest',
      location: { city: 'South Goa', country: 'India' },
      pricePerGuest: 2650,
      rating: 4.99,
      label: 'popular',
      images: ['https://images.unsplash.com/photo-1533777419517-3e4017e2e15a?w=400']
    },
    {
      _id: '6',
      title: 'Kayaking experience on the Chapora river',
      location: { city: 'South Goa', country: 'India' },
      pricePerGuest: 2500,
      rating: 4.99,
      label: 'popular',
      images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=400']
    }
  ];
}
