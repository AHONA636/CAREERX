import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import ChartCard from '../../components/ui/ChartCard';
import SkillBadge from '../../components/ui/SkillBadge';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import SkillGapRadar from '../../components/dashboard/SkillGapRadar';
import { useApp } from '../../context/AppContext';

export default function SkillGap() {
  const { careerGoal, skillGapTarget, priorityImprovements } = useApp();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Your Skill Gap</h1>
        <p className="mt-1 text-navy-500">Here's what stands between you and your target career.</p>
      </div>

      <div className="card-surface flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Target Career</p>
          <p className="mt-0.5 font-[var(--font-display)] text-lg font-semibold text-navy-900">{careerGoal.targetRole}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillGapTarget.requiredSkills.map((s) => (
            <SkillBadge key={s.name} name={s.name} status={s.status} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <ChartCard title="Required vs. Current Proficiency" subtitle="Current skill level compared to what your target role requires" className="lg:col-span-3">
          <SkillGapRadar data={skillGapTarget.requiredSkills.map((s) => ({ name: s.name, current: s.current, required: s.required }))} />
        </ChartCard>

        <ChartCard title="Skill Status Legend" subtitle="How CareerX classifies each skill" className="lg:col-span-2">
          <div className="space-y-4">
            <LegendRow tone="strong" title="Strong" desc="Meets or exceeds the requirement for your target role." />
            <LegendRow tone="warning" title="Needs Improvement" desc="Below the required threshold — prioritized on your roadmap." />
            <LegendRow tone="missing" title="Missing" desc="Not yet verified, and required for your target role." />
          </div>
        </ChartCard>
      </div>

      <div>
        <h2 className="mb-4 font-[var(--font-display)] text-lg font-semibold text-navy-900">Priority Improvements</h2>
        <div className="space-y-4">
          {priorityImprovements.map((pi, i) => (
            <motion.div
              key={pi.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="card-surface flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-[var(--font-display)] text-base font-semibold text-navy-900">{pi.title}</h3>
                    <Badge tone={pi.priority.startsWith('High') ? 'danger' : 'warning'} icon={AlertCircle}>{pi.priority}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-navy-500">
                    Current: <span className="font-semibold text-navy-700">{pi.current}%</span> · Required:{' '}
                    <span className="font-semibold text-navy-700">{pi.required}%</span> · Gap:{' '}
                    <span className="font-semibold text-rose-500">{pi.gap}%</span>
                  </p>
                  <div className="mt-2 w-56">
                    <ProgressBar value={pi.current} />
                  </div>
                </div>
              </div>
              <Link to="/app/learning">
                <Button size="sm" variant="secondary" iconRight={ArrowRight} className="w-full sm:w-auto">Start Learning</Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegendRow({ tone, title, desc }) {
  const dot = { strong: 'bg-emerald-500', warning: 'bg-amber-500', missing: 'bg-rose-500' };
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot[tone]}`} />
      <div>
        <p className="text-sm font-semibold text-navy-800">{title}</p>
        <p className="text-xs text-navy-400">{desc}</p>
      </div>
    </div>
  );
}
