import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export default function AuthModal({ open, onClose, initialMode = 'login', onAuthed }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [authMethod, setAuthMethod] = useState('email'); // 'phone' | 'email'
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India (+91)');

  useEffect(() => {
    setMode(initialMode);
    setEmail('');
    setName('');
    setPassword('');
    setError(null);
    setShowPwd(false);
  }, [initialMode, open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (authMethod === 'phone') {
        // Mock phone flow → switch to email as minimal viable
        setAuthMethod('email');
        setLoading(false);
        return;
      } else {
        if (mode === 'login') {
          const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
          localStorage.setItem('token', res.data.token);
        } else {
          const res = await axios.post(`${API_BASE}/auth/signup`, { name, email, password });
          localStorage.setItem('token', res.data.token);
        }
      }
      onAuthed?.();
      onClose?.();
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-start sm:items-center justify-center overflow-y-auto p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-sm font-medium">Log in or sign up</div>
            <div className="w-9" />
          </div>
          <div className="px-5 py-6 sm:px-8 sm:py-8 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-1">Welcome to StayNest</h2>
            <p className="text-sm text-gray-600 mb-6">Log in or sign up</p>

            {/* Phone method (mock) */}
            {authMethod === 'phone' && (
              <form onSubmit={handleSubmit} className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Country/Region</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                    <option>India (+91)</option>
                    <option>United States (+1)</option>
                    <option>United Kingdom (+44)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Phone number</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Phone number" />
                </div>
                <div className="text-xs text-gray-600">We’ll call or text you to confirm your number. Standard message and data rates apply.</div>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">{loading ? 'Please wait...' : 'Continue'}</button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="px-3 text-xs text-gray-500">or</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            {/* Email auth form */}
            {authMethod === 'email' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400" />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute inset-y-0 right-2 px-2 text-gray-500">{showPwd ? 'Hide' : 'Show'}</button>
                  </div>
                </div>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">{loading ? 'Please wait...' : mode === 'login' ? 'Continue' : 'Create account'}</button>
              </form>
            )}

            {/* Social buttons (placeholders) */}
            <div className="space-y-3 mt-5">
              <button className="w-full border rounded-lg px-4 py-3 flex items-center justify-center gap-3"><span className="text-sm">Continue with Google</span></button>
              <button className="w-full border rounded-lg px-4 py-3 flex items-center justify-center gap-3"><span className="text-sm">Continue with Apple</span></button>
              <button className="w-full border rounded-lg px-4 py-3 flex items-center justify-center gap-3" onClick={() => setAuthMethod('email')}><span className="text-sm">Continue with email</span></button>
              <button className="w-full border rounded-lg px-4 py-3 flex items-center justify-center gap-3"><span className="text-sm">Continue with Facebook</span></button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button className="text-red-600 hover:underline" onClick={() => setMode('signup')}>Sign up</button>
                  {' '}·{' '}
                  <button className="text-gray-700 hover:underline" onClick={() => setAuthMethod(authMethod === 'email' ? 'phone' : 'email')}>
                    {authMethod === 'email' ? 'Use phone instead' : 'Use email instead'}
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button className="text-red-600 hover:underline" onClick={() => setMode('login')}>Log in</button>
                  {' '}·{' '}
                  <button className="text-gray-700 hover:underline" onClick={() => setAuthMethod(authMethod === 'email' ? 'phone' : 'email')}>
                    {authMethod === 'email' ? 'Use phone instead' : 'Use email instead'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


