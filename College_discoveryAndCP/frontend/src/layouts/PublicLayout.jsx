import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import StickyCompareBar from '../components/StickyCompareBar';
import { cn } from '../utils/cn';

const PublicLayout = () => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Colleges', path: '/' },
        { name: 'Compare', path: '/compare' }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFE] font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
            <header className={cn(
                "sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl border-b",
                scrolled ? "bg-white/80 border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.02)] py-3" : "bg-white/50 border-transparent py-5"
            )}>
                <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <span className="text-lg leading-none">D</span>
                        </div>
                        DiscoverEd
                    </Link>

                    <nav className="hidden md:flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/50 backdrop-blur-md">
                        <LayoutGroup>
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                                return (
                                    <Link key={link.name} to={link.path} className={cn("relative px-5 py-2 rounded-xl text-sm font-bold transition-all z-10", isActive ? "text-blue-700" : "text-slate-500 hover:text-slate-800")}>
                                        {isActive && (
                                            <motion.div layoutId="public-active-nav" className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/50 -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                        )}
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </LayoutGroup>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-none hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] active:scale-95">
                            Admin Portal
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-10 mb-20 relative z-10">
                <Outlet />
            </main>

            <StickyCompareBar />
        </div>
    );
};

export default PublicLayout;
