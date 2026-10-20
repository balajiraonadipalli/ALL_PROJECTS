import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

const API_BASE = 'http://localhost:4000/api';

export default function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Wishlists from backend
  const [wishlists, setWishlists] = useState([]);
  // Set of all favorited listing IDs for quick lookup and heart fill
  const [favorites, setFavorites] = useState(new Set());
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [selectModal, setSelectModal] = useState({ open: false, listingId: null });
  const [searchLocation, setSearchLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTab, setCalendarTab] = useState('dates'); // 'dates' | 'months' | 'flexible'
  const [monthsDuration, setMonthsDuration] = useState(3);
  const [monthsStart, setMonthsStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 1);
  });
  const dialRef = useRef(null);
  const calendarRef = useRef(null);
  const whenRef = useRef(null);
  const [dragDial, setDragDial] = useState(false);
  const [startDate, setStartDate] = useState(null); // Date or null
  const [endDate, setEndDate] = useState(null); // Date or null
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const suggestions = [
    { title: 'Nearby', subtitle: "Find what's around you", icon: '📍' },
    { title: 'Puducherry, Puducherry', subtitle: 'Popular beach destination', icon: '🏖️' },
    { title: 'North Goa, Goa', subtitle: "For its bustling nightlife", icon: '🌴' },
    { title: 'New Delhi, Delhi', subtitle: 'For sights like India Gate', icon: '🛕' },
    { title: 'Manali, Himachal Pradesh', subtitle: 'For nature lovers', icon: '⛰️' },
    { title: 'Jaipur, Rajasthan', subtitle: 'For its stunning architecture', icon: '🏰' },
    { title: 'Calangute, Goa', subtitle: 'Known for its beaches', icon: '🏝️' },
  ];

  useEffect(() => {
    fetchListings();
    fetchWishlists();
    fetchFavorites();
  }, []);

  const fetchWishlists = async () => {
    try {
      const response = await api.get('/wishlists');
      setWishlists(response.data.wishlists || []);
    } catch (err) {
      console.error('Error fetching wishlists:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/wishlists/favorites');
      setFavorites(new Set(response.data.favorites || []));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };


  const toggleWishlist = (e, id) => {
    // Prevent navigating to details when clicking the heart
    e.stopPropagation();
    // If already in any wishlist, remove from all
    if (favorites.has(id)) {
      removeFromAllWishlists(id);
      return;
    }
    // If no wishlist exists, prompt to create one first and queue the add
    if (wishlists.length === 0) {
      setNewWishlistName('');
      setPendingAddId(id);
      setShowCreateModal(true);
      return;
    }
    // Otherwise open select modal to choose destination wishlist
    setSelectModal({ open: true, listingId: id });
  };

  const removeFromAllWishlists = async (listingId) => {
    try {
      // Find all wishlists containing this listing
      const wishlistsWithItem = wishlists.filter(wl => 
        wl.items.some(item => item._id === listingId || item === listingId)
      );
      
      // Remove from each wishlist
      for (const wishlist of wishlistsWithItem) {
        await api.delete(`/wishlists/${wishlist._id}/items/${listingId}`);
      }
      
      // Refresh data
      await fetchFavorites();
    } catch (err) {
      console.error('Error removing from wishlists:', err);
    }
  };

  // Track a pending add when creating first wishlist
  const [pendingAddId, setPendingAddId] = useState(null);

  const createWishlist = async () => {
    const name = newWishlistName.trim().slice(0, 50);
    if (!name) return;
    
    try {
      const response = await api.post('/wishlists', { name });
      setWishlists(prev => [response.data, ...prev]);
      
      // If there's a pending add, add it to the new wishlist
      if (pendingAddId) {
        await api.post(`/wishlists/${response.data._id}/items`, { listingId: pendingAddId });
        await fetchFavorites();
      }
      
      setShowCreateModal(false);
      setPendingAddId(null);
      setNewWishlistName('');
    } catch (err) {
      console.error('Error creating wishlist:', err);
    }
  };

  const addToWishlistId = async (listingId, wishlistId) => {
    try {
      await api.post(`/wishlists/${wishlistId}/items`, { listingId });
      await fetchFavorites();
      setSelectModal({ open: false, listingId: null });
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchLocation) params.append('location', searchLocation);
      if (guests) params.append('guests', guests);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (propertyType) params.append('propertyType', propertyType);
      const response = await axios.get(`${API_BASE}/listings?${params}`);
      setListings(response.data.listings || []);
    } catch (err) {
      setError('Failed to load listings');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const monthLabel = (d) => d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const addMonths = (date, count) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + count);
    return d;
  };
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
  const isBetween = (d, a, b) => a && b && d > a && d < b;
  const isPast = (d) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return d < today;
  };
  const formatRange = (a, b) => {
    if (!a && !b) return '';
    const fmt = (dt) => dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    return b ? `${fmt(a)} - ${fmt(b)}` : fmt(a);
  };
  const formatMonthDay = (dt) => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const updateMonthsFromPointer = (clientX, clientY) => {
    const el = dialRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let angle = Math.atan2(dy, dx); // -PI..PI, with 0 to the right
    if (angle < 0) angle += Math.PI * 2; // 0..2PI
    const months = Math.max(1, Math.min(12, Math.round((angle / (Math.PI * 2)) * 12)));
    setMonthsDuration(months);
  };

  useEffect(() => {
    if (!dragDial) return;
    const onMove = (e) => updateMonthsFromPointer(e.clientX, e.clientY);
    const onUp = () => setDragDial(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragDial]);

  // Close calendar on outside click / ESC
  useEffect(() => {
    if (!showCalendar) return;
    const handleClickOutside = (e) => {
      // Check if click is outside both the calendar modal and the input field
      if (
        calendarRef.current && 
        !calendarRef.current.contains(e.target) &&
        whenRef.current && 
        !whenRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };
    const handleEscape = (e) => { 
      if (e.key === 'Escape') setShowCalendar(false); 
    };
    
    // Use a small delay to avoid closing immediately when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 100);
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showCalendar]);

  // Close suggestions on outside click / ESC
  useEffect(() => {
    if (!showSuggestions) return;
    const handleClickOutside = (e) => {
      // Check if click is outside the suggestions dropdown
      const suggestionsElement = document.querySelector('[data-suggestions]');
      if (suggestionsElement && !suggestionsElement.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    const handleEscape = (e) => { 
      if (e.key === 'Escape') setShowSuggestions(false); 
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showSuggestions]);

  const handlePick = (d) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
    } else if (d >= startDate) {
      setEndDate(d);
      setShowCalendar(false);
    } else {
      setStartDate(d);
      setEndDate(null);
    }
  };

  const CalendarMonth = ({ baseDate }) => {
    const y = baseDate.getFullYear();
    const m = baseDate.getMonth();
    const startWeekday = firstDayOfMonth(y, m);
    const total = daysInMonth(y, m);
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(y, m, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return (
      <div className="p-6">
        <div className="text-center font-semibold mb-4 text-gray-900">{monthLabel(baseDate)}</div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-3">
          <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((d, idx) => {
            const active = d && (isSameDay(d, startDate) || isSameDay(d, endDate));
            const between = d && isBetween(d, startDate, endDate);
            const disabled = !d || isPast(d);
            return (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => d && !disabled && handlePick(d)}
                className={
                  `h-10 w-10 text-sm rounded-full transition-all duration-200 flex items-center justify-center ` +
                  (between ? 'bg-red-50 text-red-600 ' : '') +
                  (active ? 'bg-red-500 text-white ' : 'hover:bg-gray-100 hover:scale-105 ') +
                  (disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800')
                }
              >
                {d ? d.getDate() : ''}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to search results page with query parameters
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    if (startDate) params.append('checkIn', startDate.toISOString().split('T')[0]);
    if (endDate) params.append('checkOut', endDate.toISOString().split('T')[0]);
    if (guests) params.append('guests', guests);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (propertyType) params.append('propertyType', propertyType);
    
    navigate(`/search?${params.toString()}`);
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

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading listings...</div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <form onSubmit={handleSearch} className="w-full">
          {/* Mobile compact search */}
          <div className="flex items-center gap-2 sm:hidden animate-slideUp">
            <input
              type="text"
              placeholder="Where to?"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <button type="submit" className="p-3 rounded-full bg-red-500 text-white smooth-transition hover:scale-110 hover:bg-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          {/* Desktop full search */}
          <div className="relative hidden sm:flex items-center bg-white border border-gray-300 rounded-full shadow-lg max-w-4xl mx-auto smooth-transition hover:shadow-xl">
            <div className="flex-1 px-6 py-3 border-r border-gray-300">
              <label className="block text-xs font-semibold text-gray-900 mb-1">Where</label>
              <input
                type="text"
                placeholder="Search destinations"
                value={searchLocation}
                onChange={(e) => { setSearchLocation(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // Small delay to allow clicking on suggestions
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                className="w-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {showSuggestions && (
                <div 
                  data-suggestions 
                  className="absolute left-0 top-full mt-2 z-20 bg-white rounded-2xl border shadow-2xl w-full max-w-2xl overflow-hidden suggestion-enter"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-3 text-sm font-medium text-gray-800">Suggested destinations</div>
                  <div className="max-h-96 overflow-y-auto">
                    {suggestions
                      .filter(s => !searchLocation || s.title.toLowerCase().includes(searchLocation.toLowerCase()))
                      .map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { 
                            setSearchLocation(s.title); 
                            setShowSuggestions(false); 
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex gap-3 transition-colors"
                        >
                          <span className="text-xl w-7 text-center">{s.icon}</span>
                          <span>
                            <div className="font-medium text-gray-900">{s.title}</div>
                            <div className="text-xs text-gray-600">{s.subtitle}</div>
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div ref={whenRef} className="relative px-6 py-3 border-r border-gray-300">
              <label className="block text-xs font-semibold text-gray-900 mb-1">When</label>
              <input
                type="text"
                placeholder="Add dates"
                value={formatRange(startDate, endDate)}
                className="w-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none cursor-pointer smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalendar(!showCalendar);
                }}
                onFocus={() => setShowCalendar(true)}
                readOnly
              />
              {showCalendar && (
                <>
                  {/* Backdrop overlay */}
                  <div 
                    className="fixed inset-0 bg-black/20 z-10"
                    onClick={() => setShowCalendar(false)}
                  />
                  <div className="absolute lg:left-0 left-1/2 -translate-x-1/2 top-full mt-2 z-20 w-[820px] max-w-[calc(100vw-2rem)]">
                    <div ref={calendarRef} className="rounded-2xl overflow-hidden shadow-2xl border bg-white max-h-[80vh] overflow-y-auto transition transform duration-200 ease-out opacity-100 scale-100 modal-enter" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between p-3 border-b">
                      <div className="flex items-center gap-2 text-sm">
                        <button type="button" onClick={() => setCalendarTab('dates')} className={`px-3 py-1.5 rounded-full transition-all duration-200 ${calendarTab==='dates' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>Dates</button>
                        <button type="button" onClick={() => setCalendarTab('months')} className={`px-3 py-1.5 rounded-full transition-all duration-200 ${calendarTab==='months' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>Months</button>
                        <button type="button" onClick={() => setCalendarTab('flexible')} className={`px-3 py-1.5 rounded-full transition-all duration-200 ${calendarTab==='flexible' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>Flexible</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-110" aria-label="Prev">
                          ‹
                        </button>
                        <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-110" aria-label="Next">
                          ›
                        </button>
                      </div>
                    </div>
                    {calendarTab === 'dates' && (
                      <div className="animate-slideUp">
                        <div className="flex gap-8">
                          <CalendarMonth baseDate={currentMonth} />
                          <CalendarMonth baseDate={addMonths(currentMonth, 1)} />
                        </div>
                        <div className="flex items-center justify-between p-6 border-t text-sm bg-white">
                          <div className="flex gap-3 flex-wrap">
                            <span className="px-4 py-2 rounded-full border bg-black text-white">Exact dates</span>
                            <span className="px-4 py-2 rounded-full border">± 1 day</span>
                            <span className="px-4 py-2 rounded-full border">± 2 days</span>
                            <span className="px-4 py-2 rounded-full border">± 3 days</span>
                            <span className="px-4 py-2 rounded-full border">± 7 days</span>
                            <span className="px-4 py-2 rounded-full border">± 14 days</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => { setStartDate(null); setEndDate(null); }} className="px-4 py-2 rounded-lg hover:bg-gray-100">Clear</button>
                            <button type="button" onClick={() => setShowCalendar(false)} className="px-6 py-2 bg-red-500 text-white rounded-lg">Done</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {calendarTab === 'months' && (
                      <div className="p-8 flex flex-col items-center animate-slideRight">
                        <div className="text-xl font-semibold mb-6">When’s your trip?</div>
                        {(() => {
                          const pct = Math.min(12, Math.max(1, monthsDuration)) / 12 * 360;
                          const end = addMonths(monthsStart, monthsDuration);
                          const angleDeg = pct; // 0..360
                          return (
                            <>
                              <div
                                ref={dialRef}
                                onPointerDown={(e) => { setDragDial(true); updateMonthsFromPointer(e.clientX, e.clientY); }}
                                className="relative w-72 h-72 rounded-full shadow-inner flex items-center justify-center touch-none select-none"
                                style={{ background: `conic-gradient(#ef4444 ${pct}deg, #e5e7eb 0)` }}
                              >
                                <div className="absolute inset-6 rounded-full bg-white shadow-xl flex items-center justify-center flex-col">
                                  <div className="text-5xl font-bold">{monthsDuration}</div>
                                  <div className="text-sm text-gray-600">months</div>
                                </div>
                                <div className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${angleDeg}deg) translateX(120px)` }}>
                                  <div className="-translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow" />
                                </div>
                              </div>
                              <div className="mt-4 text-xs text-gray-500">Tip: Drag around the ring to set months</div>
                              <div className="mt-6 flex items-center gap-3">
                                <button type="button" onClick={() => setMonthsDuration((v) => Math.max(1, v - 1))} className="w-9 h-9 rounded-full border hover:bg-gray-50">-</button>
                                <input type="range" min="1" max="12" value={monthsDuration} onChange={(e) => setMonthsDuration(Number(e.target.value))} className="w-56" />
                                <button type="button" onClick={() => setMonthsDuration((v) => Math.min(12, v + 1))} className="w-9 h-9 rounded-full border hover:bg-gray-50">+</button>
                              </div>
                              <div className="mt-6 text-gray-800">
                                <span className="border-b">{formatMonthDay(monthsStart)}</span> to <span className="border-b">{formatMonthDay(end)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {calendarTab === 'flexible' && (
                      <div className="p-6 animate-bounceIn">
                        <div className="text-center text-2xl font-semibold mb-8">How long would you like to stay?</div>
                        <div className="flex items-center justify-center gap-4 mb-10">
                          <button type="button" className="px-5 py-3 rounded-full border shadow-sm hover:bg-gray-50">Weekend</button>
                          <button type="button" className="px-5 py-3 rounded-full border shadow-sm hover:bg-gray-50">Week</button>
                          <button type="button" className="px-5 py-3 rounded-full border shadow-sm hover:bg-gray-50">Month</button>
                        </div>
                        <div className="text-center text-2xl font-semibold mb-6">When do you want to go?</div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {['November 2025','December 2025','January 2026','February 2026','March 2026','April 2026'].map((m) => (
                            <button type="button" key={m} className="min-w-[180px] h-[130px] rounded-2xl border shadow-sm flex flex-col items-center justify-center gap-1 hover:bg-gray-50">
                              <span className="text-3xl">📅</span>
                              <span className="font-medium">{m.split(' ')[0]}</span>
                              <span className="text-gray-500 text-sm">{m.split(' ')[1]}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-6">
                          <button type="button" onClick={() => setShowCalendar(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Done</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                </>
              )}
            </div>
            <div className="px-6 py-3 border-r border-gray-300">
              <label className="block text-xs font-semibold text-gray-900 mb-1">Who</label>
              <input
                type="text"
                placeholder="Add guests"
                value={guests ? `${guests} guest${guests > 1 ? 's' : ''}` : ''}
                className="w-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500"
                readOnly
              />
            </div>
            <button
              type="submit"
              className="m-1 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {listings.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No listings found. Try adjusting your search.</p>
          </div>
        ) : (
          <>
            {/* Popular homes section */}
            <div className="mb-8">
            <div className="flex items-center justify-between mb-4 animate-slideRight">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Popular homes in India</h2>
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
                {listings.slice(0, 7).map((listing, index) => (
                  <article 
                    key={listing._id} 
                    onClick={() => navigate(`/listing/${listing._id}`)}
                    className="flex-shrink-0 w-48 cursor-pointer snap-start hover-lift card-enter"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <div className="aspect-[3/2] rounded-xl overflow-hidden">
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded text-xs">
                          Guest favourite
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleWishlist(e, listing._id)}
                        aria-label={favorites.has(listing._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        className="absolute top-3 right-3 p-1 smooth-transition hover:scale-110"
                      >
                        {(() => {
                          const isFav = favorites.has(listing._id);
                          return (
                            <svg
                              className={`w-6 h-6 ${isFav ? 'text-red-500 drop-shadow' : 'text-white'}`}
                              viewBox="0 0 24 24"
                              fill={isFav ? 'currentColor' : 'none'}
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          );
                        })()}
                      </button>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium text-gray-900 text-xs truncate">{listing.title}</h3>
                      <div className="text-xs text-gray-600 mt-1">
                        {listing.location.city}, {listing.location.state}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {formatPrice(listing.pricePerNight)} for 2 nights · ★ 4.{Math.floor(Math.random() * 20) + 80}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Available next month section */}
            <div className="mb-8">
            <div className="flex items-center justify-between mb-4 animate-slideRight">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Available next month in India</h2>
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
                {listings.slice(7, 14).map((listing, index) => (
                  <article 
                    key={listing._id} 
                    onClick={() => navigate(`/listing/${listing._id}`)}
                    className="flex-shrink-0 w-48 cursor-pointer snap-start hover-lift card-enter"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <div className="aspect-[3/2] rounded-xl overflow-hidden">
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded text-xs">
                          Guest favourite
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleWishlist(e, listing._id)}
                        aria-label={favorites.has(listing._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        className="absolute top-3 right-3 p-1 smooth-transition hover:scale-110"
                      >
                        {(() => {
                          const isFav = favorites.has(listing._id);
                          return (
                            <svg
                              className={`w-6 h-6 ${isFav ? 'text-red-500 drop-shadow' : 'text-white'}`}
                              viewBox="0 0 24 24"
                              fill={isFav ? 'currentColor' : 'none'}
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          );
                        })()}
                      </button>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium text-gray-900 text-xs truncate">{listing.title}</h3>
                      <div className="text-xs text-gray-600 mt-1">
                        {listing.location.city}, {listing.location.state}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {formatPrice(listing.pricePerNight)} for 2 nights · ★ 4.{Math.floor(Math.random() * 20) + 80}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Popular stays in Goa */}
            <div className="mb-8">
            <div className="flex items-center justify-between mb-4 animate-slideRight">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Popular stays in Goa</h2>
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
                {listings.slice(0, 16).map((listing, idx) => (
                  <article key={listing._id + '-goa-' + idx} onClick={() => navigate(`/listing/${listing._id}`)} className="flex-shrink-0 w-48 cursor-pointer snap-start hover-lift card-enter" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="relative">
                      <div className="aspect-[3/2] rounded-xl overflow-hidden">
                        {listing.images && listing.images.length > 0 ? (
                          <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">No Image</div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded">Guest favourite</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium text-gray-900 text-xs truncate">{listing.title}</h3>
                      <div className="text-xs text-gray-600 mt-1">Goa</div>
                      <div className="text-xs text-gray-600 mt-1">{formatPrice(listing.pricePerNight)} for 2 nights · ★ 4.{Math.floor(Math.random() * 20) + 80}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Hotels around you */}
            <div className="mb-8">
            <div className="flex items-center justify-between mb-4 animate-slideRight">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Hotels around you</h2>
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
                {listings.slice(16, 32).map((listing, idx) => (
                  <article key={listing._id + '-hotel-' + idx} onClick={() => navigate(`/listing/${listing._id}`)} className="flex-shrink-0 w-48 cursor-pointer snap-start hover-lift card-enter" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="relative">
                      <div className="aspect-[3/2] rounded-xl overflow-hidden">
                        {listing.images && listing.images.length > 0 ? (
                          <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">No Image</div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded">Hotel</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium text-gray-900 text-xs truncate">{listing.title}</h3>
                      <div className="text-xs text-gray-600 mt-1">Near you</div>
                      <div className="text-xs text-gray-600 mt-1">{formatPrice(listing.pricePerNight)} for 2 nights · ★ 4.{Math.floor(Math.random() * 20) + 80}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Select Wishlist Modal */}
      {selectModal.open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 animate-fadeIn" onClick={() => setSelectModal({ open: false, listingId: null })} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md p-4 modal-enter">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold text-gray-900">Save to wishlist</div>
              <button onClick={() => setSelectModal({ open: false, listingId: null })} className="p-1 rounded hover:bg-gray-100 smooth-transition hover:scale-110">✕</button>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y">
              {wishlists.map((wl, index) => (
                <button
                  key={wl._id}
                  onClick={() => addToWishlistId(selectModal.listingId, wl._id)}
                  className="w-full text-left px-3 py-3 hover:bg-gray-50 animate-slideUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="font-medium text-gray-900">{wl.name}</div>
                  <div className="text-xs text-gray-500">{(wl.items || []).length} saved</div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => { setShowCreateModal(true); setPendingAddId(selectModal.listingId); setSelectModal({ open: false, listingId: null }); }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 smooth-transition hover:scale-105"
              >
                Create new
              </button>
              <button onClick={() => setSelectModal({ open: false, listingId: null })} className="px-4 py-2 text-gray-700 smooth-transition hover:scale-105 hover:bg-gray-100 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Wishlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 animate-fadeIn" onClick={() => { setShowCreateModal(false); setPendingAddId(null); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-2xl p-6 modal-enter">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold text-gray-900">Create wishlist</div>
              <button onClick={() => { setShowCreateModal(false); setPendingAddId(null); }} className="p-1 rounded hover:bg-gray-100 smooth-transition hover:scale-110">✕</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value.slice(0, 50))}
                placeholder="Name"
                className="w-full px-4 py-3 border rounded-xl smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <div className="text-xs text-gray-500 mt-1">{newWishlistName.length}/50 characters</div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => { setShowCreateModal(false); setPendingAddId(null); }} className="px-4 py-2 text-gray-700 smooth-transition hover:scale-105 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button
                onClick={createWishlist}
                disabled={!newWishlistName.trim()}
                className={`px-5 py-2 rounded-xl text-white smooth-transition hover:scale-105 ${newWishlistName.trim() ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


