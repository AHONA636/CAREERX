import { NavLink, Link } from 'react-router-dom';
import { Zap, ArrowLeftRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RoleShell({ roleLabel, navItems, children }) {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-surface-50">
      <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
              <Zap size={16} strokeWidth={2.5} fill="currentColor" />
            </span>
            <span className="font-[var(--font-display)] text-lg font-bold text-navy-900">CareerX</span>
          </Link>
          <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-600">{roleLabel}</span>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-navy-900 text-white' : 'text-navy-500 hover:bg-surface-100 hover:text-navy-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/app" className="hidden items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-800 sm:flex">
              <ArrowLeftRight size={14} /> Student View
            </Link>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">
              {user.avatarInitials}
            </span>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-surface-100 px-5 py-2 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${isActive ? 'bg-navy-900 text-white' : 'bg-surface-100 text-navy-500'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
