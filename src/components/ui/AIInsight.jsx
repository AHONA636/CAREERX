import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIInsight({ children, label = 'AI Insight', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3 ${className}`}
    >
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
        <Sparkles size={13} strokeWidth={2.5} />
      </span>
      <p className="text-sm leading-relaxed text-navy-700">
        <span className="mr-1.5 font-semibold text-violet-700">{label}</span>
        {children}
      </p>
    </motion.div>
  );
}
