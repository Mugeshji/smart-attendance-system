import { motion } from 'framer-motion';

const colorMap = {
    cyan: { bg: 'rgba(0, 240, 255, 0.08)', border: 'rgba(0, 240, 255, 0.2)', glow: 'rgba(0, 240, 255, 0.15)', text: '#00f0ff' },
    violet: { bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.2)', glow: 'rgba(168, 85, 247, 0.15)', text: '#a855f7' },
    green: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', glow: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
    red: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)', glow: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
    pink: { bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.2)', glow: 'rgba(236, 72, 153, 0.15)', text: '#ec4899' },
    blue: { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', glow: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
};

export default function StatCard({ title, value, icon: Icon, color = 'cyan', delay = 0 }) {
    const c = colorMap[color] || colorMap.cyan;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
            className="relative rounded-2xl p-5 cursor-pointer overflow-hidden"
            style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                boxShadow: `0 0 30px ${c.glow}`,
            }}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 opacity-20 rounded-2xl"
                style={{ background: `radial-gradient(circle at top right, ${c.text}, transparent 70%)` }} />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                        {title}
                    </p>
                    <motion.p
                        key={value}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl font-bold"
                        style={{ color: c.text }}
                    >
                        {value}
                    </motion.p>
                </div>
                {Icon && (
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${c.text}15` }}>
                        <Icon className="text-xl" style={{ color: c.text }} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
