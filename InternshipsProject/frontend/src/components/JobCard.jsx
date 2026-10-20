import React, { useState } from 'react';

const TYPE_COLORS = {
  'Full-time':  'bg-brand-500/10 text-brand-400 border-brand-500/20',
  'Remote':     'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Internship': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Contract':   'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Part-time':  'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Freelance':  'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const EXP_COLORS = {
  'Entry Level':  'bg-green-500/10 text-green-400 border-green-500/20',
  'Mid Level':    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Senior Level': 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  'Director':     'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Executive':    'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

function formatSalary(salary) {
  if (!salary) return null;
  const { min, max, currency } = salary;
  if (currency === 'USD/hr') return `$${min}–$${max}/hr`;
  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}/yr`;
}

function JobCard({ job, style }) {
  const [saved, setSaved] = useState(false);
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  const salary = formatSalary(job.salary);
  const hasDisclaimer = job.disclaimer && job.disclaimer.trim().length > 0;
  const hasApplyLink = job.applyLink && job.applyLink.trim().length > 0;

  const handleApply = (e) => {
    e.stopPropagation();
    if (hasApplyLink) {
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`relative bg-dark-700 border rounded-2xl overflow-hidden group transition-all duration-250 animate-fade-up
        ${job.isFeatured ? 'border-brand-500/25' : 'border-white/[0.07]'}
        hover:border-brand-500/35 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(79,142,247,0.12)]`}
      style={style}
      id={`job-card-${job._id}`}
    >
      {/* Hover shine overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(79,142,247,0.04),rgba(139,92,246,0.04))] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="p-6">
        {/* Featured badge */}
        {job.isFeatured && (
          <span className="absolute top-4 right-4 brand-gradient text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide z-10">
            Featured
          </span>
        )}

        {/* Card Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-[52px] h-[52px] rounded-xl bg-dark-800 border border-white/[0.07] flex items-center justify-center text-2xl flex-shrink-0">
            {job.companyEmoji || '🏢'}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white leading-tight mb-1 group-hover:text-brand-400 transition-colors duration-200 truncate pr-20">
              {job.title}
            </h3>
            <p className="text-[13px] text-[#8ca0c8] font-medium">{job.company}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3.5">
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            📍 {job.location}
          </span>
          <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full border ${TYPE_COLORS[job.jobType] || 'bg-brand-500/10 text-brand-400 border-brand-500/20'}`}>
            💼 {job.jobType}
          </span>
          <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full border ${EXP_COLORS[job.experience] || 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
            ⚡ {job.experience}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(job.skills || []).slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-[#4a5878] group-hover:border-brand-500/20 group-hover:text-[#8ca0c8] transition-all duration-200"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] gap-2">
          <div>
            {salary && <p className="text-[15px] font-bold text-emerald-400">{salary}</p>}
            <p className="text-xs text-[#4a5878] mt-0.5">Posted {job.postedAt}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Save button */}
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
              id={`save-btn-${job._id}`}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200 text-[15px]
                ${saved
                  ? 'border-red-500/40 text-red-400 bg-red-500/[0.08]'
                  : 'border-white/[0.08] text-[#4a5878] bg-transparent hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/[0.08]'
                }`}
            >
              {saved ? '❤️' : '🤍'}
            </button>

            {/* Apply button → opens applyLink */}
            <button
              id={`apply-btn-${job._id}`}
              onClick={handleApply}
              disabled={!hasApplyLink}
              className={`brand-gradient border-none text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer font-inter transition-all duration-200 hover:-translate-y-0.5 shadow-btn hover:shadow-btn-hover
                ${!hasApplyLink ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Apply Now →
            </button>
          </div>
        </div>
      </div>

      {/* ─── Disclaimer Banner ─────────────────────────────────────── */}
      {hasDisclaimer && (
        <div className="border-t border-amber-500/20 bg-amber-500/[0.05]">
          <button
            onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
            className="w-full flex items-center justify-between px-5 py-2.5 cursor-pointer bg-transparent border-none text-left group/disc"
            id={`disclaimer-toggle-${job._id}`}
          >
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <span>⚠️</span>
              <span>Disclaimer</span>
            </div>
            <span className={`text-amber-400/60 text-xs transition-transform duration-200 ${disclaimerExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {disclaimerExpanded && (
            <div className="px-5 pb-4">
              <p className="text-xs text-amber-300/80 leading-relaxed">{job.disclaimer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobCard;
