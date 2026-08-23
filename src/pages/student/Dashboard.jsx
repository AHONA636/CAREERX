import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Layers, Flame, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ReadinessScore from '../../components/ui/ReadinessScore';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import AIInsight from '../../components/ui/AIInsight';
import Button from '../../components/ui/Button';
import ReadinessBreakdownChart from '../../components/dashboard/ReadinessBreakdownChart';
import OpportunityCard from '../../components/opportunity/OpportunityCard';
import RoadmapStep from '../../components/roadmap/RoadmapStep';
import { DashboardSkeleton } from '../../components/ui/LoadingSkeleton';
import { readinessBreakdown, roadmapSteps, opportunities, currentUser } from '../../data/mockData';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { careerGoal, user } = useApp();
  const navigate = useNavigate();
  const activeStep = useMemo(() => roadmapSteps.find((s) => s.status === 'in-progress') || roadmapSteps[0], []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">
          {greeting()}, {user.firstName} 👋
        </h1>
        <p className="mt-1 text-navy-500">
          You're <span className="font-semibold text-emerald-600">{careerGoal.readinessScore}% ready</span> for your target career.
        </p>
      </motion.div>

      <ReadinessScore careerGoal={careerGoal} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BadgeCheck} tone="emerald" label="Skills Verified" value={`${careerGoal.skillsVerifiedCount}/${careerGoal.skillsTotalCount}`} trend="+2 this week" delay={0.05} />
        <StatCard icon={Layers} tone="amber" label="Skill Gap" value={`${careerGoal.skillGapCount} skills`} sublabel={careerGoal.skillGapSummary} delay={0.1} />
        <StatCard icon={Flame} tone="rose" label="Current Streak" value={`${currentUser.streakDays} days`} trend="+1 today" delay={0.15} />
        <StatCard icon={Clock} tone="navy" label="Consistency Score" value={`${currentUser.consistencyScore}%`} delay={0.2} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <ChartCard
          title="Career Readiness"
          subtitle="Breakdown across the dimensions that matter for your target role"
          className="lg:col-span-3"
          action={<span className="font-[var(--font-display)] text-2xl font-bold text-navy-900">{careerGoal.readinessScore}%</span>}
        >
          <ReadinessBreakdownChart data={readinessBreakdown} />
          <AIInsight className="mt-5">
            You're on track. Strengthen DSA and system design to reach your target.
          </AIInsight>
          <Link to="/app/skill-gap">
            <Button variant="secondary" size="sm" className="mt-4 w-full justify-center" iconRight={ArrowRight}>
              View Skill Gaps
            </Button>
          </Link>
        </ChartCard>

        <ChartCard
          title="Current Roadmap Stage"
          subtitle={`Step ${roadmapSteps.indexOf(activeStep) + 1} of ${roadmapSteps.length}`}
          className="lg:col-span-2"
        >
          <RoadmapStep step={activeStep} index={roadmapSteps.indexOf(activeStep)} isLast onOpen={() => navigate('/app/roadmap')} />
          <Link to="/app/roadmap">
            <Button variant="secondary" size="sm" className="mt-1 w-full justify-center" iconRight={ArrowRight}>
              View Full Roadmap
            </Button>
          </Link>
        </ChartCard>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-[var(--font-display)] text-lg font-semibold text-navy-900">Opportunities Matched For You</h2>
            <p className="text-sm text-navy-400">Based on your verified skills and target companies</p>
          </div>
          <Link to="/app/opportunities" className="flex items-center gap-1 text-sm font-semibold text-navy-600 hover:text-navy-900">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.slice(0, 3).map((op, i) => (
            <OpportunityCard
              key={op.id}
              opportunity={op}
              delay={i * 0.06}
              onView={(opp) => navigate('/app/opportunities', { state: { openId: opp.id } })}
            />
          ))}
        </div>
      </div>

      <Link
        to="/app/mentor"
        className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white p-5 transition-shadow hover:shadow-md"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
          <Sparkles size={20} />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-navy-900">Ask your AI Mentor</p>
          <p className="text-sm text-navy-500">"You should prioritize DSA before starting system design."</p>
        </div>
        <ArrowRight size={18} className="text-navy-300" />
      </Link>
    </div>
  );
}
