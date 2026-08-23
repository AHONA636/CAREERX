import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Flame, Target, Layers, CheckCircle2 } from 'lucide-react';
import ChartCard from '../../components/ui/ChartCard';
import StatCard from '../../components/ui/StatCard';
import { readinessTrend, skillGrowth, weeklyActivity, currentUser } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

function TooltipCard({ active, payload, label, suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-navy-800">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-navy-500">{p.name}: <span className="font-semibold text-navy-800">{p.value}{suffix}</span></p>
      ))}
    </div>
  );
}

export default function Progress() {
  const { careerGoal } = useApp();
  const liveTrend = readinessTrend.map((d, i, arr) =>
    i === arr.length - 1 ? { ...d, score: careerGoal.readinessScore } : d
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Progress Tracking</h1>
        <p className="mt-1 text-navy-500">Your learning consistency and readiness growth over time.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Target} tone="emerald" label="Readiness Score" value={`${careerGoal.readinessScore}%`} trend="+31% since Mar" delay={0.02} />
        <StatCard icon={Flame} tone="rose" label="Current Streak" value={`${currentUser.streakDays} days`} delay={0.06} />
        <StatCard icon={CheckCircle2} tone="navy" label="Consistency Score" value={`${currentUser.consistencyScore}%`} delay={0.1} />
        <StatCard icon={Layers} tone="violet" label="Projects Completed" value="1 / 3" delay={0.14} />
      </div>

      <ChartCard title="Career Readiness Over Time" subtitle="Your readiness score across the last 6 months">
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <AreaChart data={liveTrend} margin={{ top: 10, right: 20, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="readinessFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-emerald-500)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--color-emerald-500)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-surface-200)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip content={<TooltipCard suffix="%" />} />
              <Area type="monotone" dataKey="score" name="Readiness" stroke="var(--color-emerald-500)" strokeWidth={2.5} fill="url(#readinessFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Skill Growth" subtitle="Before vs. current proficiency">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={skillGrowth} margin={{ top: 10, right: 10, left: -18, bottom: 0 }} barGap={4}>
                <CartesianGrid vertical={false} stroke="var(--color-surface-200)" />
                <XAxis dataKey="skill" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip content={<TooltipCard suffix="%" />} />
                <Bar dataKey="before" name="Before" fill="var(--color-surface-300)" radius={[6, 6, 0, 0]} maxBarSize={18} />
                <Bar dataKey="now" name="Now" fill="var(--color-navy-800)" radius={[6, 6, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Learning Activity" subtitle="Hours spent learning this week">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-surface-200)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
                <Tooltip content={<TooltipCard suffix="h" />} />
                <Bar dataKey="hours" name="Hours" fill="var(--color-amber-500)" radius={[6, 6, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
