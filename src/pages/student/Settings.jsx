import { useState } from 'react';
import { User, Bell, Shield, Save, LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../../components/profile/ProfileCard';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-navy-900' : 'bg-surface-300'}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function Settings() {
  const { user, setUser, addToast, logout } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [prefs, setPrefs] = useState({ skillGap: true, opportunities: true, weeklyDigest: false, mentorTips: true });
  const [confirmOpen, setConfirmOpen] = useState(false);

  function saveProfile() {
    setUser((prev) => ({ ...prev, name, email }));
    addToast('Account details updated.', 'success');
  }

  function deleteAccount() {
    setConfirmOpen(false);
    addToast('Account deletion requested (mock) — logging you out.', 'warning');
    logout();
    navigate('/');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Settings</h1>
        <p className="mt-1 text-navy-500">Manage your account, notifications and privacy preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileCard title="Account" icon={User}>
            <div className="space-y-4">
              <div>
                <label htmlFor="settings-name" className="mb-1.5 block text-sm font-medium text-navy-700">Full Name</label>
                <input
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-2.5 text-sm text-navy-800 focus:border-navy-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-100"
                />
              </div>
              <div>
                <label htmlFor="settings-email" className="mb-1.5 block text-sm font-medium text-navy-700">Email</label>
                <input
                  id="settings-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-2.5 text-sm text-navy-800 focus:border-navy-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-100"
                />
              </div>
              <Button size="sm" icon={Save} onClick={saveProfile}>Save Changes</Button>
            </div>
          </ProfileCard>

          <ProfileCard title="Notification Preferences" icon={Bell}>
            <div className="divide-y divide-surface-100">
              {[
                { key: 'skillGap', label: 'Skill gap alerts', desc: 'Notify me when a new gap is detected' },
                { key: 'opportunities', label: 'Opportunity matches', desc: 'Notify me about new matched roles' },
                { key: 'weeklyDigest', label: 'Weekly progress digest', desc: 'A weekly summary of your readiness score' },
                { key: 'mentorTips', label: 'AI Mentor tips', desc: 'Proactive suggestions from your AI Mentor' },
              ].map((p) => (
                <div key={p.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-navy-800">{p.label}</p>
                    <p className="text-xs text-navy-400">{p.desc}</p>
                  </div>
                  <Toggle checked={prefs[p.key]} onChange={(v) => setPrefs((prev) => ({ ...prev, [p.key]: v }))} />
                </div>
              ))}
            </div>
          </ProfileCard>

          <ProfileCard title="Privacy & Data" icon={Shield}>
            <p className="text-sm leading-relaxed text-navy-500">
              CareerX uses your academic, behavioral and engagement data only to build your Learning Digital Twin and personalized roadmap. You can request an export or deletion of your data at any time.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" onClick={() => addToast('Data export started — check your email.', 'info')}>Export My Data</Button>
              <Button variant="danger" size="sm" icon={Trash2} onClick={() => setConfirmOpen(true)}>Delete Account</Button>
            </div>
          </ProfileCard>
        </div>

        <ProfileCard title="Session">
          <p className="text-sm text-navy-500">Signed in as</p>
          <p className="font-semibold text-navy-800">{user.email}</p>
          <Button variant="secondary" size="sm" icon={LogOut} className="mt-4 w-full justify-center" onClick={() => { logout(); navigate('/'); }}>
            Log Out
          </Button>
        </ProfileCard>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete your account?"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={deleteAccount}>Delete Account</Button>
          </>
        }
      >
        <p className="text-sm text-navy-500">
          This will permanently remove your profile, roadmap and progress history. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
