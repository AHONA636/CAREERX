import {
  LayoutDashboard, UserCircle, BadgeCheck, Target, Gauge,
  Map, BookOpen, ClipboardCheck, TrendingUp, Briefcase, Sparkles, Settings,
} from 'lucide-react';

export const studentNavItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/profile', label: 'My Profile', icon: UserCircle },
  { to: '/app/skills', label: 'Skills', icon: BadgeCheck },
  { to: '/app/goals', label: 'Career Goals', icon: Target },
  { to: '/app/skill-gap', label: 'Skill Gap', icon: Gauge },
  { to: '/app/roadmap', label: 'Roadmap', icon: Map },
  { to: '/app/learning', label: 'Learning', icon: BookOpen },
  { to: '/app/assessments', label: 'Assessments', icon: ClipboardCheck },
  { to: '/app/progress', label: 'Progress', icon: TrendingUp },
  { to: '/app/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/app/mentor', label: 'AI Mentor', icon: Sparkles },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export const mobileNavItems = [
  { to: '/app', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/app/roadmap', label: 'Roadmap', icon: Map },
  { to: '/app/mentor', label: 'Mentor', icon: Sparkles },
  { to: '/app/opportunities', label: 'Jobs', icon: Briefcase },
  { to: '/app/profile', label: 'Profile', icon: UserCircle },
];
