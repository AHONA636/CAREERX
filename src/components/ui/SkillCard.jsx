import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import Button from './Button';
import ProgressBar from './ProgressBar';

export default function SkillCard({ skill, onAssess, delay = 0 }) {
  const { name, category, verified, confidence, evidence } = skill;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`card-surface flex flex-col gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md ${
        verified ? 'ring-1 ring-emerald-100' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-navy-300">{category}</p>
          <h3 className="mt-1 font-[var(--font-display)] text-lg font-semibold text-navy-900">{name}</h3>
        </div>
        {verified ? (
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={13} strokeWidth={2.5} /> Verified
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-surface-100 px-2.5 py-1 text-xs font-semibold text-navy-400">
            <Circle size={13} strokeWidth={2.5} /> Not Verified
          </span>
        )}
      </div>

      {verified ? (
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-navy-400">
            <span>Confidence</span>
            <span className="font-semibold text-navy-700">{confidence}%</span>
          </div>
          <ProgressBar value={confidence} tone={confidence >= 80 ? 'emerald' : 'amber'} />
        </div>
      ) : (
        <p className="text-sm text-navy-400">Take an assessment to verify this skill and unlock roadmap credit.</p>
      )}

      {verified && evidence?.length ? (
        <div>
          <p className="mb-2 text-xs font-semibold text-navy-400">Verified through</p>
          <ul className="space-y-1.5">
            {evidence.map((e) => (
              <li key={e} className="flex items-center gap-2 text-sm text-navy-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button
        variant={verified ? 'secondary' : 'primary'}
        size="sm"
        className="mt-auto w-full justify-center"
        iconRight={ArrowRight}
        onClick={() => onAssess?.(skill)}
      >
        {verified ? 'Re-assess Skill' : 'Start Assessment'}
      </Button>
    </motion.div>
  );
}
