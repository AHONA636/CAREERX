import { motion } from 'framer-motion';
import { Clock, ListChecks, ArrowRight, Target } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const difficultyTone = { Easy: 'success', Medium: 'warning', Hard: 'danger' };

export function UpcomingAssessmentCard({ assessment, onStart, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card-surface flex flex-col gap-4 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-[var(--font-display)] text-base font-semibold text-navy-900">{assessment.title}</h3>
        {assessment.difficulty ? <Badge tone={difficultyTone[assessment.difficulty] || 'neutral'}>{assessment.difficulty}</Badge> : null}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-navy-500">
        <span className="flex items-center gap-1.5"><ListChecks size={14} /> {assessment.questions} Questions</span>
        <span className="flex items-center gap-1.5"><Clock size={14} /> {assessment.minutes} mins</span>
        <span className="flex items-center gap-1.5"><Target size={14} /> {assessment.skill}</span>
      </div>
      <Button size="sm" className="mt-auto w-full justify-center" iconRight={ArrowRight} onClick={() => onStart?.(assessment)}>
        Start Assessment
      </Button>
    </motion.div>
  );
}

export function CompletedAssessmentCard({ assessment, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card-surface rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-[var(--font-display)] text-base font-semibold text-navy-900">{assessment.title}</h3>
          <p className="mt-0.5 text-xs text-navy-400">Completed {assessment.completedOn}</p>
        </div>
        <div className="text-right">
          <p className="font-[var(--font-display)] text-2xl font-bold text-emerald-600">{assessment.score}%</p>
          <p className="text-xs text-navy-400">Score</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-surface-50 py-2">
          <p className="text-sm font-semibold text-navy-800">{assessment.accuracy}%</p>
          <p className="text-[11px] text-navy-400">Accuracy</p>
        </div>
        <div className="rounded-xl bg-surface-50 py-2">
          <p className="text-sm font-semibold text-navy-800">{assessment.timeTaken}</p>
          <p className="text-[11px] text-navy-400">Time</p>
        </div>
        <div className="rounded-xl bg-surface-50 py-2">
          <p className="text-sm font-semibold text-navy-800">{assessment.confidence}%</p>
          <p className="text-[11px] text-navy-400">Confidence</p>
        </div>
      </div>
      {assessment.weakTopics?.length ? (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold text-navy-400">Weak topics to revisit</p>
          <div className="flex flex-wrap gap-1.5">
            {assessment.weakTopics.map((t) => (
              <Badge key={t} tone="warning">{t}</Badge>
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
