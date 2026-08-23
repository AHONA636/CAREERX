import { motion } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

const statusConfig = {
  completed: {
    dot: 'bg-emerald-500 border-emerald-500 text-white',
    line: 'bg-emerald-500',
    icon: Check,
    label: 'Completed',
    labelClasses: 'text-emerald-600',
  },
  'in-progress': {
    dot: 'bg-white border-navy-800 text-navy-800',
    line: 'bg-surface-300',
    icon: Loader2,
    label: 'In Progress',
    labelClasses: 'text-navy-700',
  },
  upcoming: {
    dot: 'bg-white border-surface-300 text-surface-300',
    line: 'bg-surface-200',
    icon: Circle,
    label: 'Upcoming',
    labelClasses: 'text-navy-300',
  },
};

export default function RoadmapStep({ step, index, isLast, onOpen, delay = 0 }) {
  const cfg = statusConfig[step.status];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative flex gap-4 pb-8 last:pb-0"
    >
      <div className="flex flex-col items-center">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${cfg.dot}`}>
          <Icon size={15} strokeWidth={2.75} className={step.status === 'in-progress' ? 'animate-spin' : ''} />
        </span>
        {!isLast ? <span className={`mt-1 w-0.5 flex-1 ${cfg.line}`} /> : null}
      </div>

      <button
        onClick={() => onOpen?.(step)}
        className="flex-1 rounded-2xl border border-surface-200 bg-white p-4 text-left transition-all hover:border-navy-200 hover:shadow-md sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide ${cfg.labelClasses}`}>
              Step {index + 1} · {cfg.label}
            </p>
            <h3 className="mt-1 font-[var(--font-display)] text-base font-semibold text-navy-900">{step.title}</h3>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-navy-500">{step.description}</p>
        {step.status === 'in-progress' && step.progress != null ? (
          <div className="mt-3">
            <ProgressBar value={step.progress} showLabel />
          </div>
        ) : null}
      </button>
    </motion.div>
  );
}
