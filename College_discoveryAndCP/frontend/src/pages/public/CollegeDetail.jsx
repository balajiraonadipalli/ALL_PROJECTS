import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCollegeBySlug } from '../../services/api';
import { Loader2, MapPin, Trophy, Navigation, BookOpen, IndianRupee, Briefcase, Info, ChevronRight, ChevronLeft, AlertCircle, Sparkles, Building2, UserCheck } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';

// Simple Counter Component
const Counter = ({ from = 0, to, duration = 2, suffix = '' }) => {
    const nodeRef = useRef(null);
    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;
        let start = null;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / (duration * 1000), 1);
            // Easing function for smooth deceleration
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * (to - from) + from);
            node.textContent = current + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }, [from, to, duration, suffix]);
    return <span ref={nodeRef}>{from}{suffix}</span>;
};

const CollegeDetail = () => {
    const { slug } = useParams();
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    const nextImage = () => {
        if (!college?.images?.length) return;
        setCurrentImageIdx((prev) => (prev + 1) % college.images.length);
    };

    const prevImage = () => {
        if (!college?.images?.length) return;
        setCurrentImageIdx((prev) => (prev - 1 + college.images.length) % college.images.length);
    };

    // Parallax setup
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchCollegeBySlug(slug);
                setCollege(data);
            } catch {
                // mock for demo
                setCollege({
                    name: 'Institute of Technology & Advanced Studies',
                    location: 'Silicon Valley, CA',
                    ranking: 1,
                    description: 'A global epicenter for technology innovation, blending state-of-the-art research facilities with world-class faculty. Empowering the next generation of pioneers to shape the future of artificial intelligence, sustainable energy, and computational sciences.',
                    images: [
                        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
                        'https://images.unsplash.com/photo-1590402241513-8ebd0fa24263?auto=format&fit=crop&w=1600&q=80',
                        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80'
                    ],
                    courses: [
                        { name: 'B.Tech in Computer Science', duration: '4 Years', fees: 250000, availableSeats: 120 },
                        { name: 'B.Tech in Artificial Intelligence', duration: '4 Years', fees: 300000, availableSeats: 60 },
                        { name: 'MBA in Tech Management', duration: '2 Years', fees: 450000, availableSeats: 40 }
                    ],
                    placement: { averagePackage: 18.5, highestPackage: 85, topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'SpaceX'] },
                    eligibility: 'Minimum 85% in PCM in 10+2 Grade. Valid SAT or institutional entrance score required.'
                });
            } finally {
                setLoading(false);
            }
        };
        load();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-6 text-slate-500 font-medium animate-pulse">Gathering institution data...</p>
            </div>
        );
    }

    if (!college) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Institution Not Found</h2>
                <p className="text-slate-500 text-lg max-w-md mx-auto">The college profile you are looking for has been moved or does not exist.</p>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Building2 size={18} /> },
        { id: 'courses', label: 'Programs & Fees', icon: <BookOpen size={18} /> },
        { id: 'placement', label: 'Placements', icon: <Briefcase size={18} /> },
    ];

    const DataNotAvailable = ({ message = "Information currently unavailable." }) => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50/50 rounded-3xl border border-slate-100/50">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4 rotate-3">
                <Info size={28} />
            </div>
            <p className="text-slate-500 font-medium text-lg text-center">{message}</p>
        </motion.div>
    );

    return (
        <div className="pb-32 bg-[#FDFDFE] relative">
            {/* Parallax Hero Section */}
            <div className="relative h-[550px] lg:h-[650px] overflow-hidden bg-slate-900 group">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 origin-top">
                    {college.images?.length > 0 ? (
                        <div className="absolute inset-0">
                            <AnimatePresence initial={false}>
                                <motion.img
                                    key={currentImageIdx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    src={college.images[currentImageIdx]}
                                    alt={college.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply z-10"></div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                    )}
                </motion.div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent pointer-events-none"></div>

                {/* Image Navigation Controls */}
                {college.images?.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 z-20 hover:scale-110">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextImage} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 z-20 hover:scale-110">
                            <ChevronRight size={24} />
                        </button>

                        <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-20 flex gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            {college.images.map((_, idx) => (
                                <button key={idx} onClick={() => setCurrentImageIdx(idx)} className={cn("h-2 rounded-full transition-all duration-300", currentImageIdx === idx ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80")} aria-label={`Go to slide ${idx + 1}`} />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-10 pb-16 lg:pb-24 z-10 pointer-events-none">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }} className="max-w-4xl pointer-events-auto">
                        {college.ranking > 0 && (
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-4 py-2 rounded-2xl text-sm mb-6 shadow-2xl">
                                <Trophy size={16} className="text-amber-400" />
                                Top Tier Institution — Ranked #{college.ranking}
                            </div>
                        )}
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">{college.name}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-slate-300 text-lg font-medium">
                            <span className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700/50">
                                <MapPin size={20} className="text-blue-400" /> {college.location}
                            </span>
                            {college.placement?.highestPackage && (
                                <span className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700/50 text-white">
                                    <Sparkles size={18} className="text-yellow-400" />
                                    <span className="font-bold"><Counter to={college.placement.highestPackage} suffix=" LPA" /></span> Highest Pkg
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Main Content Column */}
                    <div className="flex-1 min-w-0">
                        {/* Sticky Tabbed Navigation */}
                        <div className="sticky top-20 z-30 bg-[#FDFDFE]/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-2xl p-2 mb-10 flex overflow-x-auto hide-scrollbar">
                            {tabs.map(tab => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "relative flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-sm tracking-wide rounded-xl transition-colors whitespace-nowrap flex-1",
                                            isActive ? "text-blue-700" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div layoutId="detail-tab-indicator" className="absolute inset-0 bg-blue-50 border border-blue-100/50 rounded-xl -z-10 shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                                        )}
                                        {tab.icon} {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Contents */}
                        <div className="min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-10">
                                        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Building2 size={20} /></div>
                                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">About the Institution</h3>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed text-lg font-medium">{college.description || "No description provided."}</p>
                                        </section>

                                        {college.eligibility && (
                                            <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 md:p-10 border border-blue-100/50 relative overflow-hidden">
                                                <div className="absolute -right-6 -bottom-6 opacity-5"><UserCheck size={160} /></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20"><UserCheck size={20} /></div>
                                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Eligibility Criteria</h3>
                                                    </div>
                                                    <p className="text-slate-700 text-lg font-semibold leading-relaxed max-w-2xl">{college.eligibility}</p>
                                                </div>
                                            </section>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'courses' && (
                                    <motion.div key="courses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                                        <div className="flex items-center gap-3 mb-2 px-2">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><BookOpen size={20} /></div>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Programs Offered</h3>
                                        </div>

                                        {college.courses?.length > 0 ? (
                                            <div className="grid gap-4">
                                                {college.courses.map((course, idx) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                                                        key={idx}
                                                        className="group bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-blue-200 transition-all duration-300"
                                                    >
                                                        <div>
                                                            <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">{course.name}</h4>
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 font-bold text-sm rounded-lg">{course.duration}</span>
                                                                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 font-bold text-sm rounded-lg">
                                                                    {course.availableSeats ? `${course.availableSeats} Seats Available` : 'Seat Info N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-left md:text-right bg-slate-50 md:bg-transparent p-5 md:p-0 rounded-2xl border border-slate-100 md:border-transparent">
                                                            <p className="text-slate-400 text-[11px] uppercase tracking-widest font-black mb-1">Annual Tuition</p>
                                                            <p className="text-3xl font-black text-slate-900 flex items-center md:justify-end tracking-tighter">
                                                                <IndianRupee size={24} className="text-slate-400 mr-0.5" /> {course.fees.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <DataNotAvailable message="Course and fee structures are currently being updated." />
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'placement' && (
                                    <motion.div key="placement" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                        <div className="flex items-center gap-3 mb-8 px-2">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Briefcase size={20} /></div>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Career Outcomes</h3>
                                        </div>

                                        {!college.placement ? (
                                            <DataNotAvailable message="Placement reports for the recent batch are not yet published." />
                                        ) : (
                                            <div className="space-y-10">
                                                {/* Stat Cards */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 p-8 md:p-10 rounded-[32px] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                                                        <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                                                            <Trophy size={200} />
                                                        </div>
                                                        <div className="relative z-10 hidden md:block">
                                                            <p className="text-indigo-200 font-bold uppercase tracking-widest mb-3 text-sm">Highest Package</p>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-6xl lg:text-7xl font-black tracking-tighter">
                                                                    {college.placement?.highestPackage ? <Counter to={college.placement.highestPackage} /> : 'N/A'}
                                                                </span>
                                                                <span className="text-2xl font-bold text-indigo-200">LPA</span>
                                                            </div>
                                                        </div>
                                                        <div className="relative z-10 md:hidden">
                                                            <p className="text-indigo-200 font-bold uppercase tracking-widest mb-2 text-xs">Highest Package</p>
                                                            <p className="text-5xl font-black tracking-tighter">{college.placement?.highestPackage ? `${college.placement.highestPackage} LPA` : 'N/A'}</p>
                                                        </div>
                                                    </motion.div>

                                                    <div className="flex flex-col gap-6">
                                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white border text-center border-slate-200/60 p-8 rounded-[32px] shadow-sm flex-1 flex flex-col justify-center items-center relative overflow-hidden">
                                                            <p className="text-slate-400 font-black uppercase tracking-widest mb-2 text-xs w-full">Average Package</p>
                                                            <div className="flex items-baseline gap-2 text-slate-800">
                                                                <span className="text-4xl md:text-5xl font-black tracking-tighter">
                                                                    {college.placement?.averagePackage ? <Counter to={college.placement.averagePackage} /> : 'N/A'}
                                                                </span>
                                                                <span className="text-xl font-bold text-slate-400">LPA</span>
                                                            </div>

                                                            {/* Animated mini bar graph */}
                                                            {college.placement?.averagePackage && college.placement?.highestPackage && (
                                                                <div className="w-full mt-6 h-3 bg-slate-100 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${(college.placement.averagePackage / college.placement.highestPackage) * 100}%` }}
                                                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                                                        className="h-full bg-blue-500 rounded-full"
                                                                    />
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    </div>
                                                </div>

                                                {/* Top Recruiters */}
                                                {college.placement?.topRecruiters?.length > 0 && (
                                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                                                        <h4 className="font-black text-slate-800 mb-6 text-xl tracking-tight">Prominent Hiring Partners</h4>
                                                        <div className="flex flex-wrap gap-3 md:gap-4">
                                                            {college.placement.topRecruiters.map((recruiter, idx) => (
                                                                <span key={idx} className="bg-slate-50 text-slate-700 px-5 py-3 rounded-2xl font-bold border border-slate-200/60 transition-colors hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> {recruiter}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Info Column (Desktop) */}
                    <div className="hidden lg:block w-[340px] shrink-0">
                        <div className="sticky top-20 space-y-6">
                            <div className="bg-slate-900 p-8 rounded-[32px] text-center shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>

                                <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 mx-auto backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles size={28} />
                                </div>
                                <h3 className="font-black text-3xl mb-4 text-white tracking-tight">Fast-Track Your Journey</h3>
                                <p className="text-slate-400 mb-8 font-medium leading-relaxed">Connect with our expert counselors to navigate admissions, scholarships, and career matching instantly.</p>
                                <button className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(255,255,255,0.1)] active:scale-95 flex items-center justify-center gap-2">
                                    Request Callback <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Sticky Floating Apply Button (Mobile & Desktop) */}
            <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-500 text-white px-6 md:px-8 py-4 rounded-full font-black text-lg shadow-[0_8px_32px_rgba(37,99,235,0.4)] flex items-center gap-3 overflow-hidden group animate-[float-pulse_5s_infinite_ease-in-out]"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span>Begin Application</span>
                <Navigation size={20} className="fill-white/20 group-hover:rotate-12 group-hover:translate-x-1 transition-all" />
            </motion.button>
        </div>
    );
};

export default CollegeDetail;
