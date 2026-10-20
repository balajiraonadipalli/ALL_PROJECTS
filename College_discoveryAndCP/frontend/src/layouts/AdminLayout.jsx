import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Settings, ArrowLeft, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const AdminLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
        { name: 'Colleges', path: '/admin/colleges', icon: <GraduationCap size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    const sidebarVariants = {
        hidden: { x: '-100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { x: '-100%', opacity: 0, transition: { duration: 0.2 } }
    };

    const mainVariants = {
        initial: { opacity: 0, scale: 0.98, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 0.98, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div className="flex h-screen bg-[#FDFDFE] text-slate-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
            {/* Mobile Header */}
            <header className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-40">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Discover Admin</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar */}
            <AnimatePresence>
                {(isMobileMenuOpen || window.innerWidth >= 1024) && (
                    <motion.aside
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cn(
                            "fixed lg:static top-0 left-0 h-full w-72 bg-white flex flex-col z-50 shrink-0",
                            "border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
                        )}
                    >
                        <div className="h-20 flex items-center px-8 border-b border-slate-100 shrink-0">
                            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Discover
                            </span>
                            <span className="ml-2 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">Admin</span>
                        </div>

                        <nav className="flex-1 px-4 py-8 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-4">Menu</div>
                            {navItems.map((item) => {
                                const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group outline-none",
                                            isActive ? "text-blue-700 font-semibold" : "text-slate-500 hover:text-slate-900"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-nav-pill"
                                                className="absolute inset-0 bg-blue-50/80 rounded-xl"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className={cn("relative z-10 transition-transform group-hover:scale-110 group-active:scale-95", isActive ? "text-blue-600" : "")}>{item.icon}</span>
                                        <span className="relative z-10">{item.name}</span>
                                    </Link>
                                );
                            })}

                            <div className="mt-auto pt-6 border-t border-slate-100">
                                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium group">
                                    <span className="transition-transform group-hover:-translate-x-1 group-active:scale-95"><ArrowLeft size={20} /></span>
                                    Exit to Public Site
                                </Link>
                            </div>
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 w-full overflow-hidden pt-16 lg:pt-0 bg-[#FAFAFA]">
                <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-slate-200/60 flex items-center px-10 shadow-[0_4px_24px_rgba(0,0,0,0.01)] shrink-0 hidden lg:flex">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h1>
                        <p className="text-sm font-medium text-slate-500">Welcome back, manage your platform.</p>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-6 md:p-10 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            variants={mainVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="h-full w-full max-w-7xl mx-auto"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
