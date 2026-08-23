import { Users, Activity, Cpu, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RoleShell from '../../components/layout/RoleShell';
import { adminNavItems } from './adminNav';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { platformStats, userGrowth } from '../../data/educatorAdminMockData';

export default function AdminOverview() {
  return (
    <RoleShell roleLabel="Admin" navItems={adminNavItems}>
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Admin Overview</h1>
          <p className="mt-1 text-navy-500">Platform-wide health, growth and model performance.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Users} tone="navy" label="Total Users" value={platformStats.totalUsers.toLocaleString()} trend="+180 this month" delay={0.02} />
          <StatCard icon={Activity} tone="emerald" label="Active Today" value={platformStats.activeToday} delay={0.06} />
          <StatCard icon={Cpu} tone="violet" label="Model Accuracy" value={`${platformStats.modelAccuracy}%`} delay={0.1} />
          <StatCard icon={Clock} tone="amber" label="Avg. Session" value={`${platformStats.avgSessionMin} min`} delay={0.14} />
        </div>

        <ChartCard title="User Growth" subtitle="Students & educators onboarded per month">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={userGrowth} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-navy-800)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-navy-800)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-surface-200)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-surface-200)', fontSize: 12.5 }} />
                <Area type="monotone" dataKey="students" name="Students" stroke="var(--color-navy-800)" strokeWidth={2.5} fill="url(#studentsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </RoleShell>
  );
}
