import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Please fill all fields'); return; }
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden animated-gradient-bg">
            <Scene3D />

            {/* Ambient glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-[120px]" style={{ background: 'var(--accent-cyan)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-15 blur-[120px]" style={{ background: 'var(--accent-violet)' }} />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="glass-card-strong p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-black"
                            style={{ background: 'var(--gradient-1)' }}
                        >
                            SA
                        </motion.div>
                        <h2 className="text-2xl font-bold gradient-text mb-1">Welcome Back</h2>
                        <p className="text-sm text-[var(--text-muted)]">Sign in to your Smart Attendance dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                            <br /> <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.2">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="professor@university.edu" className="input-glass" />
                        </motion.div>

                        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                            <br />   <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" className="input-glass" />
                        </motion.div>
                        <br />
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </motion.button>
                    </form>
                    <br />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center text-sm text-[var(--text-muted)] mt-6"
                    >
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium" style={{ color: 'var(--accent-cyan)' }}>Create one</Link>
                    </motion.p> <br />
                </div>
            </motion.div>
        </div>
    );
}
