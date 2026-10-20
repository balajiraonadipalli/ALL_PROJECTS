import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Trophy, IndianRupee, ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompareStore } from '../store/useCompareStore';
import { cn } from '../utils/cn';

import { toast } from 'sonner';

const CollegeCard = ({ college, index }) => {
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const minFee = college.courses?.length > 0 ? Math.min(...college.courses.map(c => c.fees)) : 0;
    const images = college.images?.length > 0 ? college.images : ['https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];

    const nextImage = (e) => {
        e.preventDefault();
        setCurrentImageIdx((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.05 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-200/60 transition-all hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] flex flex-col h-full"
        >
            <Link to={`/college/${college.slug}`} className="flex flex-col flex-1 relative outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 rounded-t-[24px]">
                <div className="relative h-56 overflow-hidden shrink-0 group/slider">
                    <AnimatePresence initial={false}>
                        <motion.img
                            key={currentImageIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            loading="lazy"
                            src={images[currentImageIdx]}
                            alt={college.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Image Navigation Controls */}
                    {images.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/50 z-20">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/50 z-20">
                                <ChevronRight size={18} />
                            </button>

                            {/* Pagination Dots */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
                                {images.map((_, idx) => (
                                    <div key={idx} className={cn("h-1.5 rounded-full transition-all duration-300", currentImageIdx === idx ? "w-4 bg-white" : "w-1.5 bg-white/50")} />
                                ))}
                            </div>
                        </>
                    )}

                    {college.ranking > 0 && (
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black tracking-widest text-slate-800 shadow-lg flex items-center gap-1.5 uppercase z-20">
                            <Trophy size={14} className="text-amber-500" /> Rank #{college.ranking}
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1 relative bg-white rounded-t-[24px] -mt-4 z-10">
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{college.name}</h3>

                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold mb-6">
                        <MapPin size={16} className="text-blue-500 shrink-0" /> <span className="truncate">{college.location}</span>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Starting Fees</p>
                                <p className="text-xl font-black text-slate-800 flex items-center tracking-tight">
                                    <IndianRupee size={20} className="text-blue-600 mr-0.5" />
                                    {minFee > 0 ? minFee.toLocaleString() : 'N/A'}
                                    <span className="text-sm font-semibold text-slate-400 ml-1">/yr</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Compare Toggle */}
            <div className="px-6 md:px-8 py-4 bg-slate-50 border-t border-slate-100">
                <CompareToggle college={college} />
            </div>
        </motion.div>
    );
};

const CompareToggle = ({ college }) => {
    const { compareList, addCollege, removeCollege } = useCompareStore();
    const isSelected = compareList.some(c => c._id === college._id);

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                if (isSelected) {
                    removeCollege(college._id);
                    toast.info(`Removed ${college.name} from comparison.`);
                } else {
                    if (compareList.length >= 3) {
                        toast.error('You can only compare up to 3 colleges at a time.');
                        return;
                    }
                    addCollege(college);
                    toast.success(`Added ${college.name} to comparison!`);
                }
            }}
            className="flex items-center gap-3 w-full group outline-none"
        >
            <div className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300",
                isSelected ? "bg-blue-600 border-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.2)]" : "bg-white border-slate-300 group-hover:border-blue-400"
            )}>
                <AnimatePresence>
                    {isSelected && (
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring" }}>
                            <Check size={12} className="text-white stroke-[3]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <span className={cn(
                "text-sm font-bold transition-colors duration-300",
                isSelected ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
            )}>
                {isSelected ? 'Added to Compare' : 'Add to Compare'}
            </span>
        </button>
    );
};

export default CollegeCard;
