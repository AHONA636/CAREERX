import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const rows = [
  { feature: 'Skills Verification', others: false, careerx: true },
  { feature: 'Behavior Analysis', others: false, careerx: true },
  { feature: 'Company-Specific Prep', others: false, careerx: true },
  { feature: 'Continuous Feedback Loop', others: false, careerx: true },
  { feature: 'Failure Handling / Alternative Path', others: false, careerx: true },
  { feature: 'Career Guidance', others: true, careerx: true },
  { feature: 'Learning Resources', others: true, careerx: true },
];

export default function WhyDifferent() {
  return (
    <section id="why" className="border-y border-surface-200 bg-navy-900 py-20">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-navy-400">Why CareerX Is Different</p>
        <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-white sm:text-4xl">
          Existing platforms give you pieces. CareerX gives you the loop.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-navy-300">
          LMS platforms teach. Predictors guess. Recommenders suggest. None of them verify your skills or stay with you until you're placed. CareerX connects every stage into one continuous, evidence-based system.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left"
        >
          <div className="grid grid-cols-3 border-b border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-navy-400">
            <span>Capability</span>
            <span className="text-center">Other Platforms</span>
            <span className="text-center text-emerald-400">CareerX</span>
          </div>
          {rows.map((r) => (
            <div key={r.feature} className="grid grid-cols-3 items-center border-b border-white/5 px-6 py-3.5 last:border-b-0">
              <span className="text-sm text-navy-200">{r.feature}</span>
              <span className="flex justify-center">
                {r.others ? <Check size={16} className="text-navy-400" /> : <X size={16} className="text-rose-400/70" />}
              </span>
              <span className="flex justify-center">
                <Check size={16} className="text-emerald-400" />
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
