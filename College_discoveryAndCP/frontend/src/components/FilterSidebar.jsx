import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const FilterSidebar = ({ onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Demo multi-select state
    const programs = ['B.Tech', 'MBA', 'B.Sc', 'M.Tech', 'MBBS'];
    const [selectedPrograms, setSelectedPrograms] = useState([]);

    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            onFilterChange({ search: searchTerm.trim(), sort, programs: selectedPrograms });
            setIsSearching(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [searchTerm, sort, selectedPrograms]);

    const toggleProgram = (prog) => {
        setSelectedPrograms(prev =>
            prev.includes(prog) ? prev.filter(p => p !== prog) : [...prev, prog]
        );
    };

    return (
        <div className="bg-white/80 p-6 md:p-8 rounded-[32px] shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-white backdrop-blur-2xl h-fit sticky top-28 transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <SlidersHorizontal size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Filters</h2>
            </div>

            <div className="space-y-8">
                {/* Search */}
                <div>
                    <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest">Search Directory</label>
                    <div className="relative group">
                        <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", isSearching ? "text-blue-500" : "text-slate-400 group-focus-within:text-blue-500")} size={18} />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
                            placeholder="Find colleges..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <AnimatePresence>
                            {isSearching && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-blue-100/30 to-transparent -z-10 animate-[shimmer_1.5s_infinite]" style={{ backgroundSize: '200% 100%' }} />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sort */}
                <div>
                    <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest">Sort By</label>
                    <div className="relative group">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer font-semibold text-slate-800 hover:border-slate-300"
                        >
                            <option value="">Default (Relevant)</option>
                            <option value="ranking">Ranking (Highest to Lowest)</option>
                            <option value="fees_low">Fees: Low to High</option>
                            <option value="fees_high">Fees: High to Low</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180" size={18} />
                    </div>
                </div>

                {/* Multi-Select Programs */}
                <div>
                    <label className="block text-[11px] font-black text-slate-400 mb-4 uppercase tracking-widest">Programs (Demo)</label>
                    <div className="space-y-3">
                        {programs.map(prog => {
                            const isSelected = selectedPrograms.includes(prog);
                            return (
                                <button key={prog} type="button" onClick={() => toggleProgram(prog)} className="flex items-center gap-3 w-full text-left group outline-none">
                                    <div className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300", isSelected ? "bg-blue-600 border-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.2)] scale-110" : "bg-slate-50 border-slate-200 group-hover:border-blue-400")}>
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                                                    <Check size={14} className="text-white stroke-[3]" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <span className={cn("font-medium transition-colors duration-300", isSelected ? "text-slate-900 font-bold" : "text-slate-600 group-hover:text-slate-900")}>{prog}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FilterSidebar;
