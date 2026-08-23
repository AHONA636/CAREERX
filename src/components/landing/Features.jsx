import { motion } from 'framer-motion';
import { BadgeCheck, Gauge, Map, Building2, ClipboardCheck, TrendingUp, Sparkles } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import SkillBadge from '../ui/SkillBadge';
import Badge from '../ui/Badge';
import ProgressRing from '../ui/ProgressRing';

function SkillVerificationVisual() {
  return (
    <div className="card-surface w-full max-w-sm space-y-3 rounded-2xl p-5">
      {[{ n: 'Python', c: 92 }, { n: 'React', c: 81 }, { n: 'SQL', c: 76 }].map((s) => (
        <div key={s.n} className="flex items-center justify-between rounded-xl bg-surface-50 px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-sm font-medium text-navy-700">
            <BadgeCheck size={15} className="text-emerald-500" /> {s.n}
          </span>
          <span className="text-sm font-semibold text-emerald-600">{s.c}%</span>
        </div>
      ))}
    </div>
  );
}

function SkillGapVisual() {
  return (
    <div className="card-surface w-full max-w-sm rounded-2xl p-5">
      <div className="flex flex-wrap gap-2">
        <SkillBadge name="Python" status="strong" />
        <SkillBadge name="DSA" status="warning" />
        <SkillBadge name="System Design" status="missing" />
        <SkillBadge name="SQL" status="strong" />
        <SkillBadge name="Cloud" status="missing" />
      </div>
    </div>
  );
}

function RoadmapVisual() {
  return (
    <div className="card-surface w-full max-w-sm space-y-3 rounded-2xl p-5">
      {['Profile Analysis', 'Skill Verification', 'Close DSA Gap'].map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${i < 2 ? 'bg-emerald-500' : 'bg-navy-800'}`}>
            {i + 1}
          </span>
          <span className="text-sm font-medium text-navy-700">{s}</span>
        </div>
      ))}
    </div>
  );
}

function MatchingVisual() {
  return (
    <div className="card-surface flex w-full max-w-sm items-center gap-4 rounded-2xl p-5">
      <ProgressRing value={91} size={72} strokeWidth={7} label={null} />
      <div>
        <p className="text-sm font-semibold text-navy-800">SWE Intern</p>
        <p className="text-xs text-navy-400">Atlassian</p>
        <Badge tone="success" className="mt-1.5">91% Match</Badge>
      </div>
    </div>
  );
}

function AssessmentVisual() {
  return (
    <div className="card-surface w-full max-w-sm space-y-2.5 rounded-2xl p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-navy-700">DSA Assessment</span>
        <Badge tone="warning">Medium</Badge>
      </div>
      <ProgressBar value={62} />
      <p className="text-xs text-navy-400">15 questions · 25 mins</p>
    </div>
  );
}

function ProgressVisual() {
  return (
    <div className="card-surface w-full max-w-sm space-y-3 rounded-2xl p-5">
      <div className="flex items-end gap-1.5">
        {[40, 55, 48, 65, 72, 60, 80].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-md bg-navy-800" style={{ height: `${h * 0.6}px`, opacity: 0.5 + i * 0.07 }} />
        ))}
      </div>
      <p className="text-xs font-medium text-navy-500">Consistency Score: <span className="font-bold text-emerald-600">84%</span></p>
    </div>
  );
}

function MentorVisual() {
  return (
    <div className="card-surface w-full max-w-sm rounded-2xl p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-violet-600">
        <Sparkles size={14} /> AI Mentor
      </div>
      <p className="mt-2 rounded-xl rounded-tl-sm bg-violet-50 px-3 py-2.5 text-sm text-navy-600">
        Prioritize DSA before system design — it's your fastest path to +9% readiness.
      </p>
    </div>
  );
}

const features = [
  {
    icon: BadgeCheck,
    eyebrow: 'Skill Verification',
    title: 'Skills you claim, proven by evidence.',
    description: 'Coding assessments, project analysis and practical tasks verify what you actually know — not what your resume says.',
    Visual: SkillVerificationVisual,
  },
  {
    icon: Gauge,
    eyebrow: 'AI-Powered Skill Gap Analysis',
    title: 'See exactly what stands between you and your goal.',
    description: 'CareerX compares your verified capabilities against real role requirements and flags strong, weak and missing skills instantly.',
    Visual: SkillGapVisual,
  },
  {
    icon: Map,
    eyebrow: 'Personalized Roadmaps',
    title: 'A roadmap built from your gaps, not a generic checklist.',
    description: 'Every learning action, project and assessment on your roadmap exists because it closes a specific gap toward your target role.',
    Visual: RoadmapVisual,
  },
  {
    icon: Building2,
    eyebrow: 'Career & Company Matching',
    title: 'Match scores for the roles that matter to you.',
    description: 'CareerX ranks internships, jobs and competitions by real fit — showing exactly which skills you have and which you still need.',
    Visual: MatchingVisual,
  },
  {
    icon: ClipboardCheck,
    eyebrow: 'Adaptive Assessments',
    title: 'Assessments that adapt as your skills grow.',
    description: 'Weekly adaptive tests track readiness in real time and resurface weak topics before they cost you an interview.',
    Visual: AssessmentVisual,
  },
  {
    icon: TrendingUp,
    eyebrow: 'Progress Tracking',
    title: 'Watch your readiness score climb, week over week.',
    description: 'Learning hours, skill growth and assessment performance roll up into one clear readiness trend — so progress is never invisible.',
    Visual: ProgressVisual,
  },
  {
    icon: Sparkles,
    eyebrow: 'AI Career Mentor',
    title: 'A mentor that knows your actual progress.',
    description: 'Ask what to learn next, how to close a gap faster, or which opportunities fit — and get answers grounded in your real data.',
    Visual: MentorVisual,
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-navy-400">What CareerX Does</p>
        <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-navy-900 sm:text-4xl">
          Every stage of your career journey, in one system.
        </h2>
      </div>

      <div className="mt-16 space-y-20">
        {features.map((f, i) => (
          <div
            key={f.eyebrow}
            className={`flex flex-col items-center gap-10 lg:flex-row lg:gap-16 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            <motion.div
              initial={{ opacity: 0, x: i % 2 === 1 ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                <f.icon size={19} strokeWidth={2} />
              </span>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-navy-400">{f.eyebrow}</p>
              <h3 className="mt-1.5 font-[var(--font-display)] text-2xl font-bold text-navy-900 text-balance">{f.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-navy-500">{f.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-1 justify-center"
            >
              <f.Visual />
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
