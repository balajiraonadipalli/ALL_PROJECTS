import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AuthModal from './AuthModal.jsx';

export default function Layout({ children }) {
  const location = useLocation();
  const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [isAuthed, setIsAuthed] = useState(Boolean(initialToken));
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine which navigation item should be active
  const isHome = location.pathname === '/';
  const isExperiences = location.pathname.startsWith('/experiences') || location.pathname.startsWith('/experience');
  const isServices = location.pathname.startsWith('/services');

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center group transition-all duration-300 hover:scale-105">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-2 transition-all duration-300 group-hover:bg-red-600 group-hover:shadow-lg">
              <span className="text-white font-bold text-lg transition-transform duration-300 group-hover:scale-110">A</span>
            </div>
            <span className="text-red-500 font-semibold text-xl transition-colors duration-300 group-hover:text-red-600">airbnb</span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className={`flex items-center gap-2 font-medium pb-1 group transition-all duration-300 hover:scale-105 nav-underline ${isHome ? 'text-gray-900 active' : 'text-gray-600 hover:text-gray-900'}`}>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="transition-colors duration-300 group-hover:text-gray-700">Homes</span>
            </a>
            <a href="/experiences" className={`flex items-center gap-2 group transition-all duration-300 hover:scale-105 relative pb-1 nav-underline ${isExperiences ? 'text-gray-900 active' : 'text-gray-600 hover:text-gray-900'}`}>
              <svg className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 7.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="relative transition-colors duration-300 group-hover:text-gray-800">
                Experiences
                <span className="absolute -top-2 -right-6 bg-red-500 text-white text-xs px-1 rounded transition-all duration-300 group-hover:bg-red-600 group-hover:scale-110 animate-bounce">NEW</span>
              </span>
            </a>
            <a href="/services" className={`flex items-center gap-2 group transition-all duration-300 hover:scale-105 relative pb-1 nav-underline ${isServices ? 'text-gray-900 active' : 'text-gray-600 hover:text-gray-900'}`}>
              <svg className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V7l-7-5z" />
              </svg>
              <span className="relative transition-colors duration-300 group-hover:text-gray-800">
                Services
                <span className="absolute -top-2 -right-6 bg-red-500 text-white text-xs px-1 rounded transition-all duration-300 group-hover:bg-red-600 group-hover:scale-110 animate-bounce">NEW</span>
              </span>
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <a href="/host" className="hidden md:block text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105">
              Become a host
            </a>
            
            {/* Globe icon */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md group">
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </button>

            {/* User menu */}
            <div className="relative flex items-center gap-2 border border-gray-300 rounded-full p-1 hover:shadow-md transition-all duration-300 hover:scale-105 group">
              <button className="p-2 transition-all duration-300 hover:bg-gray-100 rounded-full" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gray-600 group-hover:scale-110">
                {isAuthed ? (
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm transition-transform duration-300 group-hover:scale-110">U</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm transition-transform duration-300 group-hover:scale-110">?</span>
                  </div>
                )}
              </div>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border p-2 z-20 animate-fadeIn">
                  {isAuthed ? (
                    <div className="py-1">
                      <a href="/profile" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition-all duration-200 hover:scale-105">Profile</a>
                      <a href="/trips" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition-all duration-200 hover:scale-105">Trips</a>
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition-all duration-200 hover:scale-105">Logout</button>
                    </div>
                  ) : (
                    <div className="py-1">
                      <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition-all duration-200 hover:scale-105" href="#">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border transition-transform duration-200 hover:scale-110"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-6.219-8.56"/></svg></span>
                        Help Centre
                      </a>
                      <div className="my-2 border-t" />
                      <div className="px-3 py-3 transition-all duration-200 hover:scale-105">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">Become a host</div>
                            <div className="text-xs text-gray-600">It's easy to start hosting and earn extra income.</div>
                          </div>
                          <div className="text-2xl transition-transform duration-200 hover:scale-110">🧑‍💼</div>
                        </div>
                      </div>
                      <div className="my-2 border-t" />
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition-all duration-200 hover:scale-105">Refer a host</button>
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition-all duration-200 hover:scale-105">Find a co-host</button>
                      <div className="my-2 border-t" />
                      <button onClick={() => { setAuthMode('login'); setAuthOpen(true); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition-all duration-200 hover:scale-105">Log in or sign up</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <AuthModal
        open={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onAuthed={() => setIsAuthed(true)}
      />
      <footer className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">AirCover</a></li>
                <li><a href="#" className="hover:underline">Safety information</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Hosting</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Airbnb your home</a></li>
                <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
                <li><a href="#" className="hover:underline">Hosting resources</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Airbnb</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Newsroom</a></li>
                <li><a href="#" className="hover:underline">New features</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Terms</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Privacy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:underline">Sitemap</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <span>© {new Date().getFullYear()} Airbnb, Inc.</span>
              <span>·</span>
              <a href="#" className="hover:underline">Privacy</a>
              <span>·</span>
              <a href="#" className="hover:underline">Terms</a>
              <span>·</span>
              <a href="#" className="hover:underline">Sitemap</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                English (IN)
              </span>
              <span>₹ INR</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


