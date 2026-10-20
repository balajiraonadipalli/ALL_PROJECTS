import { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function Trips() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/bookings/mine');
        setBookings(res.data.bookings || []);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>;
  if (error) return <div className="max-w-6xl mx-auto px-4 py-10 text-red-600">{error}</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Your trips</h1>
      {bookings.length === 0 ? (
        <div className="text-gray-600">No trips yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <article key={b._id} className="border rounded overflow-hidden">
              <div className="aspect-video bg-gray-100">
                {b.listing?.images?.[0] && (
                  <img src={b.listing.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <div className="font-medium truncate">{b.listing?.title}</div>
                <div className="text-sm text-gray-600">
                  {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} · {b.guests} guest{b.guests > 1 ? 's' : ''}
                </div>
                <div className="text-sm mt-1">Total ₹{b.totalPrice}</div>
                <div className={`text-xs mt-1 ${b.paid ? 'text-green-700' : 'text-orange-700'}`}>
                  {b.paid ? 'Paid' : 'Pending payment'}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}


