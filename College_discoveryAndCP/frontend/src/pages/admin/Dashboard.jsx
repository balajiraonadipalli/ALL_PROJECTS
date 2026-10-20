import React, { useEffect, useState } from 'react';
import { fetchColleges } from '../../services/api';
import { Loader2, Edit, GraduationCap, CheckCircle, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
    const [draftColleges, setDraftColleges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const publishedData = await fetchColleges({ status: 'Published', limit: 1 });
                const draftsData = await fetchColleges({ status: 'Draft', limit: 50 });

                setStats({
                    total: publishedData.total + draftsData.total,
                    published: publishedData.total,
                    drafts: draftsData.total
                });
                setDraftColleges(draftsData.colleges || []);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

    if (loading) {
        return <div className="flex h-[calc(100vh-100px)] items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-12">
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-4 rounded-2xl backdrop-blur-xl border border-white shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Platform Overview</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Manage your college directory and review pending drafts.</p>
                </div>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Colleges", value: stats.total, icon: <GraduationCap size={24} />, bg: "bg-blue-500", color: "text-blue-500" },
                    { label: "Published Data", value: stats.published, icon: <TrendingUp size={24} />, bg: "bg-emerald-500", color: "text-emerald-500" },
                    { label: "Pending Drafts", value: stats.drafts, icon: <BookOpen size={24} />, bg: "bg-amber-500", color: "text-amber-500" }
                ].map((stat, idx) => (
                    <motion.div key={idx} variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-200/60 flex items-center gap-5 transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/0 to-${stat.bg.split('-')[1]}-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full`} />
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${stat.bg.split('-')[1]}-500/30 ${stat.bg}`}>
                            {stat.icon}
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-extrabold text-slate-800">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-200/60 overflow-hidden">
                <div className="p-6 md:px-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Action Required: Drafts</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Click on a draft to complete its details and publish to the live site.</p>
                    </div>
                    <Link to="/admin/colleges" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm text-sm active:scale-95 whitespace-nowrap">
                        + Form New College
                    </Link>
                </div>

                <div className="p-6 md:p-8">
                    {draftColleges.length > 0 ? (
                        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {draftColleges.map((college) => (
                                <motion.div key={college._id} variants={itemVariants} whileHover={{ y: -4 }}>
                                    <Link to={`/admin/colleges/edit/${college.slug}`} className="group block h-full">
                                        <div className="border border-slate-200 rounded-3xl p-6 hover:border-blue-400/50 hover:shadow-[0_8px_24px_rgba(59,130,246,0.1)] transition-all h-full flex flex-col relative overflow-hidden bg-white">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-[40px] -z-0 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="absolute top-5 right-5 bg-amber-100/80 backdrop-blur-md text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 border border-amber-200/50">Draft</span>

                                            <h3 className="font-extrabold text-slate-800 text-xl mb-1.5 pr-20 group-hover:text-blue-600 transition-colors relative z-10 leading-tight">{college.name}</h3>
                                            <p className="text-slate-500 text-sm mb-6 font-medium flex items-center gap-1.5 relative z-10 line-clamp-1">
                                                {college.location || 'Location Not Set'}
                                            </p>

                                            <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                        <Users size={14} className="text-slate-400" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        {college.courses?.length || 0} Courses
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                                                    Edit <Edit size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div variants={itemVariants} className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200/60 border-dashed">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-5 rotate-12 group-hover:rotate-0 transition-transform">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800 mb-2">Inbox Zero!</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto">There are no pending draft colleges needing your attention right now.</p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
