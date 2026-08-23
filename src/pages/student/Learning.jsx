import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Layers, Clock, Plus, Check } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { learningModules, recommendedProjects } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function Learning() {
  const { addToast } = useApp();
  const [addedProjects, setAddedProjects] = useState([]);
  const [progressById, setProgressById] = useState(() =>
    Object.fromEntries(learningModules.map((m) => [m.id, m.progress]))
  );

  function addProject(project) {
    setAddedProjects((prev) => [...prev, project.id]);
    addToast(`"${project.title}" added to your roadmap.`, 'success');
  }

  function continueLearning(module) {
    const bump = 3 + Math.floor(Math.random() * 5);
    const next = Math.min(95, progressById[module.id] + bump);
    setProgressById((prev) => ({ ...prev, [module.id]: next }));
    addToast(
      next >= 95
        ? `"${module.title}" is almost complete — take the assessment to verify it.`
        : `Nice work — logged a session on "${module.title}" (+${bump}%).`,
      'success'
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Learning & Projects</h1>
        <p className="mt-1 text-navy-500">Recommended actions based on your current skill gaps.</p>
      </div>

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-[var(--font-display)] text-lg font-semibold text-navy-900">
          <Sparkles size={17} className="text-violet-500" /> Recommended For You
        </h2>
        <div className="space-y-5">
          {learningModules.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="card-surface rounded-2xl p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-[var(--font-display)] text-lg font-semibold text-navy-900">{m.title}</h3>
                    <Badge tone={m.priority.startsWith('High') ? 'danger' : 'warning'}>{m.priority}</Badge>
                  </div>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-navy-500">
                    <span className="font-semibold text-navy-700">Why: </span>{m.reason}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-[var(--font-display)] text-2xl font-bold text-navy-900">{progressById[m.id]}%</p>
                  <p className="text-xs text-navy-400">Progress</p>
                </div>
              </div>

              <div className="mt-4 max-w-md">
                <ProgressBar value={progressById[m.id]} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {m.topics.map((t) => (
                  <span key={t} className="rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-navy-600">{t}</span>
                ))}
              </div>

              <Button size="sm" variant="secondary" className="mt-5" iconRight={ArrowRight} onClick={() => continueLearning(m)}>
                Continue Learning
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-[var(--font-display)] text-lg font-semibold text-navy-900">
          <Layers size={17} className="text-navy-700" /> Recommended Projects
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedProjects.map((p, i) => {
            const added = addedProjects.includes(p.id);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="card-surface flex flex-col gap-4 rounded-2xl p-5"
              >
                <div>
                  <h3 className="font-[var(--font-display)] text-base font-semibold text-navy-900">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{p.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.skills.map((s) => (
                    <span key={s} className="rounded-lg bg-surface-100 px-2.5 py-1 text-xs font-medium text-navy-600">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-navy-400">
                  <span className="flex items-center gap-1"><Layers size={12} /> {p.difficulty}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {p.duration}</span>
                </div>
                <Button
                  size="sm"
                  variant={added ? 'success' : 'primary'}
                  className="mt-auto w-full justify-center"
                  icon={added ? Check : Plus}
                  onClick={() => !added && addProject(p)}
                  disabled={added}
                >
                  {added ? 'Added to Roadmap' : 'Add to Roadmap'}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
