import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, TrendingUp, Briefcase, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const typeIcon = {
  warning: { icon: AlertTriangle, classes: 'bg-amber-50 text-amber-600' },
  ai: { icon: Sparkles, classes: 'bg-violet-50 text-violet-600' },
  success: { icon: TrendingUp, classes: 'bg-emerald-50 text-emerald-600' },
  match: { icon: Briefcase, classes: 'bg-navy-50 text-navy-600' },
};

export default function NotificationPanel({ open, onClose }) {
  const { notificationState, markNotificationRead, markAllNotificationsRead } = useApp();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-[22rem] rounded-2xl border border-surface-200 bg-white p-2 shadow-xl"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <p className="font-[var(--font-display)] text-sm font-semibold text-navy-900">Notifications</p>
              <button onClick={markAllNotificationsRead} className="text-xs font-medium text-navy-400 hover:text-navy-700">
                Mark all read
              </button>
            </div>
            <div className="scrollbar-thin max-h-96 space-y-1 overflow-y-auto">
              {notificationState.map((n) => {
                const { icon: Icon, classes } = typeIcon[n.type] || typeIcon.ai;
                return (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-50 ${
                      !n.read ? 'bg-navy-50/50' : ''
                    }`}
                  >
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${classes}`}>
                      <Icon size={14} strokeWidth={2.5} />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-navy-800">{n.title}</span>
                        {!n.read ? <span className="h-1.5 w-1.5 rounded-full bg-navy-800" /> : null}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-navy-400">{n.body}</span>
                      <span className="mt-1 block text-[11px] text-navy-300">{n.time}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <Link
              to="/app/notifications"
              onClick={onClose}
              className="mt-1 block rounded-xl px-3 py-2 text-center text-xs font-semibold text-navy-500 hover:bg-surface-50"
            >
              View all notifications
            </Link>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
