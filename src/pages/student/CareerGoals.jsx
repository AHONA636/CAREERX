import { useState } from 'react';
import {
  Code2, BarChart3, Cpu, Layout, Server, Cloud, ShieldCheck, MoreHorizontal, Save,
} from 'lucide-react';
import ChartCard from '../../components/ui/ChartCard';
import CareerGoalCard from '../../components/goals/CareerGoalCard';
import Button from '../../components/ui/Button';
import ProgressRing from '../../components/ui/ProgressRing';
import { careerRoleOptions, companyOptions, timelineOptions } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const roleIcons = {
  'Software Engineer': Code2,
  'Data Scientist': BarChart3,
  'ML Engineer': Cpu,
  'Frontend Developer': Layout,
  'Backend Developer': Server,
  'Cloud Engineer': Cloud,
  'Cybersecurity Engineer': ShieldCheck,
  'Other': MoreHorizontal,
};

export default function CareerGoals() {
  const { careerGoal, updateCareerGoal } = useApp();
  const [role, setRole] = useState('Software Engineer');
  const [companies, setCompanies] = useState(careerGoal.targetCompanies);
  const [timeline, setTimeline] = useState(careerGoal.timeline);

  function toggleCompany(c) {
    setCompanies((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function save() {
    updateCareerGoal({
      targetRole: role === 'Software Engineer' ? 'Software Development Engineer' : role,
      targetCompanies: companies,
      timeline,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Career Goals</h1>
        <p className="mt-1 text-navy-500">Update your target role, companies and timeline — CareerX will recalculate your roadmap.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ChartCard title="What career are you targeting?" subtitle="CareerX maps your verified skills against this role's requirements">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {careerRoleOptions.map((r) => (
                <CareerGoalCard key={r} label={r} icon={roleIcons[r]} selected={role === r} onClick={() => setRole(r)} />
              ))}
            </div>
          </ChartCard>

          <ChartCard title="What companies interest you?" subtitle="Select as many as you like">
            <div className="flex flex-wrap gap-2.5">
              {companyOptions.map((c) => {
                const selected = companies.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleCompany(c)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selected ? 'border-navy-900 bg-navy-900 text-white' : 'border-surface-200 bg-white text-navy-600 hover:border-navy-300'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </ChartCard>

          <ChartCard title="What's your target timeline?" subtitle="This sets the pace of your personalized roadmap">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {timelineOptions.map((t) => (
                <CareerGoalCard key={t} label={t} selected={timeline === t} onClick={() => setTimeline(t)} />
              ))}
            </div>
          </ChartCard>

          <Button size="lg" icon={Save} onClick={save}>Save Career Goal</Button>
        </div>

        <ChartCard title="Current Snapshot" subtitle="Live readiness for your saved goal">
          <div className="flex flex-col items-center py-2 text-center">
            <ProgressRing value={careerGoal.readinessScore} size={130} strokeWidth={10} label="Career Ready" />
            <p className="mt-5 text-sm text-navy-500">
              Target: <span className="font-semibold text-navy-800">{careerGoal.targetRole}</span>
            </p>
            <p className="mt-1 text-sm text-navy-500">
              Timeline: <span className="font-semibold text-navy-800">{careerGoal.timeline}</span>
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {careerGoal.targetCompanies.map((c) => (
                <span key={c} className="rounded-full bg-surface-100 px-2.5 py-1 text-xs font-medium text-navy-600">{c}</span>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
