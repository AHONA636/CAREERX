export const cohortStats = {
  totalStudents: 186,
  avgReadiness: 64,
  atRiskStudents: 23,
  placementRate: 71,
};

export const readinessDistribution = [
  { band: '0-25%', students: 8 },
  { band: '26-50%', students: 34 },
  { band: '51-75%', students: 91 },
  { band: '76-100%', students: 53 },
];

export const studentRoster = [
  { name: 'Sneha Kar', role: 'Software Development Engineer', readiness: 72, status: 'On Track', lastActive: '2h ago' },
  { name: 'Ahona Sarkar', role: 'Data Scientist', readiness: 58, status: 'On Track', lastActive: '1d ago' },
  { name: 'Torsa Mondal', role: 'ML Engineer', readiness: 45, status: 'At Risk', lastActive: '3d ago' },
  { name: 'Rohan Das', role: 'Backend Developer', readiness: 81, status: 'On Track', lastActive: '5h ago' },
  { name: 'Priya Nair', role: 'Cloud Engineer', readiness: 39, status: 'At Risk', lastActive: '6d ago' },
  { name: 'Arjun Mehta', role: 'Frontend Developer', readiness: 67, status: 'On Track', lastActive: '12h ago' },
];

export const cohortSkillGaps = [
  { skill: 'System Design', avgGap: 34 },
  { skill: 'DSA', avgGap: 21 },
  { skill: 'Cloud Fundamentals', avgGap: 27 },
  { skill: 'Communication', avgGap: 18 },
  { skill: 'SQL', avgGap: 11 },
];

export const interventions = [
  {
    id: 'iv_1',
    student: 'Torsa Mondal',
    reason: 'No activity for 3 days, readiness dropped 4% this week.',
    action: 'Send a check-in nudge and re-recommend the DSA module.',
    priority: 'High',
  },
  {
    id: 'iv_2',
    student: 'Priya Nair',
    reason: 'Readiness stalled at 39% for 2 weeks despite consistent logins.',
    action: 'Schedule a 1:1 to reassess target role fit.',
    priority: 'High',
  },
  {
    id: 'iv_3',
    student: 'Ahona Sarkar',
    reason: 'Strong progress but hasn\'t attempted a system design assessment.',
    action: 'Recommend the System Design Fundamentals module directly.',
    priority: 'Medium',
  },
];

export const platformStats = {
  totalUsers: 2140,
  activeToday: 512,
  modelAccuracy: 91.4,
  avgSessionMin: 24,
};

export const userGrowth = [
  { month: 'Mar', students: 1120, educators: 42 },
  { month: 'Apr', students: 1340, educators: 46 },
  { month: 'May', students: 1580, educators: 51 },
  { month: 'Jun', students: 1790, educators: 54 },
  { month: 'Jul', students: 1960, educators: 58 },
  { month: 'Aug', students: 2140, educators: 61 },
];

export const userTable = [
  { name: 'Sneha Kar', email: 'sneha.kar@careerx.dev', role: 'Student', status: 'Active', joined: '2025-01-14' },
  { name: 'Dr. Ananya Roy', email: 'ananya.roy@iem.edu.in', role: 'Educator', status: 'Active', joined: '2024-11-02' },
  { name: 'Torsa Mondal', email: 'torsa.mondal@careerx.dev', role: 'Student', status: 'At Risk', joined: '2025-02-20' },
  { name: 'Ahona Sarkar', email: 'ahona.sarkar@careerx.dev', role: 'Student', status: 'Active', joined: '2025-02-20' },
  { name: 'Admin — Platform', email: 'admin@careerx.dev', role: 'Admin', status: 'Active', joined: '2024-09-01' },
];

export const modelInsights = [
  { model: 'Skill Verification Classifier', accuracy: 93.2, drift: 'Stable', lastRetrained: '2026-08-10' },
  { model: 'Readiness Predictor', accuracy: 89.7, drift: 'Minor Drift', lastRetrained: '2026-08-05' },
  { model: 'Opportunity Recommender', accuracy: 91.1, drift: 'Stable', lastRetrained: '2026-08-12' },
  { model: 'Dropout Risk Estimator', accuracy: 87.4, drift: 'Monitoring', lastRetrained: '2026-07-29' },
];
