import { Users, Gauge, AlertTriangle, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RoleShell from '../../components/layout/RoleShell';
import { educatorNavItems } from './educatorNav';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import Badge from '../../components/ui/Badge';
import { cohortStats, readinessDistribution, studentRoster } from '../../data/educatorAdminMockData';

export default function EducatorOverview() {
  return (
    <RoleShell roleLabel="Educator" navItems={educatorNavItems}>
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Educator Overview</h1>
          <p className="mt-1 text-navy-500">Cohort-wide readiness and intervention signals across your students.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Users} tone="navy" label="Total Students" value={cohortStats.totalStudents} delay={0.02} />
          <StatCard icon={Gauge} tone="emerald" label="Avg. Readiness" value={`${cohortStats.avgReadiness}%`} delay={0.06} />
          <StatCard icon={AlertTriangle} tone="amber" label="At-Risk Students" value={cohortStats.atRiskStudents} delay={0.1} />
          <StatCard icon={Trophy} tone="violet" label="Placement Rate" value={`${cohortStats.placementRate}%`} delay={0.14} />
        </div>

        <ChartCard title="Readiness Distribution" subtitle="How many students fall into each readiness band">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={readinessDistribution} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-surface-200)" />
                <XAxis dataKey="band" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-surface-200)', fontSize: 12.5 }} />
                <Bar dataKey="students" fill="var(--color-navy-800)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Recent Student Activity" subtitle="Snapshot of your most recently active students">
          <div className="scrollbar-thin -mx-2 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-navy-400">
                  <th className="px-2 pb-3 font-semibold">Student</th>
                  <th className="px-2 pb-3 font-semibold">Target Role</th>
                  <th className="px-2 pb-3 font-semibold">Readiness</th>
                  <th className="px-2 pb-3 font-semibold">Status</th>
                  <th className="px-2 pb-3 font-semibold">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {studentRoster.map((s) => (
                  <tr key={s.name} className="border-t border-surface-100">
                    <td className="px-2 py-3 font-medium text-navy-800">{s.name}</td>
                    <td className="px-2 py-3 text-navy-500">{s.role}</td>
                    <td className="px-2 py-3 font-semibold text-navy-700">{s.readiness}%</td>
                    <td className="px-2 py-3">
                      <Badge tone={s.status === 'At Risk' ? 'danger' : 'success'}>{s.status}</Badge>
                    </td>
                    <td className="px-2 py-3 text-navy-400">{s.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </RoleShell>
  );
}
