import React from 'react';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 h-[68px] bg-dark-900/85 backdrop-blur-2xl border-b border-white/[0.07]">
      {/* Brand */}
      <a href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-lg shadow-[0_0_20px_rgba(79,142,247,0.4)]">
          💼
        </div>
        <span className="text-xl font-extrabold tracking-tight text-white">
          Job<span className="text-brand-500">Hive</span>
        </span>
      </a>

      {/* Nav Links */}
      <ul className="hidden md:flex items-center gap-1 list-none">
        {['Browse Jobs', 'Companies', 'Salaries', 'Blog'].map((link) => (
          <li key={link}>
            <a
              href="/"
              className="text-sm font-medium text-[#8ca0c8] px-3.5 py-2 rounded-lg transition-all duration-200 hover:text-white hover:bg-brand-500/10 no-underline"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <button
          id="login-btn"
          className="bg-transparent border border-white/[0.1] text-[#8ca0c8] px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:border-brand-500 hover:text-brand-500 hover:bg-brand-500/8 font-inter"
        >
          Log In
        </button>
        <a
          id="post-job-btn"
          href="#/cms"
          className="brand-gradient border-none text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-btn font-inter no-underline inline-flex items-center"
        >
          Post a Job
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
