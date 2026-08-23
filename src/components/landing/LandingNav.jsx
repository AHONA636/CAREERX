import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const links = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features', label: 'Features' },
  { href: '#why', label: 'Why CareerX' },
];

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
            <Zap size={16} strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="font-[var(--font-display)] text-lg font-bold text-navy-900">CareerX</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-navy-500 transition-colors hover:text-navy-900">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-semibold text-navy-600 hover:text-navy-900">Log In</Link>
          <Link to="/signup"><Button size="sm">Get Started</Button></Link>
        </div>

        <button className="text-navy-600 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-surface-200 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-navy-600">
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-3">
              <Link to="/login" className="flex-1"><Button variant="secondary" size="sm" className="w-full justify-center">Log In</Button></Link>
              <Link to="/signup" className="flex-1"><Button size="sm" className="w-full justify-center">Get Started</Button></Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
