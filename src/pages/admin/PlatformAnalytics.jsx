import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RoleShell from '../../components/layout/RoleShell';
import { adminNavItems } from './adminNav';
import ChartCard from '../../components/ui/ChartCard';
import { userGrowth } from '../../data/educatorAdminMockData';

export default function PlatformAnalytics() {
  return (
    <RoleShell roleLabel="Admin" navItems={adminNavItems}>
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Platform Analytics</h1>
          <p className="mt-1 text-navy-500">Students vs. educators onboarded per month.</p>
        </div>

        <ChartCard title="Monthly Onboarding" subtitle="New accounts created by role">
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={userGrowth} margin={{ top: 10, right: 10, left: -18, bottom: 0 }} barGap={4}>
                <CartesianGrid vertical={false} stroke="var(--color-surface-200)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-surface-200)', fontSize: 12.5 }} />
                <Bar dataKey="students" name="Students" fill="var(--color-navy-800)" radius={[6, 6, 0, 0]} maxBarSize={22} />
                <Bar dataKey="educators" name="Educators" fill="var(--color-amber-500)" radius={[6, 6, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </RoleShell>
  );
}
