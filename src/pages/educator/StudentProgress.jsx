import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RoleShell from '../../components/layout/RoleShell';
import { educatorNavItems } from './educatorNav';
import ChartCard from '../../components/ui/ChartCard';
import { readinessTrend } from '../../data/mockData';

const cohortTrend = readinessTrend.map((d) => ({ month: d.month, cohortAvg: Math.round(d.score * 0.82) }));

export default function StudentProgress() {
  return (
    <RoleShell roleLabel="Educator" navItems={educatorNavItems}>
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Student Progress</h1>
          <p className="mt-1 text-navy-500">Cohort-average readiness trend over the last 6 months.</p>
        </div>

        <ChartCard title="Cohort Readiness Trend" subtitle="Average readiness score across all active students">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={cohortTrend} margin={{ top: 10, right: 20, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-surface-200)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-surface-200)', fontSize: 12.5 }} />
                <Line type="monotone" dataKey="cohortAvg" name="Cohort Avg" stroke="var(--color-navy-800)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </RoleShell>
  );
}
