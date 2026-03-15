import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUsers, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineLogout as HiOutlineExit, HiOutlineStatusOnline } from 'react-icons/hi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatCard from '../components/StatCard';
import api from '../api/axios';

const COLORS = ['#10b981', '#ef4444', '#3b82f6'];

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [pieData, setPieData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const fetchData = async () => {
        try {
            const [statsRes, pieRes, weeklyRes, monthlyRes] = await Promise.all([
                api.get('/attendance/stats'),
                api.get('/attendance/pie'),
                api.get('/attendance/weekly'),
                api.get('/attendance/monthly'),
            ]);
            setStats(statsRes.data);
            setPieData([
                { name: 'Present', value: pieRes.data.present || 0 },
                { name: 'Absent', value: pieRes.data.absent || 0 },
                { name: 'Checked Out', value: pieRes.data.checkedOut || 0 },
            ]);
            setWeeklyData(weeklyRes.data.data || []);
            setMonthlyData(monthlyRes.data.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            return (
                <div className="glass-card p-3 text-xs">
                    <p className="text-[var(--text-secondary)]">{label}</p>
                    <p className="font-bold" style={{ color: 'var(--accent-cyan)' }}>{payload[0].value} students</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold">
                    <span className="gradient-text">Command Center</span>
                </h1>
                <p className="text-[var(--text-muted)] text-sm mt-1">Real-time classroom intelligence overview</p>
            </motion.div>

            {/* Empty State Warning */}
            {!stats?.totalStudents && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 text-[var(--accent-cyan)]">
                    <HiOutlineUsers className="text-2xl" />
                    <div>
                        <h4 className="font-semibold text-sm">No Students Found</h4>
                        <p className="text-xs text-[var(--text-muted)]">Head over to the Students tab to add your first student. Charts will populate once attendance is marked.</p>
                    </div>
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Total Students" value={stats?.totalStudents ?? '—'} icon={HiOutlineUsers} color="cyan" delay={0} />
                <StatCard title="Present Today" value={stats?.presentToday ?? '—'} icon={HiOutlineCheckCircle} color="green" delay={0.1} />
                <StatCard title="Absent Today" value={stats?.absentToday ?? '—'} icon={HiOutlineXCircle} color="red" delay={0.2} />
                <StatCard title="Checked Out" value={stats?.checkedOutToday ?? '—'} icon={HiOutlineExit} color="blue" delay={0.3} />
                <StatCard title="Currently Inside" value={stats?.currentlyInside ?? '—'} icon={HiOutlineStatusOnline} color="violet" delay={0.4} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 uppercase tracking-wider">Today's Distribution</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        {pieData.reduce((sum, item) => sum + item.value, 0) > 0 ? (
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-40 h-40 rounded-full border-[12px] border-white/5 flex items-center justify-center">
                                    <span className="text-xs text-[var(--text-muted)] text-center px-4">No attendance marked</span>
                                </div>
                            </div>
                        )}
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2">
                        {pieData.map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                                {item.name}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Bar Chart */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 uppercase tracking-wider">Weekly Attendance</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        {weeklyData.length > 0 ? (
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" fill="#00f0ff" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
                                No weekly data available
                            </div>
                        )}
                    </ResponsiveContainer>
                </motion.div>

                {/* Line Chart */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 uppercase tracking-wider">Monthly Trends</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        {monthlyData.length > 0 ? (
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
                                No monthly trends available
                            </div>
                        )}
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}
