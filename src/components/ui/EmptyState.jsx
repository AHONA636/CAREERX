import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-300 bg-surface-50/60 px-6 py-14 text-center ${className}`}>
      {Icon ? (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-navy-400">
          <Icon size={22} strokeWidth={1.75} />
        </span>
      ) : null}
      <h3 className="font-[var(--font-display)] text-base font-semibold text-navy-800">{title}</h3>
      {description ? <p className="mt-1.5 max-w-sm text-sm text-navy-400">{description}</p> : null}
      {actionLabel ? (
        <Button size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
