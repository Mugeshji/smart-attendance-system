import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Scene3D from '../components/Scene3D';
import toast from 'react-hot-toast';
import gsap from 'gsap';

export default function Register() {
    const [form, setForm] = useState({
        name: '', email: '', password: '',
        confirmPassword: '', phone: '',
        department: '', universityName: ''
    });

    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const formRef = useRef();
    const containerRef = useRef();

    const update = (field) => (e) =>
        setForm({ ...form, [field]: e.target.value });

    // GSAP ENTRY (REFINED)
    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.from(containerRef.current, {
                opacity: 0,
                scale: 0.95,
                duration: 1.2,
                ease: "power4.out"
            })
                .from(".input-field", {
                    y: 20,
                    opacity: 0,
                    stagger: 0.05,
                    duration: 0.6,
                    ease: "power2.out"
                }, "-=0.8");
        });
        return () => ctx.revert();
    }, []);

    // PARTICLES (UNCHANGED)
    useEffect(() => {
        const canvas = document.getElementById("particle-canvas");
        const ctx = canvas.getContext("2d");

        let particles = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        window.addEventListener("mousemove", (e) => {
            for (let i = 0; i < 2; i++) {
                particles.push({
                    x: e.clientX,
                    y: e.clientY,
                    size: Math.random() * 2 + 1,
                    alpha: 1,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2
                });
            }
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.01;

                let gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
                gradient.addColorStop(0, `rgba(200,200,255,${p.alpha})`);
                gradient.addColorStop(1, "transparent");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                if (p.alpha <= 0) particles.splice(index, 1);
            });

            if (particles.length > 120) particles.shift();

            requestAnimationFrame(animate);
        }

        animate();
    }, []);

    // TILT (UNCHANGED)
    const handleMouseMove = (e) => {
        const rect = formRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * 8;
        const rotateY = ((x / rect.width) - 0.5) * -8;

        gsap.to(formRef.current, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            duration: 0.3
        });
    };

    const resetTilt = () => {
        gsap.to(formRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password) {
            toast.error('Please fill required fields'); return;
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match'); return;
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters'); return;
        }

        setLoading(true);
        try {
            await register(form);
            toast.success('Account created!');
            setTimeout(() => navigate('/dashboard'), 500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'name', label: 'Full Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'password', label: 'Password', type: 'password' },
        { key: 'confirmPassword', label: 'Confirm Password', type: 'password' },
        { key: 'phone', label: 'Phone Number', type: 'tel' },
        { key: 'department', label: 'Department', type: 'text' },
        { key: 'universityName', label: 'University Name', type: 'text' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">

            {/* Scene (reduced intensity) */}
            <div className="absolute inset-0 z-0 opacity-60">
                <Scene3D />
            </div>

            {/* Balanced overlay (REFINED) */}
            <div className="absolute inset-0 z-10 
            bg-gradient-to-br from-black/40 via-transparent to-black/40 pointer-events-none"></div>

            {/* Particles */}
            <canvas id="particle-canvas" className="absolute inset-0 z-20 pointer-events-none"></canvas>

            {/* Glow */}
            <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-20 blur-[150px] top-[-100px] left-[-100px]" />
            <div className="absolute w-[500px] h-[500px] bg-cyan-500 opacity-20 blur-[150px] bottom-[-100px] right-[-100px]" />

            <div ref={containerRef} className="relative z-30 w-full max-w-6xl grid md:grid-cols-2 gap-12 p-6">

                {/* LEFT */}
                <div className="hidden md:flex flex-col justify-center">
                    <h1 className="text-6xl font-bold leading-tight text-white">
                        Create Your Future
                    </h1>
                    <p className="mt-4 text-white/90 max-w-md">
                        A next-generation smart attendance platform with immersive UI.
                    </p>
                </div>

                {/* FORM */}
                <div
                    ref={formRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={resetTilt}
                    className="relative backdrop-blur-2xl bg-white/[0.18] border border-white/20 
                    p-10 md:p-12 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
                >

                    <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        <br />   Create Account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">

                        <div className="grid md:grid-cols-2 gap-6">
                            {['name', 'email'].map(key => {
                                const f = fields.find(x => x.key === key);
                                return (
                                    <div key={f.key} className="input-field relative group">
                                        <br />       <input
                                            type={f.type}
                                            value={form[f.key]}
                                            onChange={update(f.key)}
                                            placeholder=" "
                                            autoComplete={key === 'email' ? 'new-email' : 'off'}
                                            className="peer w-full px-4 pt-7 pb-2 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-cyan-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/5 outline-none transition-all duration-300"
                                        />
                                        <label className="absolute left-4 top-5 text-white/30 transition-all duration-300 pointer-events-none text-base
                                            peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-400
                                            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-cyan-400">
                                            {f.label}
                                        </label><br />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {['password', 'confirmPassword'].map(key => {
                                const f = fields.find(x => x.key === key);
                                return (
                                    <div key={f.key} className="input-field relative group">
                                        <br />   <input
                                            type={f.type}
                                            value={form[f.key]}
                                            onChange={update(f.key)}
                                            placeholder=" "
                                            autoComplete="new-password"
                                            className="peer w-full px-4 pt-7 pb-2 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-cyan-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/5 outline-none transition-all duration-300"
                                        /> <br />
                                        <label className="absolute left-4 top-5 text-white/30 transition-all duration-300 pointer-events-none text-base
                                            peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-400
                                            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-cyan-400">
                                            {f.label}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {['phone', 'department'].map(key => {
                                const f = fields.find(x => x.key === key);
                                return (
                                    <div key={f.key} className="input-field relative group">
                                        <br />  <input
                                            type={f.type}
                                            value={form[f.key]}
                                            onChange={update(f.key)}
                                            placeholder=" "
                                            autoComplete="off"
                                            className="peer w-full px-4 pt-7 pb-2 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-cyan-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/5 outline-none transition-all duration-300"
                                        />
                                        <label className="absolute left-4 top-5 text-white/30 transition-all duration-300 pointer-events-none text-base
                                            peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-400
                                            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-cyan-400">
                                            {f.label}
                                        </label>
                                    </div>
                                );
                            })}

                            <div className="input-field relative group md:col-span-2">
                                {(() => {
                                    const f = fields.find(x => x.key === 'universityName');
                                    return (
                                        <>
                                            <br /> <input
                                                type={f.type}
                                                value={form[f.key]}
                                                onChange={update(f.key)}
                                                placeholder=" "
                                                autoComplete="off"
                                                className="peer w-full px-4 pt-7 pb-2 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:border-cyan-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/5 outline-none transition-all duration-300"
                                            />
                                            <label className="absolute left-4 top-5 text-white/30 transition-all duration-300 pointer-events-none text-base
                                                peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-400
                                                peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-cyan-400">
                                                {f.label}
                                            </label>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        <br />

                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn w-full py-4 rounded-xl bg-white text-black font-medium hover:scale-[1.02] transition text-lg"
                        >
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>

                    </form>

                    <br />

                    <p className="text-center text-sm text-white/80 mt-6">
                        Already have an account? <Link to="/login" className="text-white">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}