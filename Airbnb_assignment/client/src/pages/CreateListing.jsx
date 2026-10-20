import { useState } from 'react';
import api from '../lib/api.js';
import ImageUploader from '../components/ImageUploader.jsx';

export default function CreateListing() {
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

      const res = await api.post('/listings', payload);
      setSuccess('Listing created successfully');
      setTimeout(() => {
        window.location.href = `/listing/${res.data._id}`;
      }, 800);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Create a listing</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input name="title" value={form.title} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} required rows={4} className="w-full px-3 py-2 border rounded" />
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
          <input name="pricePerNight" type="number" min="0" value={form.pricePerNight} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max guests</label>
          <input name="maxGuests" type="number" min="1" value={form.maxGuests} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bedrooms</label>
          <input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bathrooms</label>
          <input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Property type</label>
          <select name="propertyType" value={form.propertyType} onChange={onChange} className="w-full px-3 py-2 border rounded">
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
          <select name="roomType" value={form.roomType} onChange={onChange} className="w-full px-3 py-2 border rounded">
            <option value="entire">Entire place</option>
            <option value="private">Private room</option>
            <option value="shared">Shared room</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Amenities (comma separated)</label>
          <input name="amenities" value={form.amenities} onChange={onChange} placeholder="WiFi, Kitchen, AC" className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input name="address" value={form.address} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input name="city" value={form.city} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input name="state" value={form.state} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input name="country" value={form.country} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input name="lat" type="number" step="any" value={form.lat} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input name="lng" type="number" step="any" value={form.lng} onChange={onChange} required className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        {error && <div className="md:col-span-2 text-sm text-red-600">{error}</div>}
        {success && <div className="md:col-span-2 text-sm text-green-600">{success}</div>}

        <div className="md:col-span-2">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create listing'}
          </button>
        </div>
      </form>
    </section>
  );
}


