import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CareerGoalCard({ label, selected, onClick, icon: Icon, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition-all ${
        selected
          ? 'border-navy-900 bg-navy-900 text-white shadow-md'
          : 'border-surface-200 bg-white text-navy-700 hover:border-navy-300 hover:shadow-sm'
      }`}
    >
      {Icon ? (
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-white/15' : 'bg-surface-100'}`}>
          <Icon size={17} strokeWidth={2} />
        </span>
      ) : null}
      <span className="font-medium">{label}</span>
      {selected ? (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check size={12} strokeWidth={3} />
        </span>
      ) : null}
    </motion.button>
  );
}
