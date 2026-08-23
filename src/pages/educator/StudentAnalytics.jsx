import { useState } from 'react';
import { Search } from 'lucide-react';
import RoleShell from '../../components/layout/RoleShell';
import { educatorNavItems } from './educatorNav';
import ChartCard from '../../components/ui/ChartCard';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { studentRoster } from '../../data/educatorAdminMockData';

export default function StudentAnalytics() {
  const [query, setQuery] = useState('');
  const filtered = studentRoster.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <RoleShell roleLabel="Educator" navItems={educatorNavItems}>
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Student Analytics</h1>
          <p className="mt-1 text-navy-500">Individual readiness and role targets across your cohort.</p>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students…"
            aria-label="Search students"
            className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-9 pr-3 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <ChartCard key={s.name} title={s.name} subtitle={s.role}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-navy-500">Readiness</span>
                <span className="font-semibold text-navy-800">{s.readiness}%</span>
              </div>
              <ProgressBar value={s.readiness} />
              <div className="mt-4 flex items-center justify-between">
                <Badge tone={s.status === 'At Risk' ? 'danger' : 'success'}>{s.status}</Badge>
                <span className="text-xs text-navy-400">Active {s.lastActive}</span>
              </div>
            </ChartCard>
          ))}
        </div>
      </div>
    </RoleShell>
  );
}
