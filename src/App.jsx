import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './router/ScrollToTop';
import RequireAuth from './router/RequireAuth';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';

import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import SkillVerification from './pages/student/SkillVerification';
import SkillGap from './pages/student/SkillGap';
import CareerGoals from './pages/student/CareerGoals';
import RoadmapPage from './pages/student/RoadmapPage';
import Learning from './pages/student/Learning';
import Assessments from './pages/student/Assessments';
import Progress from './pages/student/Progress';
import Opportunities from './pages/student/Opportunities';
import AIMentor from './pages/student/AIMentor';
import Notifications from './pages/student/Notifications';
import Settings from './pages/student/Settings';

import EducatorOverview from './pages/educator/EducatorOverview';
import StudentAnalytics from './pages/educator/StudentAnalytics';
import StudentProgress from './pages/educator/StudentProgress';
import SkillGapInsights from './pages/educator/SkillGapInsights';
import InterventionRecommendations from './pages/educator/InterventionRecommendations';

import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import PlatformAnalytics from './pages/admin/PlatformAnalytics';
import ModelInsights from './pages/admin/ModelInsights';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/onboarding"
          element={
            <RequireAuth>
              <Onboarding />
            </RequireAuth>
          }
        />

        <Route
          path="/app"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="skills" element={<SkillVerification />} />
          <Route path="goals" element={<CareerGoals />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="learning" element={<Learning />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="progress" element={<Progress />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="mentor" element={<AIMentor />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/educator" element={<EducatorOverview />} />
        <Route path="/educator/analytics" element={<StudentAnalytics />} />
        <Route path="/educator/progress" element={<StudentProgress />} />
        <Route path="/educator/skill-gaps" element={<SkillGapInsights />} />
        <Route path="/educator/interventions" element={<InterventionRecommendations />} />

        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/analytics" element={<PlatformAnalytics />} />
        <Route path="/admin/model-insights" element={<ModelInsights />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
