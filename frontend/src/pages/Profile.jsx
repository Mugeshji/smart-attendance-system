import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineSave, HiOutlineKey } from 'react-icons/hi';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);
    const [changingPw, setChangingPw] = useState(false);

    useEffect(() => {
        api.get('/professor/profile').then(res => {
            setProfile(res.data);
            setForm(res.data);
        }).catch(console.error);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put('/professor/profile', form);
            setProfile(res.data);
            // Update stored user name
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.name = res.data.name;
            localStorage.setItem('user', JSON.stringify(user));
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally { setSaving(false); }
    };

    const handlePasswordChange = async () => {
        if (!passwords.oldPassword || !passwords.newPassword) { toast.error('Fill all password fields'); return; }
        if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
        if (passwords.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }

        setChangingPw(true);
        try {
            await api.post('/professor/change-password', { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword });
            toast.success('Password changed!');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Password change failed');
        } finally { setChangingPw(false); }
    };

    if (!profile) return null;

    const profileFields = [
        { key: 'name', label: 'Full Name', placeholder: 'Dr. John Smith' },
        { key: 'email', label: 'Email', placeholder: 'professor@university.edu', disabled: true },
        { key: 'phone', label: 'Phone Number', placeholder: '+1 555-0123' },
        { key: 'dob', label: 'Date of Birth', placeholder: 'YYYY-MM-DD', type: 'date' },
        { key: 'address', label: 'Address', placeholder: '123 University Ave' },
        { key: 'department', label: 'Department', placeholder: 'Computer Science' },
        { key: 'universityName', label: 'University Name', placeholder: 'MIT' },
    ];

    return (
        <div className="space-y-6 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold gradient-text">Profile Settings</h1>
                <p className="text-[var(--text-muted)] text-sm mt-1">Manage your account information</p>
            </motion.div>

            {/* Avatar Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-card p-6 flex items-center gap-6">
                <div className="relative">
                    <motion.div whileHover={{ scale: 1.05 }} className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
                        style={{ background: 'var(--gradient-1)' }}>
                        {(profile.name || 'P').charAt(0).toUpperCase()}
                    </motion.div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2" style={{ borderColor: 'var(--bg-primary)' }} />
                </div>
                <div>
                    <h3 className="text-lg font-bold">{profile.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{profile.email}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{profile.department || 'No department set'}</p>
                </div>
            </motion.div>

            {/* Profile Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-5 flex items-center gap-2">
                    <HiOutlineUser /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileFields.map((f) => (
                        <div key={f.key}>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{f.label}</label>
                            <input
                                type={f.type || 'text'}
                                value={form[f.key] || ''}
                                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                placeholder={f.placeholder}
                                disabled={f.disabled}
                                className={`input-glass !py-2.5 !text-sm ${f.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-5 flex justify-end">
                    <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                        <HiOutlineSave /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </motion.div>

            {/* Password Change */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-5 flex items-center gap-2">
                    <HiOutlineKey /> Change Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Current Password</label>
                        <input type="password" value={passwords.oldPassword}
                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                            placeholder="••••••••" className="input-glass !py-2.5 !text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">New Password</label>
                        <input type="password" value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            placeholder="••••••••" className="input-glass !py-2.5 !text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Confirm New</label>
                        <input type="password" value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            placeholder="••••••••" className="input-glass !py-2.5 !text-sm" />
                    </div>
                </div>
                <div className="mt-5 flex justify-end">
                    <button onClick={handlePasswordChange} disabled={changingPw} className="btn-secondary flex items-center gap-2 disabled:opacity-50">
                        <HiOutlineKey /> {changingPw ? 'Changing...' : 'Change Password'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
