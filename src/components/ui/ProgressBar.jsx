import { motion } from 'framer-motion';

const toneColors = {
  emerald: 'var(--color-emerald-500)',
  amber: 'var(--color-amber-500)',
  rose: 'var(--color-rose-500)',
  navy: 'var(--color-navy-800)',
  violet: 'var(--color-violet-500)',
};

function toneFor(value) {
  if (value >= 75) return 'emerald';
  if (value >= 45) return 'amber';
  return 'rose';
}

export default function ProgressBar({ value = 0, tone, height = 8, showLabel = false, className = '' }) {
  const resolvedTone = tone || toneFor(value);
  return (
    <div className={className}>
      <div className="w-full overflow-hidden rounded-full bg-surface-150" style={{ height, background: 'var(--color-surface-200)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: toneColors[resolvedTone] }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {showLabel ? <div className="mt-1 text-right text-xs font-semibold text-navy-500">{value}%</div> : null}
    </div>
  );
}
