import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineStatusOnline, HiOutlineRefresh } from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';

export default function LiveAttendance() {
    const [records, setRecords] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const fetchAttendance = async () => {
        try {
            const res = await api.get('/attendance/today');
            setRecords(res.data);
            setLastUpdate(new Date());
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchAttendance();
        const interval = setInterval(fetchAttendance, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Live Attendance
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Real-time feed • Auto-refreshes every 5s • Last update: {lastUpdate.toLocaleTimeString()}
                    </p>
                </motion.div>

                <button onClick={fetchAttendance} className="btn-secondary flex items-center gap-2 text-sm">
                    <HiOutlineRefresh /> Refresh Now
                </button>
            </div>

            {/* Live Feed */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['Student', 'Roll Number', 'Check In', 'Check Out', 'Status'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {records.map((r, i) => (
                                    <motion.tr key={r.id}
                                        initial={{ opacity: 0, x: -30, backgroundColor: 'rgba(0,240,255,0.05)' }}
                                        animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                                        transition={{ delay: i * 0.05, duration: 0.4 }}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                                                    style={{ background: 'var(--gradient-1)' }}>
                                                    {r.studentName?.charAt(0) || '?'}
                                                </div>
                                                <span className="text-sm font-medium">{r.studentName}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-[var(--accent-cyan)]">{r.rollNumber}</td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">{r.checkInTime || '—'}</td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">{r.checkOutTime || '—'}</td>
                                        <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center">
                                        <HiOutlineStatusOnline className="text-4xl text-[var(--text-muted)] mx-auto mb-3" />
                                        <p className="text-[var(--text-muted)]">No attendance records today</p>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">Waiting for IoT device data...</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
