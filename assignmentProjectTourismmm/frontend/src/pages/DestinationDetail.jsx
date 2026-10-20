import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const DestinationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    numberOfPeople: 1
  });
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      const response = await api.get(`/destinations/${id}`);
      setDestination(response.data);
    } catch (error) {
      console.error('Error fetching destination:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/users/booking', {
        destinationId: id,
        ...bookingForm
      });
      alert('Booking created successfully!');
      setShowBookingForm(false);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Destination not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {destination.images && destination.images.length > 0 ? (
            <div className="space-y-4">
              <img
                src={destination.images[0]}
                alt={destination.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {destination.images.length > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {destination.images.slice(1, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${destination.name} ${index + 2}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {destination.name}
          </h1>
          
          <div className="mb-6">
            <p className="text-xl text-gray-600 mb-2">
              {destination.location.city}, {destination.location.country}
            </p>
            <p className="text-3xl font-bold text-blue-600 mb-4">
              ${destination.price}
            </p>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {destination.category}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {destination.description}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trip Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Duration:</span> {destination.duration}</p>
              <p><span className="font-medium">Category:</span> {destination.category}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowBookingForm(true)}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Book {destination.name}
            </h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={bookingForm.startDate}
                  onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={bookingForm.endDate}
                  onChange={(e) => setBookingForm({...bookingForm, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of People
                </label>
                <input
                  type="number"
                  min="1"
                  value={bookingForm.numberOfPeople}
                  onChange={(e) => setBookingForm({...bookingForm, numberOfPeople: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetail;

