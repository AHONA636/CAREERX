import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, sublabel, trend, tone = 'navy', delay = 0 }) {
  const toneStyles = {
    navy: 'bg-navy-50 text-navy-700',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card-surface flex flex-col gap-3 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
          <Icon size={18} strokeWidth={2.25} />
        </span>
        {trend ? (
          <span className={`text-xs font-semibold ${trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-600'}`}>
            {trend}
          </span>
        ) : null}
      </div>
      <div>
        <div className="font-[var(--font-display)] text-2xl font-bold text-navy-900">{value}</div>
        <div className="mt-0.5 text-sm text-navy-500">{label}</div>
        {sublabel ? <div className="mt-1 text-xs text-navy-300">{sublabel}</div> : null}
      </div>
    </motion.div>
  );
}
