import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/signup`, { name, email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err?.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-10">
      <div className="max-w-md mx-auto bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">Create your account</h1>
          <p className="text-sm text-gray-600 mb-6">It only takes a minute</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute inset-y-0 right-2 px-2 text-gray-500">
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-red-600 hover:underline">Log in</a>
          </div>
        </div>
      </div>
    </section>
  );
}


