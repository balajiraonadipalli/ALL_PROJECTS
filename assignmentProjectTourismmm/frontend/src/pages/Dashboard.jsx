import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [savedResponse, bookingsResponse] = await Promise.all([
        api.get(`/users/${user.id}/saved`),
        api.get(`/users/${user.id}/bookings`)
      ]);
      
      setSavedDestinations(savedResponse.data);
      setBookings(bookingsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDestination = async (destinationId) => {
    try {
      const response = await api.post(`/users/${user.id}/save/${destinationId}`);
      if (response.data.saved) {
        setSavedDestinations([...savedDestinations, response.data.destination]);
      } else {
        setSavedDestinations(savedDestinations.filter(dest => dest._id !== destinationId));
      }
    } catch (error) {
      console.error('Error saving destination:', error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user.name}!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Destinations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Saved Destinations
          </h2>
          {savedDestinations.length > 0 ? (
            <div className="space-y-4">
              {savedDestinations.map((destination) => (
                <div key={destination._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {destination.location.city}, {destination.location.country}
                  </p>
                  <p className="text-blue-600 font-semibold">
                    ${destination.price}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No saved destinations yet</p>
          )}
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Bookings
          </h2>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {booking.destination.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {booking.numberOfPeople} people
                  </p>
                  <p className="text-blue-600 font-semibold">
                    Total: ${booking.totalPrice}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No bookings yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

