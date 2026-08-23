import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const iconMap = {
  success: { icon: CheckCircle2, classes: 'text-emerald-600 bg-emerald-50' },
  info: { icon: Info, classes: 'text-navy-600 bg-navy-50' },
  warning: { icon: AlertTriangle, classes: 'text-amber-600 bg-amber-50' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const { icon: Icon, classes } = iconMap[t.variant] || iconMap.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-surface-200 bg-white p-4 shadow-lg"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${classes}`}>
                <Icon size={15} strokeWidth={2.5} />
              </span>
              <p className="flex-1 text-sm font-medium text-navy-800">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-navy-300 transition-colors hover:text-navy-600"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
