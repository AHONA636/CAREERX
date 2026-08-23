import { useState } from 'react';
import { Search, MoreVertical, Eye, Ban, RotateCcw, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import RoleShell from '../../components/layout/RoleShell';
import { adminNavItems } from './adminNav';
import ChartCard from '../../components/ui/ChartCard';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { userTable } from '../../data/educatorAdminMockData';
import { useApp } from '../../context/AppContext';

export default function UserManagement() {
  const { addToast } = useApp();
  const [users, setUsers] = useState(userTable);
  const [query, setQuery] = useState('');
  const [menuFor, setMenuFor] = useState(null);
  const [viewing, setViewing] = useState(null);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()));

  function toggleStatus(email) {
    const user = users.find((u) => u.email === email);
    if (!user) return;
    const nextStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, status: nextStatus } : u)));
    setMenuFor(null);
    addToast(
      `${user.name} ${nextStatus === 'Suspended' ? 'suspended' : 'reactivated'}.`,
      nextStatus === 'Suspended' ? 'warning' : 'success'
    );
  }

  function removeUser(email) {
    const user = users.find((u) => u.email === email);
    setUsers((prev) => prev.filter((u) => u.email !== email));
    setMenuFor(null);
    if (user) addToast(`${user.name} removed from CareerX.`, 'warning');
  }

  return (
    <RoleShell roleLabel="Admin" navItems={adminNavItems}>
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">User Management</h1>
          <p className="mt-1 text-navy-500">Manage students, educators and admin accounts.</p>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            aria-label="Search users by name or email"
            className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-9 pr-3 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
        </div>

        <ChartCard title={`All Users (${filtered.length})`}>
          <div className="scrollbar-thin -mx-2 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-navy-400">
                  <th className="px-2 pb-3 font-semibold">Name</th>
                  <th className="px-2 pb-3 font-semibold">Email</th>
                  <th className="px-2 pb-3 font-semibold">Role</th>
                  <th className="px-2 pb-3 font-semibold">Status</th>
                  <th className="px-2 pb-3 font-semibold">Joined</th>
                  <th className="px-2 pb-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.email} className="border-t border-surface-100">
                    <td className="px-2 py-3 font-medium text-navy-800">{u.name}</td>
                    <td className="px-2 py-3 text-navy-500">{u.email}</td>
                    <td className="px-2 py-3 text-navy-500">{u.role}</td>
                    <td className="px-2 py-3">
                      <Badge tone={u.status === 'At Risk' ? 'danger' : u.status === 'Suspended' ? 'warning' : 'success'}>{u.status}</Badge>
                    </td>
                    <td className="px-2 py-3 text-navy-400">{u.joined}</td>
                    <td className="relative px-2 py-3 text-right">
                      <button
                        onClick={() => setMenuFor(menuFor === u.email ? null : u.email)}
                        className="rounded-lg p-1.5 text-navy-300 hover:bg-surface-100 hover:text-navy-600"
                        aria-label={`More actions for ${u.name}`}
                        aria-expanded={menuFor === u.email}
                      >
                        <MoreVertical size={16} />
                      </button>
                      <AnimatePresence>
                        {menuFor === u.email ? (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setMenuFor(null)} />
                            <motion.div
                              initial={{ opacity: 0, y: -6, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -6, scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-2 top-full z-50 mt-1 w-44 rounded-xl border border-surface-200 bg-white p-1.5 text-left shadow-xl"
                            >
                              <button
                                onClick={() => { setViewing(u); setMenuFor(null); }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-600 hover:bg-surface-50"
                              >
                                <Eye size={14} /> View Details
                              </button>
                              <button
                                onClick={() => toggleStatus(u.email)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-600 hover:bg-surface-50"
                              >
                                {u.status === 'Suspended' ? <RotateCcw size={14} /> : <Ban size={14} />}
                                {u.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                              </button>
                              <button
                                onClick={() => removeUser(u.email)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            </motion.div>
                          </>
                        ) : null}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name}>
        {viewing ? (
          <div className="space-y-3 text-sm">
            <Row label="Email" value={viewing.email} />
            <Row label="Role" value={viewing.role} />
            <Row label="Status" value={viewing.status} />
            <Row label="Joined" value={viewing.joined} />
          </div>
        ) : null}
      </Modal>
    </RoleShell>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-100 pb-2 last:border-0">
      <span className="text-navy-400">{label}</span>
      <span className="font-medium text-navy-800">{value}</span>
    </div>
  );
}
