import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineDownload, HiOutlineCalendar } from 'react-icons/hi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import api from '../api/axios';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#ef4444', '#3b82f6'];

const formatDate = (dateStr) => {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch { return dateStr; }
};

const generateEmptyData = (days) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        data.push({ date: d.toISOString().split('T')[0], count: 0 });
    }
    return data;
};

export default function Reports() {
    const [pieData, setPieData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        Promise.all([
            api.get('/attendance/pie'),
            api.get('/attendance/weekly'),
            api.get('/attendance/monthly'),
        ]).then(([pie, weekly, monthly]) => {
            setPieData([
                { name: 'Present', value: pie.data.present || 0 }, // Slices are disjoint (Inside, CheckedOut, Absent)
                { name: 'Absent', value: pie.data.absent || 0 },
                { name: 'Checked Out', value: pie.data.checkedOut || 0 },
            ]);
            
            const wData = weekly.data.data || [];
            setWeeklyData(wData.length > 0 ? wData : generateEmptyData(7));
            
            const mData = monthly.data.data || [];
            setMonthlyData(mData.length > 0 ? mData : generateEmptyData(30));
        }).catch(console.error);
    }, []);

    const downloadReport = async (format) => {
        setDownloading(true);
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await api.get(`/reports/${format}`, {
                params,
                responseType: format === 'excel' ? 'blob' : 'text',
            });

            const blob = format === 'excel' ? new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                : new Blob([res.data], { type: 'text/csv' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `attendance_report.${format === 'excel' ? 'xlsx' : 'csv'}`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success(`${format.toUpperCase()} report downloaded!`);
        } catch (err) {
            toast.error('Download failed');
        } finally { setDownloading(false); }
    };

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
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold gradient-text-2">Analytics & Reports</h1>
                <p className="text-[var(--text-muted)] text-sm mt-1">Attendance insights and downloadable reports</p>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Present vs Absent</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        {pieData.reduce((sum, item) => sum + item.value, 0) > 0 ? (
                            <PieChart>
                                <Pie 
                                    data={pieData} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5} 
                                    dataKey="value" 
                                    label={({ name, percent, value }) => value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                >
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                            </PieChart>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-52 h-52 rounded-full border-[2px] border-dashed border-white/20 flex items-center justify-center relative">
                                    <div className="absolute inset-3 rounded-full border border-white/5 bg-white/[0.02]" />
                                    <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium z-10">No Distribution Data</span>
                                </div>
                            </div>
                        )}
                    </ResponsiveContainer>
                </motion.div>

                {/* Bar Chart */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Weekly Attendance</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickFormatter={formatDate} minTickGap={20} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Bar dataKey="count" fill="url(#barGradientReports)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="barGradientReports" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#00f0ff" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Line Chart - full width */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-card p-6 lg:col-span-2">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Monthly Trends (30 days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickFormatter={formatDate} minTickGap={40} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 0 }} activeDot={{ r: 6, fill: '#000', stroke: '#a855f7', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Download Section */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-5 flex items-center gap-2">
                    <HiOutlineDownload /> Download Reports
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                            <HiOutlineCalendar className="inline mr-1" /> Start Date
                        </label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-glass !py-2.5 !text-sm w-full" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                            <HiOutlineCalendar className="inline mr-1" /> End Date
                        </label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-glass !py-2.5 !text-sm w-full" />
                    </div>
                    <div className="flex gap-3 sm:col-span-2 lg:col-span-2">
                        <button onClick={() => downloadReport('excel')} disabled={downloading}
                            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                            <HiOutlineDownload /> Excel (.xlsx)
                        </button>
                        <button onClick={() => downloadReport('csv')} disabled={downloading}
                            className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                            <HiOutlineDownload /> CSV
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
