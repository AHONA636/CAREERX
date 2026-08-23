import { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import RoleShell from '../../components/layout/RoleShell';
import { educatorNavItems } from './educatorNav';
import ChartCard from '../../components/ui/ChartCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { interventions } from '../../data/educatorAdminMockData';
import { useApp } from '../../context/AppContext';

export default function InterventionRecommendations() {
  const { addToast } = useApp();
  const [sent, setSent] = useState([]);

  function sendNudge(iv) {
    setSent((prev) => [...prev, iv.id]);
    addToast(`Intervention sent to ${iv.student}.`, 'success');
  }

  return (
    <RoleShell roleLabel="Educator" navItems={educatorNavItems}>
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Intervention Recommendations</h1>
          <p className="mt-1 text-navy-500">AI-flagged students who may need a nudge or a check-in.</p>
        </div>

        <div className="space-y-4">
          {interventions.map((iv) => (
            <ChartCard key={iv.id} title={iv.student} action={<Badge tone={iv.priority === 'High' ? 'danger' : 'warning'} icon={AlertCircle}>{iv.priority} Priority</Badge>}>
              <p className="text-sm text-navy-500"><span className="font-semibold text-navy-700">Why: </span>{iv.reason}</p>
              <p className="mt-2 text-sm text-navy-500"><span className="font-semibold text-navy-700">Recommended action: </span>{iv.action}</p>
              <Button
                size="sm"
                variant={sent.includes(iv.id) ? 'secondary' : 'primary'}
                icon={Send}
                className="mt-4"
                disabled={sent.includes(iv.id)}
                onClick={() => sendNudge(iv)}
              >
                {sent.includes(iv.id) ? 'Sent' : 'Send Intervention'}
              </Button>
            </ChartCard>
          ))}
        </div>
      </div>
    </RoleShell>
  );
}
