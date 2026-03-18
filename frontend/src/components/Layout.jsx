import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineViewGrid, HiOutlineUsers, HiOutlineStatusOnline, HiOutlineChartBar, HiOutlineUserCircle, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
    { path: '/students', label: 'Students', icon: HiOutlineUsers },
    { path: '/live-attendance', label: 'Live Attendance', icon: HiOutlineStatusOnline },
    { path: '/reports', label: 'Analytics', icon: HiOutlineChartBar },
    { path: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
];

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: 'var(--gradient-1)' }}>
                    SA
                </div>
                {(sidebarOpen || mobileMenuOpen) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                        <h1 className="text-sm font-bold gradient-text whitespace-nowrap">Smart Attendance</h1>
                        <p className="text-[10px] text-[var(--text-muted)]">IoT Platform</p>
                    </motion.div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink key={item.path} to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-gradient-to-r from-[rgba(0,240,255,0.15)] to-[rgba(168,85,247,0.1)] text-[var(--accent-cyan)]'
                                : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                            }`
                        }
                    >
                        <item.icon className="text-xl flex-shrink-0" />
                        {(sidebarOpen || mobileMenuOpen) && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium whitespace-nowrap">
                                {item.label}
                            </motion.span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/5">
                <button onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full">
                    <HiOutlineLogout className="text-xl flex-shrink-0" />
                    {(sidebarOpen || mobileMenuOpen) && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen overflow-hidden animated-gradient-bg">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ 
                    x: 0, 
                    width: sidebarOpen ? 260 : 72,
                    display: 'flex' 
                }}
                className="hidden lg:flex h-full flex-col glass-card-strong z-30"
            >
                <NavContent />
            </motion.aside>

            {/* Mobile Sidebar Slide-over */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-full w-[280px] flex flex-col glass-card-strong z-50 lg:hidden"
                        >
                            <NavContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/5" style={{ background: 'rgba(10,10,26,0.6)', backdropFilter: 'blur(20px)' }}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-[var(--text-secondary)] transition-colors">
                            <HiOutlineMenu className="text-xl" />
                        </button>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden lg:block p-2 rounded-lg hover:bg-white/5 text-[var(--text-secondary)] transition-colors">
                            {sidebarOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <button onClick={handleLogout}
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[var(--text-secondary)] hover:text-white transition-colors text-xs font-medium">
                            <HiOutlineLogout className="text-sm" />
                            Logout
                        </button>
                        <div className="text-right hidden xs:block">
                            <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">{user?.name || 'Professor'}</p>
                            <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate max-w-[120px]">{user?.email}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--gradient-1)' }}>
                            {(user?.name || 'P').charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
