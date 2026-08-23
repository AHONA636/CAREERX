import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';

const points = [
  { icon: ShieldCheck, text: 'Skills verified through real assessments, not self-reports' },
  { icon: TrendingUp, text: 'A readiness score that updates as you learn' },
  { icon: Sparkles, text: 'An AI mentor grounded in your actual progress' },
];

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link to="/" className="mb-10 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
            <Zap size={16} strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="font-[var(--font-display)] text-lg font-bold text-navy-900">CareerX</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto w-full max-w-sm">
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-sm text-navy-500">{subtitle}</p> : null}
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>

      <div className="relative hidden overflow-hidden bg-navy-900 lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-navy-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative">
          <p className="font-[var(--font-display)] text-3xl font-bold leading-tight text-white text-balance">
            Verified skills. Real roadmaps. Career outcomes.
          </p>
          <div className="mt-10 space-y-5">
            {points.map((p) => (
              <div key={p.text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-400">
                  <p.icon size={16} />
                </span>
                <p className="text-sm leading-relaxed text-navy-200">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
