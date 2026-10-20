import React, { useState, useEffect } from 'react';
import { JOB_TYPES, EXPERIENCE_LEVELS, CATEGORIES, COMPANY_EMOJIS } from '../data/mockData';

const EMPTY_FORM = {
  title: '',
  company: '',
  companyEmoji: '🏢',
  location: '',
  jobType: 'Full-time',
  category: 'Engineering',
  experience: 'Mid Level',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  description: '',
  requirements: '',
  skillsInput: '',
  skills: [],
  applyLink: '',
  disclaimer: '',
  applicationDeadline: '',
  isFeatured: false,
  isRemote: false,
  isActive: true,
};

function CMSPage() {
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('cms_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'form'
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('cms_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && form.skillsInput.trim()) {
      e.preventDefault();
      const skill = form.skillsInput.trim().replace(/,$/, '');
      if (skill && !form.skills.includes(skill)) {
        setForm((prev) => ({ ...prev, skills: [...prev.skills, skill], skillsInput: '' }));
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const jobData = {
      _id: editingId || Date.now().toString(),
      title: form.title,
      company: form.company,
      companyEmoji: form.companyEmoji,
      location: form.location,
      jobType: form.jobType,
      category: form.category,
      experience: form.experience,
      salary: {
        min: Number(form.salaryMin) || 0,
        max: Number(form.salaryMax) || 0,
        currency: form.salaryCurrency,
      },
      description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      skills: form.skills,
      applyLink: form.applyLink,
      disclaimer: form.disclaimer,
      applicationDeadline: form.applicationDeadline,
      isFeatured: form.isFeatured,
      isRemote: form.isRemote,
      isActive: form.isActive,
      postedAt: editingId ? jobs.find((j) => j._id === editingId)?.postedAt || 'Just now' : 'Just now',
    };

    if (editingId) {
      setJobs((prev) => prev.map((j) => (j._id === editingId ? jobData : j)));
      showToast('Job updated successfully!');
    } else {
      setJobs((prev) => [jobData, ...prev]);
      showToast('Job posted successfully!');
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setActiveTab('list');
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title || '',
      company: job.company || '',
      companyEmoji: job.companyEmoji || '🏢',
      location: job.location || '',
      jobType: job.jobType || 'Full-time',
      category: job.category || 'Engineering',
      experience: job.experience || 'Mid Level',
      salaryMin: job.salary?.min || '',
      salaryMax: job.salary?.max || '',
      salaryCurrency: job.salary?.currency || 'USD',
      description: job.description || '',
      requirements: (job.requirements || []).join('\n'),
      skillsInput: '',
      skills: job.skills || [],
      applyLink: job.applyLink || '',
      disclaimer: job.disclaimer || '',
      applicationDeadline: job.applicationDeadline || '',
      isFeatured: job.isFeatured || false,
      isRemote: job.isRemote || false,
      isActive: job.isActive !== false,
    });
    setEditingId(job._id);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setJobs((prev) => prev.filter((j) => j._id !== id));
    setDeleteConfirm(null);
    showToast('Job deleted.', 'error');
  };

  const handleToggleActive = (id) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === id ? { ...j, isActive: !j.isActive } : j))
    );
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] font-inter">
      {/* ─── CMS Navbar ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 h-16 bg-dark-900/90 backdrop-blur-2xl border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-sm shadow-btn">
              💼
            </div>
            <span className="text-base font-extrabold text-white">
              Job<span className="text-brand-500">Hive</span>
            </span>
          </a>
          <div className="h-5 w-px bg-white/10 mx-1" />
          <span className="text-sm font-semibold text-[#8ca0c8]">Content Management</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            className="text-sm text-[#8ca0c8] px-3 py-1.5 rounded-lg border border-white/[0.08] hover:text-white hover:border-white/20 transition-all no-underline"
          >
            ← View Site
          </a>
          <button
            onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setActiveTab('form'); }}
            className="brand-gradient border-none text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer font-inter shadow-btn hover:-translate-y-0.5 transition-all"
          >
            + New Job
          </button>
        </div>
      </nav>

      {/* ─── Toast ───────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold transition-all
          ${toast.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}
        >
          <span>{toast.type === 'error' ? '❌' : '✅'}</span>
          {toast.message}
        </div>
      )}

      {/* ─── Delete Confirm Modal ─────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-dark-700 border border-white/[0.1] rounded-2xl p-7 max-w-sm w-full shadow-2xl">
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold text-white mb-2">Delete this job?</h3>
            <p className="text-sm text-[#8ca0c8] mb-6">
              This action cannot be undone. The job listing will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-transparent border border-white/10 text-[#8ca0c8] py-2.5 rounded-xl text-sm font-semibold cursor-pointer font-inter hover:border-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-semibold cursor-pointer font-inter hover:bg-red-500/20 transition-all"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* ─── Tab Switcher ─────────────────────────────────────── */}
        <div className="flex gap-2 mb-8 bg-dark-700 border border-white/[0.07] p-1 rounded-xl w-fit">
          {[
            { id: 'list', label: `📋 All Jobs (${jobs.length})` },
            { id: 'form', label: editingId ? '✏️ Edit Job' : '➕ Post New Job' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id === 'list') { setEditingId(null); setForm(EMPTY_FORM); } }}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer font-inter transition-all
                ${activeTab === tab.id
                  ? 'brand-gradient text-white shadow-btn'
                  : 'bg-transparent border-none text-[#8ca0c8] hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════
            JOB LIST TAB
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'list' && (
          <div>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Jobs', value: jobs.length, icon: '📋', color: 'text-brand-400' },
                { label: 'Active', value: jobs.filter((j) => j.isActive !== false).length, icon: '✅', color: 'text-emerald-400' },
                { label: 'Featured', value: jobs.filter((j) => j.isFeatured).length, icon: '⭐', color: 'text-amber-400' },
                { label: 'Remote', value: jobs.filter((j) => j.isRemote).length, icon: '🌐', color: 'text-purple-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-dark-700 border border-white/[0.07] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#4a5878] font-medium">{stat.label}</span>
                    <span>{stat.icon}</span>
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1 max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5878]">🔍</span>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-dark-700 border border-white/[0.07] text-white text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none placeholder-[#4a5878] focus:border-brand-500/50 transition-all font-inter"
                />
              </div>
              <span className="text-sm text-[#4a5878]">{filteredJobs.length} results</span>
            </div>

            {/* Table */}
            <div className="bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Job', 'Type', 'Category', 'Apply Link', 'Disclaimer', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#4a5878] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job, i) => (
                      <tr
                        key={job._id}
                        className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                      >
                        {/* Job Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{job.companyEmoji || '🏢'}</span>
                            <div>
                              <p className="font-semibold text-white text-[13px] leading-tight">{job.title}</p>
                              <p className="text-[#4a5878] text-xs mt-0.5">{job.company} · {job.location}</p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-4">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                            {job.jobType}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4 text-[#8ca0c8] text-xs">{job.category}</td>

                        {/* Apply Link */}
                        <td className="px-5 py-4">
                          {job.applyLink ? (
                            <a
                              href={job.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-400 text-xs hover:underline max-w-[160px] truncate block"
                              title={job.applyLink}
                            >
                              🔗 {job.applyLink.replace(/^https?:\/\//, '')}
                            </a>
                          ) : (
                            <span className="text-[#4a5878] text-xs">—</span>
                          )}
                        </td>

                        {/* Disclaimer */}
                        <td className="px-5 py-4">
                          {job.disclaimer ? (
                            <span className="text-amber-400 text-xs flex items-center gap-1" title={job.disclaimer}>
                              ⚠️ <span className="max-w-[100px] truncate block">{job.disclaimer}</span>
                            </span>
                          ) : (
                            <span className="text-[#4a5878] text-xs">—</span>
                          )}
                        </td>

                        {/* Status toggle */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleActive(job._id)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all font-inter
                              ${job.isActive !== false
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'}`}
                          >
                            {job.isActive !== false ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(job)}
                              className="p-2 rounded-lg border border-white/[0.08] text-[#8ca0c8] hover:border-brand-500/40 hover:text-brand-400 transition-all cursor-pointer bg-transparent text-sm"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(job._id)}
                              className="p-2 rounded-lg border border-white/[0.08] text-[#8ca0c8] hover:border-red-500/40 hover:text-red-400 transition-all cursor-pointer bg-transparent text-sm"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredJobs.length === 0 && (
                  <div className="text-center py-16 text-[#4a5878]">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-semibold text-[#8ca0c8]">No jobs found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            JOB FORM TAB
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* ── Left Column ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Basic Info Card */}
              <FormCard title="📝 Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Job Title *" required>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior React Developer" required className={inputCls} />
                  </FormField>
                  <FormField label="Company Name *" required>
                    <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Stripe" required className={inputCls} />
                  </FormField>
                </div>

                <FormField label="Company Icon / Emoji">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {COMPANY_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, companyEmoji: emoji }))}
                        className={`w-10 h-10 text-xl rounded-xl border transition-all cursor-pointer
                          ${form.companyEmoji === emoji
                            ? 'border-brand-500/60 bg-brand-500/10'
                            : 'border-white/[0.07] bg-dark-800 hover:border-brand-500/30'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="Location *" required>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. New York, NY or Remote" required className={inputCls} />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Job Type">
                    <select name="jobType" value={form.jobType} onChange={handleChange} className={selectCls}>
                      {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Category">
                    <select name="category" value={form.category} onChange={handleChange} className={selectCls}>
                      {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Experience">
                    <select name="experience" value={form.experience} onChange={handleChange} className={selectCls}>
                      {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </FormField>
                </div>
              </FormCard>

              {/* Salary */}
              <FormCard title="💰 Salary Range">
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Min Salary">
                    <input name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} placeholder="e.g. 80000" className={inputCls} />
                  </FormField>
                  <FormField label="Max Salary">
                    <input name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} placeholder="e.g. 120000" className={inputCls} />
                  </FormField>
                  <FormField label="Currency">
                    <select name="salaryCurrency" value={form.salaryCurrency} onChange={handleChange} className={selectCls}>
                      <option value="USD">USD / year</option>
                      <option value="USD/hr">USD / hour</option>
                      <option value="EUR">EUR / year</option>
                      <option value="GBP">GBP / year</option>
                      <option value="INR">INR / year</option>
                    </select>
                  </FormField>
                </div>
              </FormCard>

              {/* Description */}
              <FormCard title="📄 Job Details">
                <FormField label="Job Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe the role, responsibilities, and what makes it exciting..."
                    className={`${inputCls} resize-none`}
                  />
                </FormField>
                <FormField label="Requirements (one per line)">
                  <textarea
                    name="requirements"
                    value={form.requirements}
                    onChange={handleChange}
                    rows={4}
                    placeholder={"3+ years React experience\nStrong TypeScript skills\nExperience with REST APIs"}
                    className={`${inputCls} resize-none`}
                  />
                </FormField>

                <FormField label="Skills (press Enter or comma to add)">
                  <div className={`${inputCls} min-h-[46px] flex flex-wrap gap-2 items-center p-2`}>
                    {form.skills.map((skill) => (
                      <span key={skill} className="flex items-center gap-1 text-[11px] bg-brand-500/10 border border-brand-500/20 text-brand-400 px-2.5 py-1 rounded-full font-medium">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-brand-400/60 hover:text-red-400 ml-1 bg-transparent border-none cursor-pointer leading-none">×</button>
                      </span>
                    ))}
                    <input
                      name="skillsInput"
                      value={form.skillsInput}
                      onChange={handleChange}
                      onKeyDown={handleAddSkill}
                      placeholder={form.skills.length === 0 ? 'React, TypeScript...' : ''}
                      className="bg-transparent border-none outline-none text-white text-sm placeholder-[#4a5878] min-w-[120px] flex-1 font-inter"
                    />
                  </div>
                  <p className="text-[11px] text-[#4a5878] mt-1">Press Enter or comma (,) to add a skill tag</p>
                </FormField>
              </FormCard>

              {/* ── Apply Link + Disclaimer ── KEY SECTION ── */}
              <FormCard title="🔗 Application Settings" highlight>
                <FormField label="Company Career Page URL (Apply Link) *">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5878] text-sm">🔗</span>
                    <input
                      name="applyLink"
                      value={form.applyLink}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com/careers/job-id"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                  <p className="text-[11px] text-[#4a5878] mt-1.5">
                    Candidates will be redirected to this URL when they click "Apply Now →"
                  </p>
                </FormField>

                <FormField label="Disclaimer (shown as collapsible warning on the job card)">
                  <textarea
                    name="disclaimer"
                    value={form.disclaimer}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. This role requires a background check. No visa sponsorship available. Applicants must be legally authorized to work in the US..."
                    className={`${inputCls} resize-none`}
                  />
                  <p className="text-[11px] text-amber-400/60 mt-1.5 flex items-center gap-1">
                    ⚠️ Shown as a collapsible amber banner at the bottom of the job card. Leave blank to hide.
                  </p>
                </FormField>

                <FormField label="Application Deadline">
                  <input
                    name="applicationDeadline"
                    type="date"
                    value={form.applicationDeadline}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </FormField>
              </FormCard>
            </div>

            {/* ── Right Column ── */}
            <div className="flex flex-col gap-6">
              {/* Options */}
              <FormCard title="⚙️ Options">
                <div className="flex flex-col gap-4">
                  {[
                    { name: 'isFeatured', label: 'Featured Listing', desc: 'Show "Featured" badge on card', icon: '⭐' },
                    { name: 'isRemote', label: 'Remote Position', desc: 'Mark as a remote role', icon: '🌐' },
                    { name: 'isActive', label: 'Active / Visible', desc: 'Show on public job board', icon: '👁️' },
                  ].map((opt) => (
                    <label key={opt.name} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.07] cursor-pointer hover:border-brand-500/20 transition-all">
                      <div className="flex items-center gap-3">
                        <span>{opt.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{opt.label}</p>
                          <p className="text-[11px] text-[#4a5878]">{opt.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`w-10 h-6 rounded-full transition-all duration-300 relative cursor-pointer flex-shrink-0 ${form[opt.name] ? 'bg-brand-500' : 'bg-dark-500'}`}
                        onClick={() => setForm((p) => ({ ...p, [opt.name]: !p[opt.name] }))}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form[opt.name] ? 'left-5' : 'left-1'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </FormCard>

              {/* Preview Card */}
              <FormCard title="👁️ Preview">
                <div className="bg-dark-800 border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-2xl">{form.companyEmoji || '🏢'}</span>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{form.title || 'Job Title'}</p>
                      <p className="text-xs text-[#8ca0c8]">{form.company || 'Company'}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      📍 {form.location || 'Location'}
                    </span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      💼 {form.jobType}
                    </span>
                  </div>
                  {form.disclaimer && (
                    <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-start gap-1.5">
                      <span className="text-xs">⚠️</span>
                      <p className="text-[10px] text-amber-400/80 leading-relaxed line-clamp-2">{form.disclaimer}</p>
                    </div>
                  )}
                  {form.applyLink && (
                    <div className="mt-2 pt-2 border-t border-white/[0.05]">
                      <p className="text-[10px] text-brand-400 truncate">🔗 {form.applyLink}</p>
                    </div>
                  )}
                </div>
              </FormCard>

              {/* Submit */}
              <div className="flex flex-col gap-3 sticky top-24">
                <button
                  type="submit"
                  className="w-full brand-gradient border-none text-white py-3.5 rounded-xl text-sm font-bold cursor-pointer font-inter shadow-btn hover:-translate-y-0.5 transition-all"
                >
                  {editingId ? '💾 Update Job Listing' : '🚀 Publish Job Listing'}
                </button>
                <button
                  type="button"
                  onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setActiveTab('list'); }}
                  className="w-full bg-transparent border border-white/[0.08] text-[#8ca0c8] py-3 rounded-xl text-sm font-semibold cursor-pointer font-inter hover:border-white/20 hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────
const inputCls =
  'w-full bg-[#0d1529] border border-white/[0.08] text-white text-sm px-3.5 py-2.5 rounded-xl outline-none placeholder-[#4a5878] focus:border-brand-500/50 transition-all font-inter';

const selectCls =
  'w-full bg-[#0d1529] border border-white/[0.08] text-white text-sm px-3.5 py-2.5 rounded-xl outline-none cursor-pointer focus:border-brand-500/50 transition-all font-inter appearance-none';

function FormCard({ title, children, highlight }) {
  return (
    <div className={`bg-dark-700 border rounded-2xl p-6 flex flex-col gap-4 ${highlight ? 'border-brand-500/25 shadow-glow' : 'border-white/[0.07]'}`}>
      <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-3">{title}</h3>
      {children}
    </div>
  );
}

function FormField({ label, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#8ca0c8] tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

export default CMSPage;
