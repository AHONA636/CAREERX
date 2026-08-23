import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card-surface rounded-2xl p-5 sm:p-6 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-[var(--font-display)] text-base font-semibold text-navy-900">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-sm text-navy-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
