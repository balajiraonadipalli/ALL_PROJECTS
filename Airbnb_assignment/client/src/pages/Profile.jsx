import { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (e) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>;
  if (error) return <div className="max-w-6xl mx-auto px-4 py-10 text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left sidebar */}
        <aside className="md:col-span-3">
          <h2 className="text-3xl font-bold mb-6">Profile</h2>
          <nav className="space-y-3">
            <a className="flex items-center gap-3 px-5 py-4 border rounded-2xl bg-gray-100" href="#">
              <div className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm">
                {user.name?.[0] || 'U'}
              </div>
              <span className="font-medium">About me</span>
            </a>
            <a className="flex items-center gap-3 px-5 py-4 border rounded-2xl hover:bg-gray-50" href="/trips">
              <span className="text-xl">🧳</span>
              <span className="font-medium">Past trips</span>
            </a>
            <a className="flex items-center gap-3 px-5 py-4 border rounded-2xl hover:bg-gray-50" href="#">
              <span className="text-xl">👥</span>
              <span className="font-medium">Connections</span>
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="md:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-3xl font-bold">About me</h3>
            <button className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">Edit</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border shadow-sm p-6 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl mb-4">
                  {user.name?.[0] || 'U'}
                </div>
                <div className="text-2xl font-semibold">{user.name}</div>
                <div className="text-gray-600">Guest</div>
              </div>
            </div>

            {/* Complete profile */}
            <div>
              <div className="rounded-2xl border shadow-sm p-6">
                <div className="text-xl font-semibold mb-2">Complete your profile</div>
                <div className="text-sm text-gray-600 mb-4">
                  Your Airbnb profile is an important part of every reservation. Create yours to help other
                  hosts and guests get to know you.
                </div>
                <button className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg">Get started</button>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-6">
            <div className="flex items-center gap-3 text-gray-800">
              <span className="text-xl">💬</span>
              <span className="font-medium">Reviews I’ve written</span>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}


