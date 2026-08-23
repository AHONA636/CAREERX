import { motion } from 'framer-motion';
import { Target, Building2, BadgeCheck, Layers } from 'lucide-react';
import ProgressRing from './ProgressRing';

export default function ReadinessScore({ careerGoal }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl border border-navy-800 bg-navy-900 p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-navy-700/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={careerGoal.readinessScore} size={148} strokeWidth={11} color="var(--color-emerald-500)" trackColor="rgba(255,255,255,0.12)" label="Career Ready" />

          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-navy-300">Target Career</p>
            <h2 className="mt-1 font-[var(--font-display)] text-2xl font-bold text-white sm:text-3xl">{careerGoal.targetRole}</h2>
            <p className="mt-2 text-sm text-navy-300">
              You're <span className="font-semibold text-emerald-400">{careerGoal.readinessScore}% ready</span> — currently at
              stage <span className="font-semibold text-white">"{careerGoal.stage}"</span>
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:grid-cols-1 sm:gap-3 lg:grid-cols-2">
          <StatPill icon={Building2} label="Target Companies" value={careerGoal.targetCompanies.slice(0, 2).join(', ')} />
          <StatPill icon={BadgeCheck} label="Skills Verified" value={`${careerGoal.skillsVerifiedCount} / ${careerGoal.skillsTotalCount}`} />
          <StatPill icon={Layers} label="Skill Gap" value={`${careerGoal.skillGapCount} skills`} />
          <StatPill icon={Target} label="Timeline" value={careerGoal.timeline} />
        </div>
      </div>
    </motion.div>
  );
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-navy-300">
        <Icon size={13} />
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
