import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BadgeCheck, Briefcase, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { opportunities } from '../../data/mockData';
import { studentNavItems } from './navItems';

const PAGE_RESULTS = studentNavItems
  .filter((item) => !item.end)
  .map((item) => ({ type: 'Page', label: item.label, to: item.to, icon: Compass }));

export default function GlobalSearch() {
  const { skills } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const blurTimeout = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const pageMatches = PAGE_RESULTS.filter((p) => p.label.toLowerCase().includes(q));
    const skillMatches = skills
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((s) => ({
        type: 'Skill',
        label: s.name,
        sublabel: s.verified ? 'Verified' : 'Not verified',
        to: '/app/skills',
        icon: BadgeCheck,
      }));
    const opportunityMatches = opportunities
      .filter((o) => o.role.toLowerCase().includes(q) || o.company.toLowerCase().includes(q))
      .slice(0, 4)
      .map((o) => ({
        type: 'Opportunity',
        label: o.role,
        sublabel: o.company,
        to: '/app/opportunities',
        icon: Briefcase,
      }));

    return [...pageMatches, ...skillMatches, ...opportunityMatches].slice(0, 8);
  }, [query, skills]);

  function goTo(to) {
    navigate(to);
    setQuery('');
    setOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (results[0]) goTo(results[0].to);
  }

  return (
    <div className="relative hidden max-w-md flex-1 sm:block">
      <form onSubmit={handleSubmit}>
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => { blurTimeout.current = setTimeout(() => setOpen(false), 120); }}
          placeholder="Search skills, roadmap, opportunities…"
          aria-label="Search CareerX"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="global-search-results"
          autoComplete="off"
          className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2 pl-9 pr-3 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-100"
        />
      </form>

      {open && query.trim() ? (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-surface-200 bg-white p-2 shadow-xl"
        >
          {results.length ? (
            results.map((r, i) => (
              <button
                key={`${r.type}-${r.label}-${i}`}
                role="option"
                onMouseDown={(e) => { e.preventDefault(); goTo(r.to); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                  <r.icon size={14} strokeWidth={2.25} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-navy-800">{r.label}</span>
                  <span className="block text-xs text-navy-400">{r.sublabel || r.type}</span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-center text-sm text-navy-400">No results for "{query}"</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
