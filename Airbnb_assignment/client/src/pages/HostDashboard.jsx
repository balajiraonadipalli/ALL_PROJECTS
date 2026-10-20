import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

export default function HostDashboard() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/listings/mine');
        setListings(res.data.listings || []);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const deleteListing = async (id) => {
    if (!window.confirm('Delete this listing? This can be undone by re-creating, but it will be hidden from users.')) return;
    try {
      setBusyId(id);
      await api.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to delete listing');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>;
  if (error) return <div className="max-w-6xl mx-auto px-4 py-10 text-red-600">{error}</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your listings</h1>
        <a href="/host/new" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Create listing</a>
      </div>
      {listings.length === 0 ? (
        <div className="text-gray-600">No listings yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <article key={l._id} className="border rounded overflow-hidden hover-lift card-enter">
              <div className="aspect-video bg-gray-100 relative">
                {l.images?.[0] && <img src={l.images[0]} className="w-full h-full object-cover" alt="" />}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => navigate(`/listing/${l._id}/edit`)}
                    className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md smooth-transition hover:scale-110"
                    title="Edit listing"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate(`/listing/${l._id}`)}
                    className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md smooth-transition hover:scale-110"
                    title="View listing"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="font-medium truncate">{l.title}</div>
                <div className="text-sm text-gray-600">{l.location?.city}, {l.location?.state}</div>
                <div className="text-sm mt-1">₹{l.pricePerNight} night</div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/listing/${l._id}/edit`)}
                    className="flex-1 px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 smooth-transition hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/listing/${l._id}`)}
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 smooth-transition hover:scale-105"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteListing(l._id)}
                    disabled={busyId === l._id}
                    className={`flex-1 px-3 py-1.5 text-xs border rounded smooth-transition hover:scale-105 ${busyId===l._id ? 'bg-gray-200 text-gray-400' : 'border-red-300 text-red-600 hover:bg-red-50'}`}
                  >
                    {busyId === l._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}


