import { motion } from 'framer-motion';
import { MapPin, Calendar, Check, X as XIcon } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressRing from '../ui/ProgressRing';

const typeTone = {
  Internship: 'ai',
  Job: 'navy',
  Hackathon: 'warning',
  Scholarship: 'success',
  Competition: 'danger',
};

export default function OpportunityCard({ opportunity, onView, delay = 0 }) {
  const ringColor = opportunity.match >= 85 ? 'var(--color-emerald-500)' : opportunity.match >= 65 ? 'var(--color-amber-500)' : 'var(--color-rose-500)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card-surface flex flex-col gap-4 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone={typeTone[opportunity.type] || 'neutral'}>{opportunity.type}</Badge>
          <h3 className="mt-2 font-[var(--font-display)] text-base font-semibold text-navy-900">{opportunity.role}</h3>
          <p className="text-sm text-navy-500">{opportunity.company}</p>
        </div>
        <ProgressRing value={opportunity.match} size={64} strokeWidth={6} color={ringColor} label={null} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-navy-400">
        <span className="flex items-center gap-1"><MapPin size={12} /> {opportunity.location}</span>
        <span className="flex items-center gap-1"><Calendar size={12} /> Apply by {opportunity.deadline}</span>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-navy-400">Skills matched</p>
        <div className="flex flex-wrap gap-1.5">
          {opportunity.skillsMatched.map((s) => (
            <span key={s} className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              <Check size={11} strokeWidth={3} /> {s}
            </span>
          ))}
          {opportunity.skillsMissing.map((s) => (
            <span key={s} className="flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-xs font-medium text-rose-600">
              <XIcon size={11} strokeWidth={3} /> {s}
            </span>
          ))}
        </div>
      </div>

      <Button size="sm" className="mt-auto w-full justify-center" onClick={() => onView?.(opportunity)}>
        View Opportunity
      </Button>
    </motion.div>
  );
}
