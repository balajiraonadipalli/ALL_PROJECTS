import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import ImageUploader from '../components/ImageUploader.jsx';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    images: [],
    pricePerNight: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    lat: '',
    lng: '',
    amenities: '',
    propertyType: 'apartment',
    roomType: 'entire',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        const listing = res.data;
        
        setForm({
          title: listing.title || '',
          description: listing.description || '',
          images: listing.images || [],
          pricePerNight: listing.pricePerNight || '',
          address: listing.location?.address || '',
          city: listing.location?.city || '',
          state: listing.location?.state || '',
          country: listing.location?.country || 'India',
          lat: listing.location?.coordinates?.lat || '',
          lng: listing.location?.coordinates?.lng || '',
          amenities: (listing.amenities || []).join(', '),
          propertyType: listing.propertyType || 'apartment',
          roomType: listing.roomType || 'entire',
          maxGuests: listing.maxGuests || 2,
          bedrooms: listing.bedrooms || 1,
          bathrooms: listing.bathrooms || 1,
        });
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load listing');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        images: form.images,
        pricePerNight: Number(form.pricePerNight),
        location: {
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          coordinates: {
            lat: Number(form.lat),
            lng: Number(form.lng),
          },
        },
        amenities: (form.amenities || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        propertyType: form.propertyType,
        roomType: form.roomType,
        maxGuests: Number(form.maxGuests),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
      };

      await api.put(`/listings/${id}`, payload);
      setSuccess('Listing updated successfully');
      setTimeout(() => {
        navigate(`/listing/${id}`);
      }, 800);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => navigate('/host')} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Edit listing</h1>
        <button 
          onClick={() => navigate(`/listing/${id}`)} 
          className="px-4 py-2 text-gray-600 hover:text-gray-800 smooth-transition"
        >
          ← Back to listing
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input 
            name="title" 
            value={form.title} 
            onChange={onChange} 
            required 
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={onChange} 
            required 
            rows={4} 
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Images</label>
          <ImageUploader
            images={form.images}
            onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Price per night (INR)</label>
          <input 
            name="pricePerNight" 
            type="number" 
            min="0" 
            value={form.pricePerNight} 
            onChange={onChange} 
            required 
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Max guests</label>
          <input 
            name="maxGuests" 
            type="number" 
            min="1" 
            value={form.maxGuests} 
            onChange={onChange} 
            required 
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Bedrooms</label>
          <input 
            name="bedrooms" 
            type="number" 
            min="0" 
            value={form.bedrooms} 
            onChange={onChange} 
            required 
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Bathrooms</label>
          <input 
            name="bathrooms" 
            type="number" 
            min="0" 
            value={form.bathrooms} 
            onChange={onChange} 
            required 
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Property type</label>
          <select 
            name="propertyType" 
            value={form.propertyType} 
            onChange={onChange} 
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="loft">Loft</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Room type</label>
          <select 
            name="roomType" 
            value={form.roomType} 
            onChange={onChange} 
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="entire">Entire place</option>
            <option value="private">Private room</option>
            <option value="shared">Shared room</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Amenities (comma separated)</label>
          <input 
            name="amenities" 
            value={form.amenities} 
            onChange={onChange} 
            placeholder="WiFi, Kitchen, AC" 
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
          />
        </div>
        
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input 
              name="address" 
              value={form.address} 
              onChange={onChange} 
              required 
              className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input 
              name="city" 
              value={form.city} 
              onChange={onChange} 
              required 
              className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input 
              name="state" 
              value={form.state} 
              onChange={onChange} 
              required 
              className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input 
              name="country" 
              value={form.country} 
              onChange={onChange} 
              required 
              className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input 
              name="lat" 
              type="number" 
              step="any" 
              value={form.lat} 
              onChange={onChange} 
              required 
              className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input 
              name="lng" 
              type="number" 
              step="any" 
              value={form.lng} 
              onChange={onChange} 
              required 
              className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            />
          </div>
        </div>

        {error && (
          <div className="md:col-span-2 text-sm text-red-600 animate-slideDown">
            {error}
          </div>
        )}
        
        {success && (
          <div className="md:col-span-2 text-sm text-green-600 animate-slideDown">
            {success}
          </div>
        )}

        <div className="md:col-span-2 flex gap-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 smooth-transition hover:scale-105"
          >
            {loading ? 'Updating...' : 'Update listing'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate(`/listing/${id}`)} 
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 smooth-transition hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
