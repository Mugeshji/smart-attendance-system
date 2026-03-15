import { motion } from 'framer-motion';

const statusConfig = {
    PRESENT: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', label: 'Present' },
    ABSENT: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', label: 'Absent' },
    CHECKED_OUT: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', label: 'Checked Out' },
    LATE: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', label: 'Late Entry' },
};

export default function StatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.ABSENT;

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ color: config.color, background: config.bg, border: `1px solid ${config.color}30` }}
        >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: config.color }} />
            {config.label}
        </motion.span>
    );
}
