import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Circle, Filter } from 'lucide-react';
import SkillCard from '../../components/ui/SkillCard';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';

const filters = ['All', 'Verified', 'Not Verified'];

export default function SkillVerification() {
  const { skills, verifySkill } = useApp();
  const [filter, setFilter] = useState('All');
  const [activeSkill, setActiveSkill] = useState(null);
  const [assessing, setAssessing] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'Verified') return skills.filter((s) => s.verified);
    if (filter === 'Not Verified') return skills.filter((s) => !s.verified);
    return skills;
  }, [skills, filter]);

  const verifiedCount = skills.filter((s) => s.verified).length;

  function startAssessment(skill) {
    setActiveSkill(skill);
    setAssessing(false);
  }

  function runAssessment() {
    setAssessing(true);
    setTimeout(() => {
      const confidence = Math.floor(70 + Math.random() * 25);
      verifySkill(activeSkill.id, confidence);
      setAssessing(false);
      setActiveSkill(null);
    }, 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Skill Verification</h1>
        <p className="mt-1 text-navy-500">CareerX verifies skills through assessments and project analysis — not self-reports.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          <BadgeCheck size={16} /> {verifiedCount} of {skills.length} skills verified
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-navy-300" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === f ? 'bg-navy-900 text-white' : 'bg-surface-100 text-navy-500 hover:bg-surface-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill, i) => (
          <SkillCard key={skill.id} skill={skill} onAssess={startAssessment} delay={i * 0.05} />
        ))}
      </motion.div>

      <Modal open={!!activeSkill} onClose={() => setActiveSkill(null)} title={`Verify ${activeSkill?.name}`} size="sm">
        {!assessing ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-navy-500">
              This quick assessment includes coding questions and a practical task to verify your {activeSkill?.name} proficiency.
            </p>
            <div className="rounded-xl bg-surface-50 p-4 text-sm text-navy-600">
              <p className="flex items-center gap-2"><Circle size={8} className="fill-navy-400 text-navy-400" /> 10 questions · ~15 minutes</p>
              <p className="mt-1.5 flex items-center gap-2"><Circle size={8} className="fill-navy-400 text-navy-400" /> Auto-graded with confidence scoring</p>
            </div>
            <Button className="w-full justify-center" onClick={runAssessment}>Begin Assessment</Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy-800 border-t-transparent" />
            <p className="text-sm font-medium text-navy-600">Evaluating your responses…</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
