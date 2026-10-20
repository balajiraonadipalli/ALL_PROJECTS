import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      city: '',
      country: '',
      coordinates: { lat: '', lng: '' }
    },
    price: '',
    duration: '',
    category: '',
    images: []
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/destinations');
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDestination) {
        await api.put(`/destinations/${editingDestination._id}`, formData);
      } else {
        await api.post('/destinations', formData);
      }
      
      setFormData({
        name: '',
        description: '',
        location: { city: '', country: '', coordinates: { lat: '', lng: '' } },
        price: '',
        duration: '',
        category: '',
        images: []
      });
      setShowForm(false);
      setEditingDestination(null);
      fetchDestinations();
    } catch (error) {
      console.error('Error saving destination:', error);
    }
  };

  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description,
      location: destination.location,
      price: destination.price,
      duration: destination.duration,
      category: destination.category,
      images: destination.images || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await api.delete(`/destinations/${id}`);
        fetchDestinations();
      } catch (error) {
        console.error('Error deleting destination:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Destination
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {editingDestination ? 'Edit Destination' : 'Add New Destination'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Destination Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.location.city}
                onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.location.country}
                onChange={(e) => setFormData({...formData, location: {...formData.location, country: e.target.value}})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Duration (e.g., 3 days)"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="beach">Beach</option>
                <option value="mountain">Mountain</option>
                <option value="city">City</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editingDestination ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingDestination(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Destinations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div key={destination._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {destination.images && destination.images[0] && (
              <img
                src={destination.images[0]}
                alt={destination.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {destination.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {destination.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ${destination.price}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(destination)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(destination._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

