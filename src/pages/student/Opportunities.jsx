import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Calendar, Check, X as XIcon } from 'lucide-react';
import OpportunityCard from '../../components/opportunity/OpportunityCard';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { Briefcase } from 'lucide-react';
import { opportunities } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const types = ['All', 'Internship', 'Job', 'Hackathon', 'Scholarship', 'Competition'];

export default function Opportunities() {
  const { addToast } = useApp();
  const location = useLocation();
  const [type, setType] = useState('All');
  const [active, setActive] = useState(null);
  const [applied, setApplied] = useState([]);

  useEffect(() => {
    const openId = location.state?.openId;
    if (!openId) return;
    const match = opportunities.find((o) => o.id === openId);
    if (match) setActive(match);
  }, [location.state]);

  const filtered = useMemo(() => {
    const list = type === 'All' ? opportunities : opportunities.filter((o) => o.type === type);
    return [...list].sort((a, b) => b.match - a.match);
  }, [type]);

  function apply(op) {
    setApplied((prev) => [...prev, op.id]);
    addToast(`Application started for ${op.role} at ${op.company}.`, 'success');
    setActive(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Opportunities Matched For You</h1>
        <p className="mt-1 text-navy-500">Ranked by your verified skills against real role requirements.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              type === t ? 'bg-navy-900 text-white' : 'bg-surface-100 text-navy-500 hover:bg-surface-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((op, i) => (
            <OpportunityCard key={op.id} opportunity={op} onView={setActive} delay={i * 0.05} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Briefcase} title="No opportunities in this category" description="Check back soon — CareerX continuously matches new opportunities to your profile." />
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.role} size="md">
        {active ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-navy-800">{active.company}</p>
                <p className="flex items-center gap-1.5 text-xs text-navy-400"><MapPin size={12} /> {active.location}</p>
              </div>
              <Badge tone={active.match >= 85 ? 'success' : active.match >= 65 ? 'warning' : 'danger'}>{active.match}% Match</Badge>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-navy-400">
              <Calendar size={12} /> Apply by {active.deadline}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-navy-400">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {active.skillsRequired.map((s) => {
                  const matched = active.skillsMatched.includes(s);
                  return (
                    <span
                      key={s}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                        matched ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {matched ? <Check size={12} strokeWidth={3} /> : <XIcon size={12} strokeWidth={3} />}
                      {s}
                    </span>
                  );
                })}
              </div>
            </div>

            {applied.includes(active.id) ? (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                Application started — track its status from your Notifications.
              </div>
            ) : (
              <Button className="w-full justify-center" onClick={() => apply(active)}>Apply Now</Button>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
