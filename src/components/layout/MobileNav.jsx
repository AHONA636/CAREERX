import { NavLink } from 'react-router-dom';
import { mobileNavItems } from './navItems';

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-surface-200 bg-white/95 px-1 py-1.5 backdrop-blur-md lg:hidden">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-navy-900' : 'text-navy-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={19} strokeWidth={isActive ? 2.4 : 2} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
