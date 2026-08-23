import {
  GraduationCap, FolderGit2, Award, Trophy, Target, Mail, MapPin, School, AlertCircle,
} from 'lucide-react';
import ProfileCard from '../../components/profile/ProfileCard';
import ProgressRing from '../../components/ui/ProgressRing';
import SkillBadge from '../../components/ui/SkillBadge';
import Badge from '../../components/ui/Badge';
import { profileData } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function Profile() {
  const { user, careerGoal, skills } = useApp();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">My Profile</h1>
        <p className="mt-1 text-navy-500">Everything CareerX uses to verify your skills and build your roadmap.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileCard title="Personal Information" icon={GraduationCap}>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-800 text-xl font-bold text-white">
                {user.avatarInitials}
              </span>
              <div>
                <p className="font-[var(--font-display)] text-lg font-semibold text-navy-900">{user.name}</p>
                <p className="flex items-center gap-1.5 text-sm text-navy-400"><Mail size={13} /> {user.email}</p>
                <p className="flex items-center gap-1.5 text-sm text-navy-400"><MapPin size={13} /> {user.location}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-surface-100 pt-5 sm:grid-cols-3">
              <InfoItem label="College" value={user.college} />
              <InfoItem label="Branch" value={user.branch} />
              <InfoItem label="Year" value={user.year} />
            </div>
          </ProfileCard>

          <ProfileCard title="Education" icon={School}>
            <div className="space-y-4">
              {profileData.education.map((e) => (
                <div key={e.degree} className="border-l-2 border-surface-200 pl-4">
                  <p className="text-sm font-semibold text-navy-800">{e.degree}</p>
                  <p className="text-sm text-navy-500">{e.institution}</p>
                  <p className="mt-0.5 text-xs text-navy-400">{e.duration} · {e.score}</p>
                </div>
              ))}
            </div>
          </ProfileCard>

          <ProfileCard title="Skills" icon={Award}>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <SkillBadge
                  key={s.id}
                  name={s.name}
                  status={!s.verified ? 'missing' : s.confidence >= s.required ? 'strong' : 'warning'}
                />
              ))}
            </div>
          </ProfileCard>

          <ProfileCard title="Projects" icon={FolderGit2}>
            <div className="space-y-4">
              {profileData.projects.map((p) => (
                <div key={p.title} className="rounded-xl bg-surface-50 p-4">
                  <p className="text-sm font-semibold text-navy-800">{p.title}</p>
                  <p className="mt-1 text-sm text-navy-500">{p.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.skills.map((s) => (
                      <span key={s} className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-navy-600">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ProfileCard>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ProfileCard title="Certifications" icon={Award}>
              <ul className="space-y-3">
                {profileData.certifications.map((c) => (
                  <li key={c.title}>
                    <p className="text-sm font-medium text-navy-800">{c.title}</p>
                    <p className="text-xs text-navy-400">{c.issuer} · {c.year}</p>
                  </li>
                ))}
              </ul>
            </ProfileCard>

            <ProfileCard title="Achievements" icon={Trophy}>
              <ul className="space-y-2.5">
                {profileData.achievements.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-navy-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {a}
                  </li>
                ))}
              </ul>
            </ProfileCard>
          </div>
        </div>

        <div className="space-y-6">
          <ProfileCard title="Profile Completeness">
            <div className="flex flex-col items-center py-2 text-center">
              <ProgressRing value={profileData.completeness} size={120} strokeWidth={10} color="var(--color-amber-500)" label="Complete" />
            </div>
            <div className="mt-4 space-y-2">
              {profileData.missing.map((m) => (
                <div key={m} className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                  <AlertCircle size={13} /> {m}
                </div>
              ))}
            </div>
          </ProfileCard>

          <ProfileCard title="Career Goal" icon={Target}>
            <p className="text-sm text-navy-500">Target Role</p>
            <p className="font-semibold text-navy-800">{careerGoal.targetRole}</p>
            <p className="mt-3 text-sm text-navy-500">Target Companies</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {careerGoal.targetCompanies.map((c) => (
                <Badge key={c} tone="navy">{c}</Badge>
              ))}
            </div>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-navy-400">{label}</p>
      <p className="text-sm font-medium text-navy-700">{value}</p>
    </div>
  );
}
