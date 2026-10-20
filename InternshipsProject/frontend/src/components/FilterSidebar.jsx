import React from 'react';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../data/mockData';

function FilterSidebar({ filters, onChange, onClear }) {
  const toggle = (key, value) => {
    const current = filters[key];
    onChange(key, current === value ? '' : value);
  };

  return (
    <aside className="sticky top-[88px] bg-dark-700 border border-white/[0.07] rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          🎛️ Filters
        </h2>
        <button
          onClick={onClear}
          className="bg-transparent border-none text-brand-500 text-sm font-medium cursor-pointer transition-opacity hover:opacity-75 font-inter"
        >
          Clear all
        </button>
      </div>

      {/* Job Type */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-[#4a5878] uppercase tracking-[0.8px] mb-3">
          Job Type
        </p>
        <div className="flex flex-col gap-1.5">
          {JOB_TYPES.map((type) => {
            const selected = filters.jobType === type;
            return (
              <div
                key={type}
                id={`filter-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => toggle('jobType', type)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 border
                  ${selected
                    ? 'bg-brand-500/10 border-brand-500/30'
                    : 'border-transparent hover:bg-brand-500/6 hover:border-brand-500/15'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all flex-shrink-0
                    ${selected ? 'bg-brand-500 border-brand-500' : 'border-[#4a5878]'}`}
                  >
                    {selected && <span className="text-white text-[11px]">✓</span>}
                  </div>
                  <span className={`text-sm font-[450] ${selected ? 'text-white' : 'text-[#8ca0c8]'}`}>
                    {type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-white/[0.06] my-5" />

      {/* Experience */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-[#4a5878] uppercase tracking-[0.8px] mb-3">
          Experience Level
        </p>
        <div className="flex flex-col gap-1.5">
          {EXPERIENCE_LEVELS.map((level) => {
            const selected = filters.experience === level;
            return (
              <div
                key={level}
                id={`filter-exp-${level.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => toggle('experience', level)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 border
                  ${selected
                    ? 'bg-brand-500/10 border-brand-500/30'
                    : 'border-transparent hover:bg-brand-500/6 hover:border-brand-500/15'
                  }`}
              >
                <div className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all flex-shrink-0
                  ${selected ? 'bg-brand-500 border-brand-500' : 'border-[#4a5878]'}`}
                >
                  {selected && <span className="text-white text-[11px]">✓</span>}
                </div>
                <span className={`text-sm font-[450] ${selected ? 'text-white' : 'text-[#8ca0c8]'}`}>
                  {level}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-white/[0.06] my-5" />

      {/* Salary Range */}
      <div>
        <p className="text-[11px] font-semibold text-[#4a5878] uppercase tracking-[0.8px] mb-3">
          Salary Range
        </p>
        <div className="flex justify-between text-[13px] text-[#8ca0c8] mb-3">
          <span>$0</span>
          <span className="text-brand-500 font-semibold">${filters.maxSalary?.toLocaleString() || '300,000'}+</span>
        </div>
        <input
          type="range"
          min="0"
          max="300000"
          step="5000"
          value={filters.maxSalary || 300000}
          onChange={(e) => onChange('maxSalary', Number(e.target.value))}
          className="w-full"
          id="salary-range-slider"
        />
      </div>

      <div className="h-px bg-white/[0.06] my-5" />

      {/* Remote Only */}
      <div
        onClick={() => onChange('remoteOnly', !filters.remoteOnly)}
        className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer border transition-all duration-200
          ${filters.remoteOnly ? 'bg-brand-500/10 border-brand-500/30' : 'border-white/[0.07] hover:border-brand-500/20'}`}
        id="filter-remote-toggle"
      >
        <div className="flex items-center gap-3">
          <span className="text-base">🌐</span>
          <span className={`text-sm font-medium ${filters.remoteOnly ? 'text-white' : 'text-[#8ca0c8]'}`}>
            Remote Only
          </span>
        </div>
        <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${filters.remoteOnly ? 'bg-brand-500' : 'bg-dark-500'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${filters.remoteOnly ? 'left-5' : 'left-1'}`} />
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
