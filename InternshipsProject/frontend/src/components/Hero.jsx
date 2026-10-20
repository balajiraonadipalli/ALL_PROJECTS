import React, { useState } from 'react';

function Hero({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ keyword, location });
  };

  return (
    <section className="relative px-6 pt-20 pb-16 text-center overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(79,142,247,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/25 rounded-full px-4 py-1.5 text-sm font-medium text-brand-400 mb-7 animate-[fadeUp_0.6s_ease_forwards]">
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-[pulseDot_2s_ease-in-out_infinite]" />
        🔥 Over 12,000+ jobs available now
      </div>

      {/* Headline */}
      <h1 className="text-[clamp(38px,6vw,68px)] font-black tracking-[-2px] leading-[1.08] mb-5 animate-[fadeUp_0.7s_ease_0.1s_both]">
        Find Your{' '}
        <span className="gradient-text">Dream Job</span>
        <br />
        Without the Hustle
      </h1>

      <p className="text-lg text-[#8ca0c8] max-w-xl mx-auto mb-10 leading-relaxed animate-[fadeUp_0.7s_ease_0.2s_both]">
        Discover curated opportunities from the world's top companies.
        Apply smarter, land faster.
      </p>

      {/* Search Bar */}
      <form
        id="main-search-form"
        onSubmit={handleSearch}
        className="flex items-center gap-0 max-w-2xl mx-auto mb-6 bg-dark-700 border border-white/[0.08] rounded-[28px] px-5 py-2 shadow-card animate-[fadeUp_0.7s_ease_0.3s_both] focus-within:border-brand-500/50 focus-within:shadow-[0_0_0_3px_rgba(79,142,247,0.1)] transition-all duration-300"
      >
        <span className="text-[#4a5878] text-lg flex-shrink-0">🔍</span>

        <input
          id="keyword-input"
          type="text"
          placeholder="Job title, skill, or company..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder-[#4a5878] px-3 py-1 font-inter"
        />

        <div className="w-px h-7 bg-white/[0.08] mx-3 flex-shrink-0" />

        <span className="text-[#4a5878] text-base flex-shrink-0">📍</span>
        <input
          id="location-input"
          type="text"
          placeholder="City or Remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-transparent border-none outline-none text-white text-sm placeholder-[#4a5878] px-2 py-1 w-40 font-inter"
        />

        <button
          type="submit"
          id="search-submit-btn"
          className="brand-gradient border-none text-white px-6 py-3 rounded-[18px] text-[15px] font-semibold cursor-pointer font-inter transition-all duration-200 hover:-translate-y-0.5 shadow-btn hover:shadow-btn-hover whitespace-nowrap ml-1"
        >
          Search Jobs
        </button>
      </form>

      {/* Stats */}
      <div className="flex items-center justify-center gap-8 flex-wrap animate-[fadeUp_0.7s_ease_0.4s_both]">
        {[
          { icon: '🏢', value: '8,400+', label: 'Companies' },
          { icon: '💼', value: '12,500+', label: 'Active Jobs' },
          { icon: '✅', value: '3.2M+', label: 'Hired' },
          { icon: '⭐', value: '4.9/5', label: 'Rating' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[#8ca0c8] text-sm">
            <span>{s.icon}</span>
            <span>
              <strong className="text-white font-bold">{s.value}</strong> {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Hero;
