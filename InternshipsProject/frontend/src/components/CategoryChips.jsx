import React from 'react';
import { CATEGORIES } from '../data/mockData';

function CategoryChips({ activeCategory, onSelect }) {
  return (
    <section className="px-6 pb-8">
      <p className="text-center text-xs font-semibold text-[#4a5878] uppercase tracking-widest mb-4">
        Browse by Category
      </p>
      <div className="flex flex-wrap gap-2.5 justify-center">
        <button
          id="cat-all"
          onClick={() => onSelect('')}
          className={`flex items-center gap-1.5 border rounded-full px-4 py-2 text-[13px] font-medium cursor-pointer transition-all duration-200 font-inter
            ${activeCategory === ''
              ? 'bg-brand-500/10 border-brand-500/40 text-brand-400 -translate-y-0.5'
              : 'bg-dark-700 border-white/[0.08] text-[#8ca0c8] hover:bg-brand-500/8 hover:border-brand-500/30 hover:text-brand-400 hover:-translate-y-0.5'
            }`}
        >
          <span>🌐</span> All Jobs
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            id={`cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onSelect(cat.name)}
            className={`flex items-center gap-1.5 border rounded-full px-4 py-2 text-[13px] font-medium cursor-pointer transition-all duration-200 font-inter
              ${activeCategory === cat.name
                ? 'bg-brand-500/10 border-brand-500/40 text-brand-400 -translate-y-0.5'
                : 'bg-dark-700 border-white/[0.08] text-[#8ca0c8] hover:bg-brand-500/8 hover:border-brand-500/30 hover:text-brand-400 hover:-translate-y-0.5'
              }`}
          >
            <span>{cat.emoji}</span>
            {cat.name}
            <span className="text-[11px] opacity-50 ml-0.5">({cat.count})</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryChips;
