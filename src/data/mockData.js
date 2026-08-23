// Centralized mock data for CareerX. Structured so each domain can later be
// swapped for a real API call (see src/data/api.js) without touching UI code.

export const currentUser = {
  id: 'u_1001',
  name: 'Sneha Kar',
  firstName: 'Sneha',
  email: 'sneha.kar@careerx.dev',
  role: 'student',
  avatarInitials: 'SK',
  college: 'Institute of Engineering & Management',
  branch: 'Computer Science & Engineering',
  year: '3rd Year',
  graduationYear: 2027,
  location: 'Kolkata, India',
  joinedOn: '2025-01-14',
  streakDays: 12,
  consistencyScore: 84,
};

// Single source of truth for every skill CareerX tracks. All other exports
// (careerGoal counts, skill-gap chart, priority improvements, profile skills)
// derive their numbers from this array so they can never drift out of sync.
export const skillsCatalog = [
  { id: 's_python', name: 'Python', category: 'Programming Language', verified: true, confidence: 92, required: 75, evidence: ['Coding Assessment', 'Project Analysis', 'Problem Solving Test'] },
  { id: 's_java', name: 'Java', category: 'Programming Language', verified: true, confidence: 87, required: 70, evidence: ['Coding Assessment', 'Problem Solving Test'] },
  { id: 's_js', name: 'JavaScript', category: 'Programming Language', verified: true, confidence: 84, required: 65, evidence: ['Coding Assessment', 'Project Analysis'] },
  { id: 's_htmlcss', name: 'HTML & CSS', category: 'Frontend', verified: true, confidence: 88, required: 50, evidence: ['Practical Task', 'Project Analysis'] },
  { id: 's_react', name: 'React', category: 'Frontend', verified: true, confidence: 81, required: 60, evidence: ['Project Analysis', 'Practical Task'] },
  { id: 's_sql', name: 'SQL', category: 'Database', verified: true, confidence: 76, required: 65, evidence: ['Coding Assessment', 'Practical Task'] },
  { id: 's_git', name: 'Git & Version Control', category: 'Tooling', verified: true, confidence: 79, required: 55, evidence: ['Practical Task', 'Project Analysis'] },
  { id: 's_oop', name: 'Object-Oriented Programming', category: 'Core CS', verified: true, confidence: 74, required: 60, evidence: ['Coding Assessment'] },
  { id: 's_rest', name: 'REST API Design', category: 'Backend', verified: true, confidence: 71, required: 60, evidence: ['Project Analysis', 'Practical Task'] },
  { id: 's_node', name: 'Node.js', category: 'Backend', verified: true, confidence: 68, required: 55, evidence: ['Project Analysis'] },
  { id: 's_linux', name: 'Linux & Command Line', category: 'Tooling', verified: true, confidence: 73, required: 55, evidence: ['Practical Task'] },
  { id: 's_testing', name: 'Testing & Debugging', category: 'Software Engineering', verified: true, confidence: 65, required: 55, evidence: ['Practical Task'] },
  { id: 's_comms', name: 'Communication', category: 'Soft Skill', verified: true, confidence: 61, required: 60, evidence: ['Behavioral Assessment'] },
  { id: 's_dsa', name: 'Data Structures & Algorithms', shortName: 'DSA', category: 'Core CS', verified: true, confidence: 62, required: 80, evidence: ['Coding Assessment'] },
  { id: 's_sysdesign', name: 'System Design', category: 'Architecture', verified: false, confidence: 38, required: 70, evidence: [] },
  { id: 's_cloud', name: 'Cloud Fundamentals', shortName: 'Cloud', category: 'Infrastructure', verified: false, confidence: 42, required: 65, evidence: [] },
  { id: 's_security', name: 'System Security Basics', category: 'Security', verified: false, confidence: 25, required: 45, evidence: [] },
  { id: 's_docker', name: 'Docker & Containers', category: 'DevOps', verified: false, confidence: 20, required: 55, evidence: [] },
  { id: 's_cicd', name: 'CI/CD Pipelines', category: 'DevOps', verified: false, confidence: 15, required: 50, evidence: [] },
  { id: 's_k8s', name: 'Kubernetes & Orchestration', category: 'DevOps', verified: false, confidence: 10, required: 45, evidence: [] },
];

// --- Pure helpers, all operating on a *given* catalog (not just the default
// export above) so they work equally well against the live, mutable skills
// state held in AppContext once a user verifies a skill in the app. ---

export function findSkillIn(catalog, name) {
  return catalog.find((s) => s.name === name);
}

export function skillStatus(skill) {
  if (!skill.verified) return 'missing';
  return skill.confidence >= skill.required ? 'strong' : 'warning';
}

export function deriveSkillCounts(catalog) {
  const gapSkills = catalog.filter((s) => !s.verified);
  return {
    skillsVerifiedCount: catalog.filter((s) => s.verified).length,
    skillsTotalCount: catalog.length,
    skillGapCount: gapSkills.length,
    skillGapSummary: gapSkills.length
      ? `${gapSkills.slice(0, 2).map((s) => s.shortName || s.name).join(', ')}${gapSkills.length > 2 ? ` +${gapSkills.length - 2}` : ''}`
      : 'All skills verified',
  };
}

// Curated, role-critical subset shown on the Skill Gap page (chips + radar
// chart) — deliberately smaller than the full 20-skill catalog so the chart
// stays readable.
export const GAP_CHART_SKILLS = [
  'Python', 'Java', 'Data Structures & Algorithms', 'System Design',
  'SQL', 'Git & Version Control', 'Cloud Fundamentals', 'React',
];

export function deriveSkillGapTarget(catalog) {
  return {
    requiredSkills: GAP_CHART_SKILLS.map((name) => {
      const s = findSkillIn(catalog, name);
      return {
        name: s.shortName || s.name,
        status: skillStatus(s),
        current: s.confidence,
        required: s.required,
      };
    }),
  };
}

// Top improvement targets, ordered by roadmap priority (current step first),
// not strictly by gap size.
export const PRIORITY_SKILLS = [
  { name: 'Data Structures & Algorithms', priority: 'High Priority' },
  { name: 'System Design', priority: 'High Priority' },
  { name: 'Cloud Fundamentals', priority: 'Medium Priority' },
];

export function derivePriorityImprovements(catalog) {
  return PRIORITY_SKILLS.map(({ name, priority }) => {
    const s = findSkillIn(catalog, name);
    return {
      id: `pi_${s.id}`,
      title: s.name,
      current: s.confidence,
      required: s.required,
      gap: Math.max(0, s.required - s.confidence),
      priority,
    };
  });
}

function findSkill(name) {
  return findSkillIn(skillsCatalog, name);
}

export const careerGoal = {
  targetRole: 'Software Development Engineer',
  targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Atlassian'],
  timeline: '6 months',
  readinessScore: 72,
  stage: 'Close DSA Gap',
  ...deriveSkillCounts(skillsCatalog),
};

export const readinessBreakdown = [
  { label: 'Technical Skills', value: 82, color: 'var(--color-emerald-500)' },
  { label: 'Problem Solving', value: 76, color: 'var(--color-emerald-500)' },
  { label: 'Projects', value: 68, color: 'var(--color-amber-500)' },
  { label: 'Communication', value: 61, color: 'var(--color-amber-500)' },
  { label: 'Interview Readiness', value: 59, color: 'var(--color-rose-500)' },
];

export const readinessTrend = [
  { month: 'Mar', score: 41 },
  { month: 'Apr', score: 47 },
  { month: 'May', score: 53 },
  { month: 'Jun', score: 58 },
  { month: 'Jul', score: 65 },
  { month: 'Aug', score: 72 },
];

export const skillGrowth = [
  { skill: 'Python', before: 58, now: findSkill('Python').confidence },
  { skill: 'Java', before: 50, now: findSkill('Java').confidence },
  { skill: 'DSA', before: 34, now: findSkill('Data Structures & Algorithms').confidence },
  { skill: 'React', before: 40, now: findSkill('React').confidence },
  { skill: 'SQL', before: 45, now: findSkill('SQL').confidence },
  { skill: 'System Design', before: 12, now: findSkill('System Design').confidence },
];

export const weeklyActivity = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.2 },
  { day: 'Wed', hours: 0.8 },
  { day: 'Thu', hours: 2.8 },
  { day: 'Fri', hours: 1.6 },
  { day: 'Sat', hours: 3.4 },
  { day: 'Sun', hours: 2.1 },
];

export const roadmapSteps = [
  {
    id: 'rm_1',
    title: 'Profile Analysis',
    description: 'CareerX built your Learning Digital Twin from academic history and behavior patterns.',
    status: 'completed',
  },
  {
    id: 'rm_2',
    title: 'Skill Verification',
    description: 'Verified 14 of 20 skills through coding assessments and project analysis.',
    status: 'completed',
  },
  {
    id: 'rm_3',
    title: 'Close DSA Gap',
    description: 'Raise DSA proficiency from 62% to the 80% required for SDE roles.',
    status: 'in-progress',
    progress: 62,
  },
  {
    id: 'rm_4',
    title: 'Build 2 Real-World Projects',
    description: 'Ship projects that demonstrate applied system design and backend skills.',
    status: 'upcoming',
  },
  {
    id: 'rm_5',
    title: 'System Design Preparation',
    description: 'Learn scalability, databases, caching and distributed system fundamentals.',
    status: 'upcoming',
  },
  {
    id: 'rm_6',
    title: 'Mock Interviews',
    description: 'Practice with AI-simulated technical and behavioral interview rounds.',
    status: 'upcoming',
  },
  {
    id: 'rm_7',
    title: 'Placement Readiness',
    description: 'Final review — resume, portfolio and company-specific preparation.',
    status: 'upcoming',
  },
];

export const learningModules = [
  {
    id: 'lm_dsa',
    title: 'DSA — Advanced',
    reason: `Your current DSA score is ${findSkill('Data Structures & Algorithms').confidence}%, while your target role requires ${findSkill('Data Structures & Algorithms').required}%.`,
    progress: findSkill('Data Structures & Algorithms').confidence,
    topics: ['Arrays & Strings', 'Trees', 'Graphs', 'Dynamic Programming'],
    priority: 'High Priority',
  },
  {
    id: 'lm_sysdesign',
    title: 'System Design Fundamentals',
    reason: 'System design is currently unverified and required for SDE-2+ interviews.',
    progress: findSkill('System Design').confidence,
    topics: ['Scalability Basics', 'Load Balancing', 'Caching', 'Database Sharding'],
    priority: 'High Priority',
  },
  {
    id: 'lm_cloud',
    title: 'Cloud Fundamentals',
    reason: 'Cloud knowledge is required by 3 of your 4 target companies.',
    progress: findSkill('Cloud Fundamentals').confidence,
    topics: ['AWS Core Services', 'Containers', 'CI/CD Basics', 'Serverless'],
    priority: 'Medium Priority',
  },
];

export const recommendedProjects = [
  {
    id: 'proj_job_match',
    title: 'Build a Job Matching Engine',
    skills: ['Python', 'ML', 'FastAPI', 'PostgreSQL'],
    difficulty: 'Intermediate',
    duration: '3 weeks',
    description: 'Build a recommendation engine that scores candidate-role fit — directly demonstrates the skills SDE interviewers probe for.',
  },
  {
    id: 'proj_url_shortener',
    title: 'Design a Scalable URL Shortener',
    skills: ['System Design', 'Redis', 'Node.js'],
    difficulty: 'Intermediate',
    duration: '2 weeks',
    description: 'Classic system-design interview problem — great way to practice caching and horizontal scaling on a real build.',
  },
  {
    id: 'proj_dashboard',
    title: 'Real-Time Analytics Dashboard',
    skills: ['React', 'WebSockets', 'SQL'],
    difficulty: 'Advanced',
    duration: '4 weeks',
    description: 'A full-stack build that showcases frontend, live data handling and database design together.',
  },
];

export const assessments = {
  upcoming: [
    {
      id: 'as_dsa',
      title: 'DSA Assessment',
      questions: 15,
      minutes: 25,
      skill: 'Problem Solving',
      difficulty: 'Medium',
    },
    {
      id: 'as_sysdesign',
      title: 'System Design Fundamentals',
      questions: 10,
      minutes: 30,
      skill: 'System Design',
      difficulty: 'Hard',
    },
    {
      id: 'as_cloud',
      title: 'Cloud Fundamentals Assessment',
      questions: 12,
      minutes: 20,
      skill: 'Infrastructure',
      difficulty: 'Easy',
    },
  ],
  completed: [
    {
      id: 'as_python',
      title: 'Python Proficiency Test',
      questions: 20,
      minutes: 30,
      skill: 'Programming',
      score: findSkill('Python').confidence,
      accuracy: 90,
      timeTaken: '24 min',
      confidence: findSkill('Python').confidence,
      weakTopics: ['Decorators'],
      completedOn: '2026-08-10',
    },
    {
      id: 'as_react',
      title: 'React Practical Task',
      questions: 8,
      minutes: 40,
      skill: 'Frontend',
      score: findSkill('React').confidence,
      accuracy: 85,
      timeTaken: '35 min',
      confidence: findSkill('React').confidence,
      weakTopics: ['Performance Optimization', 'Custom Hooks'],
      completedOn: '2026-08-05',
    },
    {
      id: 'as_java',
      title: 'Java Core Assessment',
      questions: 18,
      minutes: 28,
      skill: 'Programming',
      score: findSkill('Java').confidence,
      accuracy: 88,
      timeTaken: '26 min',
      confidence: findSkill('Java').confidence,
      weakTopics: ['Concurrency'],
      completedOn: '2026-07-28',
    },
  ],
};

export const opportunities = [
  {
    id: 'op_1',
    type: 'Internship',
    role: 'Software Engineering Intern',
    company: 'Atlassian',
    location: 'Bengaluru, India (Hybrid)',
    match: 91,
    skillsRequired: ['Python', 'React', 'SQL', 'Git'],
    skillsMatched: ['Python', 'React', 'SQL', 'Git'],
    skillsMissing: [],
    deadline: '2026-09-15',
  },
  {
    id: 'op_2',
    type: 'Job',
    role: 'SDE-1',
    company: 'Flipkart',
    location: 'Bengaluru, India',
    match: 78,
    skillsRequired: ['Java', 'DSA', 'System Design', 'SQL'],
    skillsMatched: ['Java', 'SQL'],
    skillsMissing: ['DSA', 'System Design'],
    deadline: '2026-09-30',
  },
  {
    id: 'op_3',
    type: 'Hackathon',
    role: 'Smart India Hackathon 2026',
    company: 'Ministry of Education',
    location: 'Remote / On-site Finals',
    match: 85,
    skillsRequired: ['Python', 'ML Fundamentals', 'React'],
    skillsMatched: ['Python', 'React'],
    skillsMissing: ['ML Fundamentals'],
    deadline: '2026-09-05',
  },
  {
    id: 'op_4',
    type: 'Scholarship',
    role: 'Google India STEP Scholarship',
    company: 'Google',
    location: 'India',
    match: 88,
    skillsRequired: ['Python', 'DSA', 'Academic Merit'],
    skillsMatched: ['Python', 'Academic Merit'],
    skillsMissing: ['DSA'],
    deadline: '2026-10-01',
  },
  {
    id: 'op_5',
    type: 'Competition',
    role: 'Amazon HackOn Season 5',
    company: 'Amazon',
    location: 'Remote',
    match: 74,
    skillsRequired: ['Python', 'System Design', 'Cloud'],
    skillsMatched: ['Python'],
    skillsMissing: ['System Design', 'Cloud'],
    deadline: '2026-09-20',
  },
  {
    id: 'op_6',
    type: 'Job',
    role: 'Backend Developer',
    company: 'Razorpay',
    location: 'Bengaluru, India',
    match: 69,
    skillsRequired: ['Java', 'SQL', 'System Design', 'Cloud'],
    skillsMatched: ['Java', 'SQL'],
    skillsMissing: ['System Design', 'Cloud'],
    deadline: '2026-10-10',
  },
];

export const notifications = [
  {
    id: 'n_1',
    title: 'New skill gap detected',
    body: 'System Design proficiency is below the threshold for your target role.',
    type: 'warning',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n_2',
    title: 'Assessment recommended',
    body: 'A DSA Assessment is ready — 15 questions, ~25 minutes.',
    type: 'ai',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'n_3',
    title: 'Readiness increased to 72%',
    body: 'Your career readiness score improved by 7% this week. Great progress!',
    type: 'success',
    time: '1 day ago',
    read: false,
  },
  {
    id: 'n_4',
    title: 'New opportunity matched',
    body: 'Software Engineering Intern at Atlassian — 91% match.',
    type: 'match',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'n_5',
    title: '12-day streak!',
    body: "You've been consistent for 12 days straight. Keep it going.",
    type: 'success',
    time: '3 days ago',
    read: true,
  },
];

export const aiMentorQuickActions = [
  'Analyze my skill gap',
  'Improve my roadmap',
  'Find suitable internships',
  'Prepare me for interviews',
  'What should I learn today?',
];

export const aiMentorSeedMessages = [
  {
    id: 'm_1',
    role: 'assistant',
    text: "Hi Sneha, I'm your CareerX AI Mentor. Based on your current progress, you're strongest in Python and React.",
  },
  {
    id: 'm_2',
    role: 'assistant',
    text: 'You should prioritize DSA before starting system design — it unlocks a larger jump in your readiness score.',
  },
  {
    id: 'm_3',
    role: 'assistant',
    text: 'You are currently 72% ready for your target role: Software Development Engineer.',
  },
];

export const aiMentorResponses = {
  'analyze my skill gap':
    "Your biggest gaps are System Design (38% vs 70% required) and Cloud Fundamentals (42% vs 65% required). DSA is close — just 18% away from target. I'd tackle DSA first since it's the fastest win.",
  'improve my roadmap':
    "I've reprioritized your roadmap: finish DSA this week, then start System Design Fundamentals in parallel with your first project. This should raise your readiness score by roughly 9-12% within a month.",
  'find suitable internships':
    "You're a 91% match for the Software Engineering Intern role at Atlassian — all required skills are already verified. I've added it to your Opportunities tab.",
  'prepare me for interviews':
    "Your Interview Readiness is your lowest sub-score at 59%. I recommend 2 mock interviews per week and reviewing System Design fundamentals before your next assessment.",
  'what should i learn today':
    "Based on your roadmap, spend today on Graphs (DSA module) — you're 62% through DSA and Graphs is your weakest topic area right now.",
};

export const decisionLogicResult = {
  skillsVerified: true,
  readinessThresholdMet: false,
  maxAttemptsReached: false,
  gateEligible: null, // not evaluated since attempts not reached
  recommendation: 'continue-roadmap',
};

export const decisionOutcomes = {
  'placement': {
    label: 'Placement / Opportunity Matching',
    tone: 'success',
    description: 'All conditions met — CareerX will begin surfacing matched placement opportunities immediately.',
  },
  'continue-roadmap': {
    label: 'Continue Personalized Roadmap',
    tone: 'warning',
    description: "Readiness threshold isn't met yet, but attempts remain. Keep following your roadmap to close remaining gaps.",
  },
  'gate-prep': {
    label: 'GATE Preparation Guidance',
    tone: 'info',
    description: 'Attempts are exhausted and you are GATE eligible — CareerX will pivot your roadmap toward GATE preparation.',
  },
  'alternative-path': {
    label: 'Alternative Career Path',
    tone: 'alt',
    description: 'Attempts are exhausted and GATE is not applicable — CareerX will suggest adjacent roles matching your verified strengths.',
  },
};

export const profileData = {
  completeness: 86,
  missing: ['Add 1 project', 'Complete skill verification', 'Add certification'],
  education: [
    {
      degree: 'B.Tech, Computer Science & Engineering',
      institution: 'Institute of Engineering & Management, Kolkata',
      duration: '2023 — 2027',
      score: 'CGPA 8.7 / 10',
    },
    {
      degree: 'Higher Secondary (Class XII), Science',
      institution: 'South Point High School',
      duration: '2021 — 2023',
      score: '92%',
    },
  ],
  projects: [
    {
      title: 'CareerX — AI Career Intelligence Platform',
      description: 'Personalized roadmap engine that maps verified skills to target careers.',
      skills: ['React', 'Python', 'FastAPI'],
    },
    {
      title: 'Campus Event Manager',
      description: 'Full-stack event registration and QR check-in system used by 400+ students.',
      skills: ['React', 'Node.js', 'MongoDB'],
    },
  ],
  certifications: [
    { title: 'Python for Everybody', issuer: 'University of Michigan (Coursera)', year: 2025 },
    { title: 'React — The Complete Guide', issuer: 'Udemy', year: 2025 },
  ],
  achievements: [
    'Finalist, Smart India Hackathon 2025',
    "Dean's List — Semester 4",
    'Open-source contributor, 3 merged PRs',
  ],
};

export const careerRoleOptions = [
  'Software Engineer',
  'Data Scientist',
  'ML Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Cloud Engineer',
  'Cybersecurity Engineer',
  'Other',
];

export const companyOptions = [
  'Google', 'Microsoft', 'Amazon', 'Atlassian', 'Flipkart', 'Razorpay',
  'Adobe', 'Salesforce', 'Goldman Sachs', 'Zoho', 'Swiggy', 'Uber',
];

export const timelineOptions = ['3 months', '6 months', '12 months', '18+ months'];
