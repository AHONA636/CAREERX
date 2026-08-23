import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  currentUser,
  careerGoal as initialCareerGoal,
  assessments as initialAssessments,
  notifications as initialNotifications,
  skillsCatalog,
  deriveSkillCounts,
  deriveSkillGapTarget,
  derivePriorityImprovements,
} from '../data/mockData';
import { useLocalStorageState, clearAllLocalStorageState } from '../hooks/useLocalStorageState';

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  // Persisted to localStorage so a page refresh (or a plain link navigation)
  // doesn't silently log the user out or discard their in-session progress.
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState('isAuthenticated', false);
  const [hasOnboarded, setHasOnboarded] = useLocalStorageState('hasOnboarded', false);
  const [user, setUser] = useLocalStorageState('user', currentUser);
  const [careerGoalBase, setCareerGoalBase] = useLocalStorageState('careerGoal', initialCareerGoal);
  const [skills, setSkills] = useLocalStorageState('skills', skillsCatalog);
  const [assessmentState, setAssessmentState] = useLocalStorageState('assessments', initialAssessments);
  const [notificationState, setNotificationState] = useLocalStorageState('notifications', initialNotifications);
  // Ephemeral UI state — deliberately not persisted.
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiMentorOpen, setAiMentorOpen] = useState(false);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, variant = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => removeToast(id), 4200);
  }, [removeToast]);

  const login = useCallback((email) => {
    setUser((prev) => ({ ...prev, email: email || prev.email }));
    setIsAuthenticated(true);
  }, [setUser, setIsAuthenticated]);

  const logout = useCallback(() => {
    clearAllLocalStorageState();
    setIsAuthenticated(false);
    setHasOnboarded(false);
    setUser(currentUser);
    setCareerGoalBase(initialCareerGoal);
    setSkills(skillsCatalog);
    setAssessmentState(initialAssessments);
    setNotificationState(initialNotifications);
  }, [setIsAuthenticated, setHasOnboarded, setUser, setCareerGoalBase, setSkills, setAssessmentState, setNotificationState]);

  const completeOnboarding = useCallback((goalUpdates) => {
    if (goalUpdates) {
      setCareerGoalBase((prev) => ({ ...prev, ...goalUpdates }));
    }
    setHasOnboarded(true);
    addToast('Your personalized roadmap is ready.', 'success');
  }, [addToast, setCareerGoalBase, setHasOnboarded]);

  const updateCareerGoal = useCallback((updates) => {
    setCareerGoalBase((prev) => ({ ...prev, ...updates }));
    addToast('Career goal updated — roadmap recalculated.', 'success');
  }, [addToast, setCareerGoalBase]);

  const completeAssessment = useCallback((assessmentId, score) => {
    setAssessmentState((prev) => {
      const upcoming = prev.upcoming.find((a) => a.id === assessmentId);
      if (!upcoming) return prev;
      const completed = {
        ...upcoming,
        score,
        accuracy: Math.min(99, score + 3),
        timeTaken: `${Math.max(8, upcoming.minutes - 4)} min`,
        confidence: score,
        weakTopics: score < 70 ? ['Edge Cases', 'Optimization'] : ['Advanced Patterns'],
        completedOn: new Date().toISOString().slice(0, 10),
      };
      return {
        upcoming: prev.upcoming.filter((a) => a.id !== assessmentId),
        completed: [completed, ...prev.completed],
      };
    });
    setCareerGoalBase((prev) => ({
      ...prev,
      readinessScore: Math.min(99, prev.readinessScore + Math.round((score - 60) / 12)),
    }));
    addToast('Assessment submitted — your readiness score has been updated.', 'success');
  }, [addToast, setAssessmentState, setCareerGoalBase]);

  const verifySkill = useCallback((skillId, confidence) => {
    let verifiedName = '';
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id !== skillId) return s;
        verifiedName = s.name;
        return { ...s, verified: true, confidence, evidence: ['Coding Assessment', 'Problem Solving Test'] };
      })
    );
    addToast(`${verifiedName} verified at ${confidence}% confidence.`, 'success');
  }, [addToast, setSkills]);

  const markNotificationRead = useCallback((id) => {
    setNotificationState((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, [setNotificationState]);

  const markAllNotificationsRead = useCallback(() => {
    setNotificationState((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotificationState]);

  // Everything skill-derived (dashboard counts, the Skill Gap chart & chips,
  // Priority Improvements) recomputes from `skills` whenever a skill is
  // verified, so the whole app stays in sync with a single source of truth.
  const careerGoal = useMemo(
    () => ({ ...careerGoalBase, ...deriveSkillCounts(skills) }),
    [careerGoalBase, skills]
  );
  const skillGapTarget = useMemo(() => deriveSkillGapTarget(skills), [skills]);
  const priorityImprovements = useMemo(() => derivePriorityImprovements(skills), [skills]);

  const value = useMemo(() => ({
    isAuthenticated,
    hasOnboarded,
    user,
    setUser,
    careerGoal,
    updateCareerGoal,
    completeOnboarding,
    skills,
    verifySkill,
    skillGapTarget,
    priorityImprovements,
    assessmentState,
    completeAssessment,
    notificationState,
    markNotificationRead,
    markAllNotificationsRead,
    toasts,
    addToast,
    removeToast,
    login,
    logout,
    sidebarOpen,
    setSidebarOpen,
    aiMentorOpen,
    setAiMentorOpen,
  }), [
    isAuthenticated, hasOnboarded, user, setUser, careerGoal, updateCareerGoal, completeOnboarding,
    skills, verifySkill, skillGapTarget, priorityImprovements,
    assessmentState, completeAssessment, notificationState, markNotificationRead,
    markAllNotificationsRead, toasts, addToast, removeToast, login, logout,
    sidebarOpen, aiMentorOpen,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
