import { motion } from 'framer-motion';

export default function ProfileCard({ title, icon: Icon, action, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card-surface rounded-2xl p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
              <Icon size={15} strokeWidth={2.25} />
            </span>
          ) : null}
          <h3 className="font-[var(--font-display)] text-base font-semibold text-navy-900">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
