import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompareStore } from '../store/useCompareStore';
import { X, ArrowRightLeft, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const StickyCompareBar = () => {
    const { compareList, removeCollege, clearCompare } = useCompareStore();
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {compareList.length > 0 && (
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none"
                >
                    <div className="max-w-5xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.12)] p-4 md:px-6 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
                        <div className="flex items-center gap-4 flex-1 w-full overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                            <div className="flex items-center gap-2 text-slate-400 shrink-0 font-bold bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                                <Layers size={16} /> Compare ({compareList.length}/3)
                            </div>

                            <AnimatePresence>
                                {compareList.map(college => (
                                    <motion.div
                                        key={college._id}
                                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shrink-0 border border-slate-200 shadow-sm"
                                    >
                                        <img src={college.images?.[0] || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=40&h=40&q=80'} className="w-6 h-6 rounded-md object-cover" alt="" />
                                        <span className="text-sm font-bold text-slate-800 max-w-[120px] truncate">{college.name}</span>
                                        <button onClick={() => {
                                            removeCollege(college._id);
                                            toast.info(`Removed ${college.name} from comparison.`);
                                        }} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-0.5 rounded-md transition-all">
                                            <X size={14} className="stroke-[3]" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {compareList.length < 3 && (
                                <motion.div layout className="px-5 py-2 border-2 border-dashed border-slate-700/50 rounded-xl text-slate-500 font-medium text-sm shrink-0">
                                    Add up to {3 - compareList.length} more
                                </motion.div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto">
                            <button onClick={() => {
                                clearCompare();
                                toast.info('Cleared comparison list.');
                            }} className="px-2 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                                Clear
                            </button>
                            <button
                                onClick={() => navigate('/compare')}
                                disabled={compareList.length < 2}
                                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95"
                            >
                                <ArrowRightLeft size={16} className="stroke-[2.5]" /> Compare Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyCompareBar;
