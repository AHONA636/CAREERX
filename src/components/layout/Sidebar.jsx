import { Link, NavLink } from 'react-router-dom';
import { X, Zap } from 'lucide-react';
import { studentNavItems } from './navItems';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, careerGoal } = useApp();

  return (
    <>
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-navy-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-surface-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/app" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
              <Zap size={16} strokeWidth={2.5} fill="currentColor" />
            </span>
            <span className="font-[var(--font-display)] text-lg font-bold text-navy-900">CareerX</span>
          </Link>
          <button
            className="text-navy-400 hover:text-navy-700 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {studentNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-navy-500 hover:bg-surface-100 hover:text-navy-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} strokeWidth={2} className={isActive ? 'text-white' : 'text-navy-400 group-hover:text-navy-700'} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-xl border border-surface-200 bg-surface-50 p-4">
          <p className="text-xs font-semibold text-navy-400">Target Role</p>
          <p className="mt-1 text-sm font-semibold text-navy-800">{careerGoal.targetRole}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-navy-400">
            <span>Readiness</span>
            <span className="font-bold text-emerald-600">{careerGoal.readinessScore}%</span>
          </div>
        </div>
      </aside>
    </>
  );
}
