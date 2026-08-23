import RoleShell from '../../components/layout/RoleShell';
import { adminNavItems } from './adminNav';
import ChartCard from '../../components/ui/ChartCard';
import Badge from '../../components/ui/Badge';
import { modelInsights } from '../../data/educatorAdminMockData';

const driftTone = { Stable: 'success', 'Minor Drift': 'warning', Monitoring: 'danger' };

export default function ModelInsights() {
  return (
    <RoleShell roleLabel="Admin" navItems={adminNavItems}>
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Model & Recommendation Insights</h1>
          <p className="mt-1 text-navy-500">Performance and drift status of CareerX's ML models.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {modelInsights.map((m) => (
            <ChartCard key={m.model} title={m.model} action={<Badge tone={driftTone[m.drift]}>{m.drift}</Badge>}>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-navy-400">Accuracy</p>
                  <p className="font-[var(--font-display)] text-2xl font-bold text-navy-900">{m.accuracy}%</p>
                </div>
                <p className="text-xs text-navy-400">Last retrained {m.lastRetrained}</p>
              </div>
            </ChartCard>
          ))}
        </div>
      </div>
    </RoleShell>
  );
}
