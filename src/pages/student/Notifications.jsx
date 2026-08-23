import { Sparkles, TrendingUp, Briefcase, AlertTriangle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const typeIcon = {
  warning: { icon: AlertTriangle, classes: 'bg-amber-50 text-amber-600' },
  ai: { icon: Sparkles, classes: 'bg-violet-50 text-violet-600' },
  success: { icon: TrendingUp, classes: 'bg-emerald-50 text-emerald-600' },
  match: { icon: Briefcase, classes: 'bg-navy-50 text-navy-600' },
};

export default function Notifications() {
  const { notificationState, markNotificationRead, markAllNotificationsRead } = useApp();
  const unread = notificationState.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-navy-500">{unread ? `${unread} unread` : "You're all caught up"}</p>
        </div>
        {unread > 0 ? <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>Mark all as read</Button> : null}
      </div>

      {notificationState.length ? (
        <div className="space-y-2">
          {notificationState.map((n, i) => {
            const { icon: Icon, classes } = typeIcon[n.type] || typeIcon.ai;
            return (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => markNotificationRead(n.id)}
                className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
                  n.read ? 'border-surface-200 bg-white' : 'border-navy-100 bg-navy-50/40'
                }`}
              >
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${classes}`}>
                  <Icon size={17} strokeWidth={2.25} />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-navy-800">{n.title}</span>
                    {!n.read ? <span className="h-2 w-2 rounded-full bg-navy-800" /> : null}
                  </span>
                  <span className="mt-1 block text-sm text-navy-500">{n.body}</span>
                  <span className="mt-1.5 block text-xs text-navy-300">{n.time}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Bell} title="No notifications yet" description="CareerX will notify you about skill gaps, matched opportunities and roadmap updates." />
      )}
    </div>
  );
}
