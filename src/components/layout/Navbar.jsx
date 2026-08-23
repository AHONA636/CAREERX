import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Sparkles, LogOut, Settings, UserCircle, GraduationCap, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import NotificationPanel from './NotificationPanel';
import GlobalSearch from './GlobalSearch';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const { setSidebarOpen, setAiMentorOpen, user, notificationState, logout } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const unreadCount = notificationState.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-surface-200 bg-white/85 px-4 backdrop-blur-md sm:px-6">
      <button
        className="text-navy-500 hover:text-navy-800 lg:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setAiMentorOpen(true)}
          className="hidden items-center gap-2 rounded-xl bg-navy-900 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800 sm:flex"
        >
          <Sparkles size={15} />
          AI Mentor
        </button>
        <button
          onClick={() => setAiMentorOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white sm:hidden"
          aria-label="Open AI Mentor"
        >
          <Sparkles size={16} />
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-navy-500 hover:bg-surface-100"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-rose-500" />
            ) : null}
          </button>
          <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <div className="relative">
          <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 rounded-xl p-1 hover:bg-surface-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">
              {user.avatarInitials}
            </span>
          </button>
          <AnimatePresence>
            {profileOpen ? (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-surface-200 bg-white p-2 shadow-xl"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-navy-800">{user.name}</p>
                    <p className="text-xs text-navy-400">{user.email}</p>
                  </div>
                  <div className="my-1 h-px bg-surface-100" />
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/app/profile'); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-600 hover:bg-surface-50"
                  >
                    <UserCircle size={16} /> My Profile
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/app/settings'); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-600 hover:bg-surface-50"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <div className="my-1 h-px bg-surface-100" />
                  <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-navy-300">Other Views</p>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/educator'); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-600 hover:bg-surface-50"
                  >
                    <GraduationCap size={16} /> Educator Dashboard
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/admin'); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-600 hover:bg-surface-50"
                  >
                    <ShieldCheck size={16} /> Admin Dashboard
                  </button>
                  <div className="my-1 h-px bg-surface-100" />
                  <button
                    onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
