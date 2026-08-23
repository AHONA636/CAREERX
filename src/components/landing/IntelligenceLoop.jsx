import { motion } from 'framer-motion';
import { UserCircle, BadgeCheck, Gauge, Map, TrendingUp, Briefcase, ArrowDown } from 'lucide-react';

const loopSteps = [
  { icon: UserCircle, label: 'Profile' },
  { icon: BadgeCheck, label: 'Verify Skills' },
  { icon: Gauge, label: 'Find Skill Gaps' },
  { icon: Map, label: 'Build Roadmap' },
  { icon: TrendingUp, label: 'Track Progress' },
  { icon: Briefcase, label: 'Match Opportunities' },
];

export default function IntelligenceLoop() {
  return (
    <section id="how-it-works" className="border-y border-surface-200 bg-surface-50 py-20">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-navy-400">How CareerX Works</p>
        <h2 className="mx-auto mt-2 max-w-2xl font-[var(--font-display)] text-3xl font-bold text-navy-900 text-balance sm:text-4xl">
          One continuous intelligence loop, from learning to placement.
        </h2>

        <div className="mt-14 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-3 sm:gap-y-8">
          {loopSteps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex w-40 flex-col items-center gap-2 rounded-2xl border border-surface-200 bg-white px-4 py-5 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <step.icon size={20} strokeWidth={2} />
                </span>
                <span className="text-sm font-semibold text-navy-800">{step.label}</span>
              </motion.div>

              {i < loopSteps.length - 1 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 + 0.15 }}
                  className="text-navy-300 sm:rotate-[-90deg]"
                >
                  <ArrowDown size={18} className="sm:hidden" />
                  <span className="hidden text-lg sm:inline">→</span>
                </motion.div>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-sm leading-relaxed text-navy-400">
          If your goal isn't reached, the loop routes you toward an alternative pathway or GATE preparation — CareerX never leaves you without a next step.
        </p>
      </div>
    </section>
  );
}
