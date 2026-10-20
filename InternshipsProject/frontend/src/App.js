import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryChips from './components/CategoryChips';
import FilterSidebar from './components/FilterSidebar';
import JobCard from './components/JobCard';
import CMSPage from './pages/CMSPage';


const DEFAULT_FILTERS = {
  jobType: '',
  experience: '',
  maxSalary: 300000,
  remoteOnly: false,
};

// Simple hash-based router — no dependency needed
function useRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  window.addEventListener('hashchange', () => setRoute(window.location.hash));
  return route;
}

function App() {
  const route = useRoute();

  // Render CMS if hash is #/cms
  if (route === '#/cms') {
    return <CMSPage />;
  }

  return <HomePage />;
}

function HomePage() {
  const [searchParams, setSearchParams] = useState({ keyword: '', location: '' });
  const [activeCategory, setActiveCategory] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(6);

  // Load jobs published via CMS (stored in localStorage)
  const allJobs = useMemo(() => {
    try {
      const saved = localStorage.getItem('cms_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setVisibleCount(6);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActiveCategory('');
    setSearchParams({ keyword: '', location: '' });
    setVisibleCount(6);
  };

  const filteredJobs = useMemo(() => {
    let jobs = allJobs.filter((j) => j.isActive !== false);

    if (searchParams.keyword) {
      const kw = searchParams.keyword.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(kw) ||
          j.company?.toLowerCase().includes(kw) ||
          (j.skills || []).some((s) => s.toLowerCase().includes(kw))
      );
    }
    if (searchParams.location) {
      const loc = searchParams.location.toLowerCase();
      jobs = jobs.filter((j) => j.location?.toLowerCase().includes(loc));
    }
    if (activeCategory) jobs = jobs.filter((j) => j.category === activeCategory);
    if (filters.jobType) jobs = jobs.filter((j) => j.jobType === filters.jobType);
    if (filters.experience) jobs = jobs.filter((j) => j.experience === filters.experience);
    if (filters.remoteOnly) jobs = jobs.filter((j) => j.isRemote);
    if (filters.maxSalary < 300000)
      jobs = jobs.filter((j) => j.salary && j.salary.max <= filters.maxSalary);

    if (sortBy === 'salary')
      jobs.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
    else if (sortBy === 'featured')
      jobs.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

    return jobs;
  }, [allJobs, searchParams, activeCategory, filters, sortBy]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#0a0f1e] font-inter">
      <Navbar />

      <Hero onSearch={(params) => { setSearchParams(params); setVisibleCount(6); }} />

      <CategoryChips
        activeCategory={activeCategory}
        onSelect={(cat) => { setActiveCategory(cat); setVisibleCount(6); }}
      />

      {/* CTA Banner */}
      <div className="max-w-[1280px] mx-auto px-6 mb-8">
        <div
          className="relative rounded-[28px] px-10 py-12 flex items-center justify-between gap-6 flex-wrap overflow-hidden border border-brand-500/20"
          style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.12), rgba(139,92,246,0.08))' }}
        >
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(79,142,247,0.12), transparent 70%)' }}
          />
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              Are you <span className="gradient-text">Hiring?</span>
            </h2>
            <p className="text-[#8ca0c8] text-base">
              Post your job to reach 2M+ active candidates. Get 10x more applications.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="#/cms"
              className="brand-gradient border-none text-white px-7 py-3.5 rounded-xl text-[15px] font-bold cursor-pointer font-inter no-underline inline-flex items-center shadow-btn hover:-translate-y-0.5 transition-all"
            >
              Post a Job — Free
            </a>
            <button className="bg-transparent border border-white/20 text-white px-7 py-3.5 rounded-xl text-[15px] font-semibold cursor-pointer font-inter hover:border-white/50 hover:bg-white/5 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-7 items-start">
        <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />

        <section>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <p className="text-[15px] text-[#8ca0c8]">
              Showing <strong className="text-white font-bold text-[17px]">{filteredJobs.length}</strong> jobs
              {activeCategory && <span> in <strong className="text-brand-400">{activeCategory}</strong></span>}
            </p>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-700 border border-white/[0.07] text-[#8ca0c8] px-3.5 py-2 rounded-xl font-inter text-[13px] outline-none cursor-pointer hover:border-white/20 transition-all"
            >
              <option value="newest">⏰ Newest First</option>
              <option value="salary">💰 Highest Salary</option>
              <option value="featured">⭐ Featured First</option>
            </select>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 text-[#4a5878]">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-bold text-[#8ca0c8] mb-2">No jobs found</p>
              <p className="text-[15px]">Try adjusting your filters or search terms</p>
              <button
                onClick={handleClearFilters}
                className="mt-6 brand-gradient border-none text-white px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer font-inter"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {visibleJobs.map((job, i) => (
                <JobCard key={job._id} job={job} style={{ animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>
          )}

          {visibleCount < filteredJobs.length && (
            <div className="flex justify-center mt-9">
              <button
                id="load-more-btn"
                onClick={() => setVisibleCount((c) => c + 6)}
                className="bg-dark-700 border border-white/[0.07] text-[#8ca0c8] px-9 py-3 rounded-2xl text-sm font-semibold cursor-pointer font-inter flex items-center gap-2 hover:border-brand-500/35 hover:text-brand-400 hover:bg-brand-500/6 hover:-translate-y-0.5 transition-all"
              >
                ↓ Load more ({filteredJobs.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-8 px-6 text-center text-[#4a5878] text-sm">
        © 2024 <span className="text-brand-500 font-semibold">JobHive</span>. Built with ❤️ using React, Node.js & MongoDB.
        {' · '}
        <a href="#/cms" className="text-brand-500 hover:underline">Admin CMS</a>
      </footer>
    </div>
  );
}

export default App;
