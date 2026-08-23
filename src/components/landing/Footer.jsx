import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-900 text-white">
            <Zap size={14} strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="font-[var(--font-display)] text-sm font-bold text-navy-900">CareerX</span>
        </div>
        <p className="text-xs text-navy-400">© 2026 CareerX by Team SkillNova. Built for students & professionals.</p>
      </div>
    </footer>
  );
}
