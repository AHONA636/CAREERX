const tones = {
  neutral: 'bg-surface-100 text-navy-600 border-surface-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-rose-50 text-rose-600 border-rose-100',
  ai: 'bg-violet-50 text-violet-600 border-violet-100',
  navy: 'bg-navy-900 text-white border-navy-900',
};

export default function Badge({ children, tone = 'neutral', icon: Icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${tones[tone]} ${className}`}
    >
      {Icon ? <Icon size={12} strokeWidth={2.5} /> : null}
      {children}
    </span>
  );
}
