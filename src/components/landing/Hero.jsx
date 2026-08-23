import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import ProgressRing from '../ui/ProgressRing';
import Badge from '../ui/Badge';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-navy-50 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Badge tone="ai" icon={Sparkles}>AI-Powered Career Intelligence</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 font-[var(--font-display)] text-4xl font-bold leading-[1.1] text-navy-900 text-balance sm:text-5xl lg:text-[3.4rem]"
          >
            Turn Your Skills Into Your Career.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-5 max-w-lg text-lg leading-relaxed text-navy-500"
          >
            CareerX verifies what you actually know, identifies your skill gaps, and builds a personalized roadmap from learning to placement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link to="/signup">
              <Button size="lg" iconRight={ArrowRight}>Get Started</Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="secondary" icon={PlayCircle}>Explore CareerX</Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-400"
          >
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Built for students & professionals</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="rounded-3xl border border-surface-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-navy-400">Target Career</p>
                <p className="font-[var(--font-display)] text-base font-semibold text-navy-900">Software Development Engineer</p>
              </div>
              <Badge tone="success" icon={CheckCircle2}>On Track</Badge>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <ProgressRing value={72} size={140} strokeWidth={10} label="Career Ready" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-50 p-3">
                <p className="text-xs text-navy-400">Skills Verified</p>
                <p className="mt-0.5 font-[var(--font-display)] text-lg font-bold text-navy-900">14 / 20</p>
              </div>
              <div className="rounded-xl bg-surface-50 p-3">
                <p className="text-xs text-navy-400">Skill Gap</p>
                <p className="mt-0.5 font-[var(--font-display)] text-lg font-bold text-navy-900">6 skills</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute -left-8 -bottom-6 hidden rounded-2xl border border-violet-100 bg-white p-3 shadow-lg sm:block"
          >
            <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-600"><Sparkles size={12} /> AI Insight</p>
            <p className="mt-1 max-w-[11rem] text-xs text-navy-500">Prioritize DSA before System Design</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
