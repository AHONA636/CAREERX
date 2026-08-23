import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Zap, GraduationCap, Briefcase, ArrowRight, ArrowLeft, Sparkles,
  Code2, BarChart3, Cpu, Layout, Server, Cloud, ShieldCheck, MoreHorizontal,
} from 'lucide-react';
import Button from '../components/ui/Button';
import CareerGoalCard from '../components/goals/CareerGoalCard';
import ProgressRing from '../components/ui/ProgressRing';
import { careerRoleOptions, companyOptions, timelineOptions } from '../data/mockData';
import { useApp } from '../context/AppContext';

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

const personaOptions = [
  { key: 'student', label: 'Student preparing for campus placements', icon: GraduationCap },
  { key: 'professional', label: 'Working professional pursuing a career switch', icon: Briefcase },
];

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const { completeOnboarding, user, careerGoal } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState('student');
  const [role, setRole] = useState('Software Engineer');
  const [companies, setCompanies] = useState(['Google', 'Amazon']);
  const [timeline, setTimeline] = useState('6 months');
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  function toggleCompany(c) {
    setCompanies((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      setAnalyzing(true);
    }
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  useEffect(() => {
    if (!analyzing) return;
    const t = setTimeout(() => setDone(true), 2200);
    return () => clearTimeout(t);
  }, [analyzing]);

  function finish() {
    completeOnboarding({
      targetRole: role === 'Software Engineer' ? 'Software Development Engineer' : role,
      targetCompanies: companies.length ? companies : ['Google'],
      timeline,
    });
    navigate('/app');
  }

  if (analyzing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 px-6">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key="loading" exit={{ opacity: 0, scale: 0.96 }} className="flex flex-col items-center text-center">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-white"
              >
                <Sparkles size={26} />
              </motion.span>
              <h2 className="mt-6 font-[var(--font-display)] text-xl font-bold text-navy-900">CareerX is analyzing your profile…</h2>
              <p className="mt-2 max-w-sm text-sm text-navy-500">Mapping verified skills against {role} requirements at your target companies.</p>
              <div className="mt-6 w-64 overflow-hidden rounded-full bg-surface-200">
                <motion.div
                  className="h-1.5 bg-navy-800"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.1, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card-surface w-full max-w-md rounded-3xl p-8 text-center"
            >
              <p className="text-sm font-semibold text-navy-400">Your Career Readiness</p>
              <div className="my-6 flex justify-center">
                <ProgressRing value={careerGoal.readinessScore} size={140} strokeWidth={11} label="Career Ready" />
              </div>
              <h3 className="font-[var(--font-display)] text-lg font-bold text-navy-900">Here's where you stand, {user.firstName}.</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                CareerX has built your personalized roadmap toward <strong className="text-navy-800">{role}</strong> roles at{' '}
                <strong className="text-navy-800">{companies.slice(0, 2).join(', ')}</strong>. You're ready to start closing your next skill gap.
              </p>
              <Button size="lg" className="mt-7 w-full justify-center" iconRight={ArrowRight} onClick={finish}>
                Go to My Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <header className="flex h-16 items-center justify-between border-b border-surface-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
            <Zap size={16} strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="font-[var(--font-display)] text-lg font-bold text-navy-900">CareerX</span>
        </div>
        <p className="text-xs font-medium text-navy-400">Step {step + 1} of {TOTAL_STEPS}</p>
      </header>

      <div className="h-1 w-full bg-surface-200">
        <motion.div
          className="h-full bg-navy-900"
          animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <div className="mx-auto max-w-2xl px-6 py-14">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900">Which best describes you?</h1>
              <p className="mt-1.5 text-sm text-navy-500">CareerX tailors your roadmap based on where you're starting from.</p>
              <div className="mt-8 space-y-3">
                {personaOptions.map((p) => (
                  <CareerGoalCard key={p.key} label={p.label} icon={p.icon} selected={persona === p.key} onClick={() => setPersona(p.key)} />
                ))}
              </div>
            </motion.div>
          ) : null}

          {step === 1 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900">What career are you targeting?</h1>
              <p className="mt-1.5 text-sm text-navy-500">CareerX will map your verified skills against this role's requirements.</p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {careerRoleOptions.map((r) => (
                  <CareerGoalCard key={r} label={r} icon={roleIcons[r]} selected={role === r} onClick={() => setRole(r)} />
                ))}
              </div>
            </motion.div>
          ) : null}

          {step === 2 ? (
            <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900">What companies interest you?</h1>
              <p className="mt-1.5 text-sm text-navy-500">Select as many as you like — you can change this anytime.</p>
              <div className="mt-8 flex flex-wrap gap-2.5">
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
            </motion.div>
          ) : null}

          {step === 3 ? (
            <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900">What's your target timeline?</h1>
              <p className="mt-1.5 text-sm text-navy-500">This sets the pace of your personalized roadmap.</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {timelineOptions.map((t) => (
                  <CareerGoalCard key={t} label={t} selected={timeline === t} onClick={() => setTimeline(t)} />
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" icon={ArrowLeft} onClick={back} disabled={step === 0} className={step === 0 ? 'invisible' : ''}>
            Back
          </Button>
          <Button iconRight={ArrowRight} onClick={next}>
            {step === TOTAL_STEPS - 1 ? 'Analyze My Profile' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
