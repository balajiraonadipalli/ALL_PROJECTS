import React, { useState, useEffect } from 'react';
import FilterSidebar from '../../components/FilterSidebar';
import CollegeCard from '../../components/CollegeCard';
import { fetchColleges } from '../../services/api';
import { Search, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

import { toast } from 'sonner';

const Discovery = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', sort: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadColleges = async () => {
            setLoading(true);
            try {
                const data = await fetchColleges({ ...filters, page });
                setColleges(data.colleges || []);
                setTotalPages(data.pages || 1);
            } catch (error) {
                console.error('Failed to fetch colleges:', error);
                toast.error('Failed to connect to the server. Loading demo data instead.');
                // Demo MOCK DATA if API isn't running
                setColleges([
                    {
                        _id: '1', slug: 'demo-college-1', name: 'Demo Tech Institute', location: 'San Francisco, CA', ranking: 3,
                        images: ['https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&w=800&q=80'], courses: [{ fees: 200000 }]
                    },
                    {
                        _id: '2', slug: 'demo-college-2', name: 'Global Business School', location: 'New York, NY', ranking: 5,
                        images: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&w=800&q=80'], courses: [{ fees: 350000 }]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        loadColleges();
    }, [filters, page]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="w-full lg:w-[340px] shrink-0">
                <FilterSidebar onFilterChange={handleFilterChange} />
            </aside>

            <div className="flex-1 min-w-0">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Compass size={20} />
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">Explore</h1>
                        </motion.div>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-slate-500 font-medium max-w-xl">
                            Discover world-class institutions tailored to accelerate your career trajectory.
                        </motion.p>
                    </div>
                </div>

                <LayoutGroup>
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                            >
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col h-[400px]">
                                        <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                                        </div>
                                        <div className="w-3/4 h-6 bg-slate-100 rounded-lg mb-3" />
                                        <div className="w-1/2 h-4 bg-slate-100 rounded-md mb-auto" />
                                        <div className="w-1/3 h-5 bg-slate-100 rounded-md mt-6" />
                                    </div>
                                ))}
                            </motion.div>
                        ) : colleges.length > 0 ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                            >
                                {colleges.map((college, index) => (
                                    <CollegeCard key={college._id || index} college={college} index={index} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-[32px] p-16 text-center border border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center min-h-[400px]"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 scale-150" />
                                    <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-blue-50 text-blue-500 rounded-[28px] flex items-center justify-center shadow-xl shadow-blue-500/10 relative z-10 rotate-12 transition-transform hover:rotate-0 duration-500">
                                        <Search size={40} className="stroke-[2.5]" />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">No Matches Found</h3>
                                <p className="text-slate-500 text-lg font-medium max-w-md">We couldn't find any institutions matching your exact criteria. Try broadening your search filters.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </LayoutGroup>

                {/* Pagination */}
                {totalPages > 1 && !loading && colleges.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center mt-16 gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all group"
                        >
                            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="px-8 flex items-center justify-center py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <span className="font-bold text-slate-800 tracking-wide text-sm">
                                Page <span className="text-blue-600">{page}</span> of {totalPages}
                            </span>
                        </div>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all group"
                        >
                            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}
            </div>

        </div>
    );
};

export default Discovery;
