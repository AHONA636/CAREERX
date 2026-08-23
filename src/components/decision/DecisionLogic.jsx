import { motion } from 'framer-motion';
import { Check, X, HelpCircle, ArrowDown } from 'lucide-react';
import { decisionOutcomes } from '../../data/mockData';

const toneStyles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  info: 'bg-violet-50 border-violet-200 text-violet-700',
  alt: 'bg-amber-50 border-amber-200 text-amber-700',
};

const toneDot = {
  success: '🟢',
  warning: '🟠',
  info: '🟣',
  alt: '🟠',
};

function ConditionRow({ label, value, delay }) {
  const isBool = typeof value === 'boolean';
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-3"
    >
      <span className="text-sm font-medium text-navy-600">{label}</span>
      {isBool ? (
        <span className={`flex items-center gap-1.5 text-sm font-semibold ${value ? 'text-emerald-600' : 'text-rose-500'}`}>
          {value ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}
          {value ? 'Yes' : 'No'}
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-navy-400">
          <HelpCircle size={15} />
          Not Required
        </span>
      )}
    </motion.div>
  );
}

export default function DecisionLogic({ result }) {
  const outcome = decisionOutcomes[result.recommendation];

  return (
    <div className="space-y-3">
      <ConditionRow label="Skills Verified?" value={result.skillsVerified} delay={0} />
      <ConditionRow label="Readiness Threshold Met?" value={result.readinessThresholdMet} delay={0.06} />
      <ConditionRow label="Maximum Attempts Reached?" value={result.maxAttemptsReached} delay={0.12} />
      <ConditionRow label="GATE Eligible?" value={result.gateEligible} delay={0.18} />

      <div className="flex justify-center py-1 text-navy-300">
        <ArrowDown size={18} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className={`rounded-2xl border-2 px-5 py-4 ${toneStyles[outcome.tone]}`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Final Recommendation</p>
        <p className="mt-1 font-[var(--font-display)] text-lg font-bold">
          {toneDot[outcome.tone]} {outcome.label}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed opacity-90">{outcome.description}</p>
      </motion.div>
    </div>
  );
}
