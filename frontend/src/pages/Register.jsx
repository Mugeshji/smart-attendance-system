import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';
import toast from 'react-hot-toast';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', department: '', universityName: '' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) { toast.error('Please fill required fields'); return; }
        if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

        setLoading(true);
        try {
            await register(form);
            toast.success('Account created!');
            // User context is slow to update, directly navigate
            setTimeout(() => navigate('/dashboard'), 500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Dr. John Smith', required: true },
        { key: 'email', label: 'Email', type: 'email', placeholder: 'professor@university.edu', required: true },
        { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
        { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••', required: true },
        { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000' },
        { key: 'department', label: 'Department', type: 'text', placeholder: 'Computer Science' },
        { key: 'universityName', label: 'University Name', type: 'text', placeholder: 'MIT' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden animated-gradient-bg py-10">
            <Scene3D />

            <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-20 blur-[100px]" style={{ background: 'var(--accent-violet)' }} />
            <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full opacity-15 blur-[100px]" style={{ background: 'var(--accent-cyan)' }} />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="relative z-10 w-full max-w-lg mx-4"
            >
                <div className="glass-card-strong p-8">
                    <div className="text-center mb-6">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-black"
                            style={{ background: 'var(--gradient-2)' }}>
                            SA
                        </motion.div>
                        <h2 className="text-2xl font-bold gradient-text-2 mb-1">Create Account</h2>
                        <p className="text-sm text-[var(--text-muted)]">Join the Smart Attendance Platform</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map((f, i) => (
                            <motion.div key={f.key} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{f.label}{f.required && ' *'}</label>
                                <input type={f.type} value={form[f.key]} onChange={update(f.key)} placeholder={f.placeholder} className="input-glass" />
                            </motion.div>
                        ))}

                        <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                            type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-2">
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-[var(--text-muted)] mt-5">
                        Already have an account? <Link to="/login" className="font-medium" style={{ color: 'var(--accent-violet)' }}>Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
