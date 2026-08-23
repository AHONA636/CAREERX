import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AIChat from './AIChat';

export default function AIMentorDrawer() {
  const { aiMentorOpen, setAiMentorOpen } = useApp();

  return (
    <AnimatePresence>
      {aiMentorOpen ? (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px]"
            onClick={() => setAiMentorOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h2 className="font-[var(--font-display)] text-base font-semibold text-navy-900">CareerX AI Mentor</h2>
                  <p className="text-xs text-navy-400">Your personal career intelligence assistant</p>
                </div>
              </div>
              <button
                onClick={() => setAiMentorOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-navy-400 hover:bg-surface-100 hover:text-navy-700"
                aria-label="Close AI Mentor"
              >
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <AIChat />
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
