import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyStudent = { rollNumber: '', name: '', email: '', phone: '', barcodeId: '' };

export default function Students() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyStudent);
    const [loading, setLoading] = useState(false);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students', { params: search ? { search } : {} });
            setStudents(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchStudents(); }, [search]);

    const openAdd = () => { setEditing(null); setForm(emptyStudent); setShowModal(true); };
    const openEdit = (s) => { setEditing(s.id); setForm({ rollNumber: s.rollNumber, name: s.name, email: s.email || '', phone: s.phone || '', barcodeId: s.barcodeId }); setShowModal(true); };
    const close = () => { setShowModal(false); setEditing(null); setForm(emptyStudent); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.rollNumber || !form.name || !form.barcodeId) { toast.error('Fill required fields'); return; }
        setLoading(true);
        try {
            if (editing) {
                await api.put(`/students/${editing}`, form);
                toast.success('Student updated');
            } else {
                await api.post('/students', form);
                toast.success('Student added');
            }
            close();
            fetchStudents();
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                // Show the first validation error
                const firstError = Object.values(data.errors)[0];
                toast.error(firstError);
            } else {
                toast.error(data?.message || 'Operation failed');
            }
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this student?')) return;
        try {
            await api.delete(`/students/${id}`);
            toast.success('Student deleted');
            fetchStudents();
        } catch (err) { toast.error('Delete failed'); }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Student Management</h1>
                    <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-1">{students.length} students enrolled</p>
                </motion.div>

                <div className="flex flex-col xs:flex-row gap-3">
                    <div className="relative flex-1 xs:flex-none">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                            className="input-glass pl-10 !py-2.5 !text-sm w-full xs:w-48 sm:w-60" />
                    </div>
                    <button onClick={openAdd} className="btn-primary flex items-center justify-center gap-2 !py-2.5 text-sm">
                        <HiOutlinePlus /> Add Student
                    </button>
                </div>
            </div>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['Student ID', 'Name', 'Email', 'Mobile No', 'Status', 'Check In', 'Check Out', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {students.length > 0 ? students.map((s, i) => (
                                    <motion.tr key={s.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-5 py-3.5 text-sm font-medium text-[var(--accent-cyan)]">{s.rollNumber}</td>
                                        <td className="px-5 py-3.5 text-sm">{s.name}</td>
                                        <td className="px-5 py-3.5 text-sm text-[var(--text-secondary)]">{s.email || '—'}</td>
                                        <td className="px-5 py-3.5 text-sm text-[var(--text-secondary)]">{s.phone || '—'}</td>
                                        <td className="px-5 py-3.5"><StatusBadge status={s.todayStatus || 'ABSENT'} /></td>
                                        <td className="px-5 py-3.5 text-sm text-[var(--text-secondary)]">{s.checkInTime || '—'}</td>
                                        <td className="px-5 py-3.5 text-sm text-[var(--text-secondary)]">{s.checkOutTime || '—'}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex gap-2">
                                                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--accent-cyan)] transition-colors"><HiOutlinePencil /></button>
                                                <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"><HiOutlineTrash /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <motion.tr
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    >
                                        <td colSpan={8} className="px-5 py-12 text-center text-[var(--text-muted)]">No students found. Add your first student!</td>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={close}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card-strong p-6 w-full max-w-md mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold gradient-text">{editing ? 'Edit Student' : 'Add Student'}</h3>
                                <button onClick={close} className="p-1 rounded-lg hover:bg-white/5"><HiOutlineX className="text-xl text-[var(--text-muted)]" /></button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-3.5">
                                {[
                                    { key: 'rollNumber', label: 'Student ID *', ph: 'CS-2024-001' },
                                    { key: 'name', label: 'Student Name *', ph: 'Jane Doe' },
                                    { key: 'email', label: 'Email', ph: 'jane@example.com' },
                                    { key: 'phone', label: 'Mobile No', ph: '+1 555-0123' },
                                    { key: 'barcodeId', label: 'Barcode ID *', ph: 'BAR-12345' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{f.label}</label>
                                        <input value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                            placeholder={f.ph} className="input-glass !py-2.5 !text-sm" />
                                    </div>
                                ))}
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={close} className="btn-secondary flex-1">Cancel</button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
                                        {loading ? 'Saving...' : editing ? 'Update' : 'Add Student'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
