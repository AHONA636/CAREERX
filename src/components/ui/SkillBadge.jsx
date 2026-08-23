import { Check, AlertTriangle, X } from 'lucide-react';

const statusMap = {
  strong: { icon: Check, classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  warning: { icon: AlertTriangle, classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  missing: { icon: X, classes: 'bg-rose-50 text-rose-600 border-rose-200' },
};

export default function SkillBadge({ name, status = 'strong', className = '' }) {
  const { icon: Icon, classes } = statusMap[status] || statusMap.strong;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${classes} ${className}`}>
      <Icon size={13} strokeWidth={2.75} />
      {name}
    </span>
  );
}
