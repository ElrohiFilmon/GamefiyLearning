
import type { UserProfile, Course, Badge, Challenge, LearningPath, LeaderboardEntry, PersonalizedMission, SkillDetail, UserBadge } from '@/types';
import { BookText, Code, Cpu, Zap, ShieldCheck, Star, TrendingUp, Award, Target as TargetIcon, MapPinned, Film, Puzzle, CheckCircle, Clock, DollarSign, Terminal, Feather, Bot, PlayCircle, ExternalLink } from 'lucide-react';

const CERTIFICATE_FEE_ETB = 275; // Price already in ETB
export const MONTHLY_SUBSCRIPTION_FEE_ETB = 550; // Price already in ETB

// --- DEFAULT MOCK USER (ALEX NOVA) ---
export const DEFAULT_MOCK_USER_PROFILE_TEMPLATE: UserProfile = {
  id: 'user_alex.nova@example.com', // Consistent ID format
  name: 'Alex Nova',
  email: 'alex.nova@example.com',
  avatarUrl: 'https://placehold.co/100x100/2563EB/FFFFFF.png?text=AN&font=montserrat', // Blue background
  initials: 'AN',
  xp: 7500,
  points: 1200,
  streaks: 15,
  badges: [], // Populated below
  completedCourseIds: ['course-go-fundamentals'],
  completedChallengeIds: ['ch1'], // Alex completed the daily drill
  skillPoints: {
    "Go Fundamentals": { name: "Go Fundamentals", level: 5, points: 520 },
    "Concurrency in Go": { name: "Concurrency in Go", level: 3, points: 310 },
    "Go Web Development": { name: "Go Web Development", level: 2, points: 180 },
  },
  bio: 'Aspiring Go developer, passionate about building scalable systems. Loves space exploration and learning new things!',
  joinedDate: '2023-05-15T10:00:00Z',
  certificatesEarned: [
    { courseId: 'course-go-fundamentals', courseName: 'Go Fundamentals: Zero to Hero', earnedDate: '2023-08-01T10:00:00Z', transactionId: 'mocktxn123', certificateUrl: '/courses/course-go-fundamentals/certificate' }
  ],
  subscriptionStatus: 'active',
  subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Active for 30 days
};

// --- NEW TEST USER (CHRIS COMPLETER) ---
export const CHRIS_COMPLETER_PROFILE_TEMPLATE: UserProfile = {
  id: 'user_chris.completer@example.com',
  name: 'Chris Completer',
  email: 'chris.completer@example.com',
  avatarUrl: 'https://placehold.co/100x100/10B981/FFFFFF.png?text=CC&font=montserrat', // Green background
  initials: 'CC',
  xp: 10000,
  points: 1500,
  streaks: 5,
  badges: [], // Populated below
  completedCourseIds: ['course-go-fundamentals'], // Completed Go course
  completedChallengeIds: ['ch1', 'ch4'], // Chris completed daily drill and python script
  skillPoints: {
    "Go Fundamentals": { name: "Go Fundamentals", level: 6, points: 800 }, // Higher level
  },
  bio: 'Dedicated learner, focused on mastering Go. Excited to get certified!',
  joinedDate: '2023-09-01T10:00:00Z',
  certificatesEarned: [], // No certificates earned yet
  subscriptionStatus: 'active',
  subscriptionEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Active for 15 days
};


export const MOCK_BADGES: Badge[] = [
  { id: 'badge-go-initiate', name: 'Go Initiate', description: 'Completed your first Go lesson.', icon: ShieldCheck, type: 'completion', criteria: 'Complete 1 Go lesson' },
  { id: 'badge-syntax-savvy', name: 'Syntax Savvy (Go)', description: 'Mastered basic Go syntax.', icon: Code, type: 'skill', criteria: 'Pass Go Syntax Quiz with 90%+' },
  { id: 'badge-bronze-learner', name: 'Bronze Learner', description: 'Completed 1 course.', icon: Award, type: 'graded', grade: 'bronze', criteria: 'Complete 1 course' },
  { id: 'badge-silver-learner', name: 'Silver Learner', description: 'Completed 2 courses.', icon: Award, type: 'graded', grade: 'silver', criteria: 'Complete 2 courses' },
  { id: 'badge-gold-learner', name: 'Gold Learner', description: 'Completed 3 main courses.', icon: Award, type: 'graded', grade: 'gold', criteria: 'Complete 3 main courses' },
  { id: 'badge-7-day-streak', name: '7-Day Streak', description: 'Logged in and learned for 7 consecutive days.', icon: Zap, type: 'streak', criteria: 'Log in for 7 days' },
  { id: 'badge-challenge-conqueror', name: 'Challenge Conqueror', description: 'Completed 5 challenges.', icon: TargetIcon, type: 'quest', criteria: 'Complete 5 challenges' },
  { id: 'badge-course-finish-go', name: 'Course Finisher: Go', description: 'Successfully completed "Go Fundamentals".', icon: CheckCircle, type: 'completion', criteria: 'Complete "Go Fundamentals"' },
  { id: 'badge-cert-go', name: 'Certified: Go Fundamentals', description: 'Earned the official certificate for "Go Fundamentals".', icon: DollarSign, type: 'completion', criteria: `Complete "Go Fundamentals" and pay ${CERTIFICATE_FEE_ETB} ETB` },
  { id: 'badge-java-journeyman', name: 'Java Journeyman', description: 'Completed the "Java Basics" course.', icon: Terminal, type: 'completion', criteria: 'Complete "Java Basics"' },
  { id: 'badge-python-pioneer', name: 'Python Pioneer', description: 'Completed the "Python for Beginners" course.', icon: Feather, type: 'completion', criteria: 'Complete "Python for Beginners"' },
  { id: 'badge-ai-chat', name: 'AI Collaborator', description: 'Used the AI Assistant 5 times.', icon: Bot, type: 'skill', criteria: 'Engage with AI Assistant' },
];

// Populate badges for Alex Nova
DEFAULT_MOCK_USER_PROFILE_TEMPLATE.badges = [
  { ...MOCK_BADGES.find(b => b.id === 'badge-go-initiate')!, earnedDate: '2023-05-20T10:00:00Z' },
  { ...MOCK_BADGES.find(b => b.id === 'badge-syntax-savvy')!, earnedDate: '2023-06-10T10:00:00Z' },
  { ...MOCK_BADGES.find(b => b.id === 'badge-bronze-learner')!, earnedDate: '2023-07-01T10:00:00Z' },
  { ...MOCK_BADGES.find(b => b.id === 'badge-course-finish-go')!, earnedDate: '2023-08-01T10:00:00Z' },
  { ...MOCK_BADGES.find(b => b.id === 'badge-cert-go')!, earnedDate: '2023-08-01T10:00:00Z' },
] as UserBadge[];

// Populate badges for Chris Completer
CHRIS_COMPLETER_PROFILE_TEMPLATE.badges = [
  { ...MOCK_BADGES.find(b => b.id === 'badge-go-initiate')!, earnedDate: '2023-09-05T10:00:00Z' },
  { ...MOCK_BADGES.find(b => b.id === 'badge-syntax-savvy')!, earnedDate: '2023-09-15T10:00:00Z' },
  { ...MOCK_BADGES.find(b => b.id === 'badge-bronze-learner')!, earnedDate: '2023-10-01T10:00:00Z' },
  { ...MOCK_BADGES.find(b => b.id === 'badge-course-finish-go')!, earnedDate: '2023-10-01T10:00:00Z' },
] as UserBadge[];


export const createInitialUserProfile = (name: string, email: string, userId?: string): UserProfile => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
  return {
    id: userId || `user_${email}`, // Use email as part of ID
    name,
    email,
    avatarUrl: `https://placehold.co/100x100/777777/FFFFFF.png?text=${initials}&font=montserrat`, // Neutral placeholder
    initials,
    xp: 0,
    points: 0,
    streaks: 0,
    badges: [],
    completedCourseIds: [],
    completedChallengeIds: [], // Initialize as empty
    skillPoints: {
      "Go Fundamentals": { name: "Go Fundamentals", level: 1, points: 0 },
      "Java Basics": { name: "Java Basics", level: 1, points: 0 },
      "Python for Beginners": { name: "Python for Beginners", level: 1, points: 0 },
    },
    bio: 'New language explorer ready for an adventure!',
    joinedDate: new Date().toISOString(),
    certificatesEarned: [],
    subscriptionStatus: 'inactive',
    // subscriptionEndDate is not set for new users
  };
};


export const MOCK_COURSES: Course[] = [
  {
    id: 'course-go-fundamentals',
    title: 'Go Fundamentals: Zero to Hero',
    description: 'Master the basics of Go, from syntax to basic concurrency.',
    longDescription: 'This comprehensive course covers everything you need to start your journey with Go. Learn about variables, data types, control structures, functions, packages, and the fundamentals of goroutines and channels. Perfect for beginners with no prior Go experience.',
    imageUrl: 'https://placehold.co/600x400/76D7C4/0E2F5A.png?text=Go+Gopher&font=montserrat',
    modules: [
      { id: 'mod-go-1', title: 'Introduction to Go', order: 1, lessons: [
        { id: 'l-go-1-1', title: 'What is Go?', type: 'video', content: 'https://www.youtube.com/watch?v=r_h5XewF2G8', xpValue: 10, estimatedTime: '10m', order: 1 }, 
        { id: 'l-go-1-2', title: 'Setting up Go Environment', type: 'text', content: 'Setup guide content for Go...', xpValue: 20, estimatedTime: '20m', order: 2 },
      ]},
      { id: 'mod-go-2', title: 'Basic Syntax and Data Types (Go)', order: 2, lessons: [
        { id: 'l-go-2-1', title: 'Go Variables and Constants', type: 'interactive_code', content: 'Interactive exercise on Go vars...', xpValue: 30, estimatedTime: '25m', order: 1 },
        { id: 'l-go-2-2', title: 'Go Common Data Types', type: 'text', content: 'Details on int, string, bool in Go...', xpValue: 20, estimatedTime: '15m', order: 2 },
        { id: 'l-go-2-3', title: 'Go Syntax Quiz', type: 'quiz', content: 'Quiz JSON for Go...', xpValue: 50, estimatedTime: '15m', order: 3 },
      ]},
    ],
    estimatedTime: '12 hours',
    difficulty: 'Beginner',
    badgeOnCompletionId: 'badge-course-finish-go',
    tags: ['Go', 'Beginner', 'Programming Fundamentals', 'Backend'],
    certificateFee: CERTIFICATE_FEE_ETB,
  },
  {
    id: 'course-java-basics',
    title: 'Java Basics: Object Oriented Path',
    description: 'Understand core Java concepts and object-oriented programming.',
    longDescription: 'Start your Java journey here. This course covers Java syntax, object-oriented principles (classes, objects, inheritance, polymorphism), data structures, and exception handling. Ideal for aspiring Java developers.',
    imageUrl: 'https://placehold.co/600x400/D2B48C/593326.png?text=Java+Logo&font=montserrat',
    modules: [
        { id: 'mod-java-1', title: 'Introduction to Java', order: 1, lessons: [
            { id: 'l-java-1-1', title: 'What is Java?', type: 'video', content: 'https://www.youtube.com/watch?v=grEKMHGYyns', xpValue: 10, estimatedTime: '12m', order: 1 }, 
            { id: 'l-java-1-2', title: 'Setting up JDK & IDE', type: 'text', content: 'Setup guide for Java...', xpValue: 20, estimatedTime: '25m', order: 2 },
        ]},
        { id: 'mod-java-2', title: 'Core Java Syntax', order: 2, lessons: [
            { id: 'l-java-2-1', title: 'Java Variables & Data Types', type: 'text', content: 'Details on Java types...', xpValue: 25, estimatedTime: '20m', order: 1 },
            { id: 'l-java-2-2', title: 'OOP Concepts Quiz', type: 'quiz', content: 'Quiz JSON for Java OOP...', xpValue: 50, estimatedTime: '20m', order: 2 },
        ]},
    ],
    estimatedTime: '18 hours',
    difficulty: 'Beginner',
    badgeOnCompletionId: 'badge-java-journeyman',
    tags: ['Java', 'Beginner', 'OOP', 'Backend'],
    certificateFee: CERTIFICATE_FEE_ETB,
  },
  {
    id: 'course-python-beginners',
    title: 'Python for Beginners: Scripting & Automation',
    description: 'Learn Python from scratch, focusing on scripting and automation tasks.',
    longDescription: 'This beginner-friendly Python course will teach you Python syntax, data structures, functions, modules, and file handling. You\'ll learn how to write scripts to automate tasks and build simple applications.',
    imageUrl: 'https://placehold.co/600x400/306998/FFD43B.png?text=Python+Logo&font=montserrat',
    modules: [
        { id: 'mod-python-1', title: 'Hello, Python!', order: 1, lessons: [
            { id: 'l-python-1-1', title: 'Why Python?', type: 'video', content: 'https://www.youtube.com/watch?v=x7Xzvm0sqlM', xpValue: 10, estimatedTime: '10m', order: 1 }, 
            { id: 'l-python-1-2', title: 'Installing Python & Pip', type: 'text', content: 'Setup guide for Python...', xpValue: 15, estimatedTime: '15m', order: 2 },
        ]},
        { id: 'mod-python-2', title: 'Python Fundamentals', order: 2, lessons: [
            { id: 'l-python-2-1', title: 'Python Data Structures (Lists, Dictionaries)', type: 'interactive_code', content: 'Interactive exercises...', xpValue: 30, estimatedTime: '30m', order: 1 },
            { id: 'l-python-2-2', title: 'Python Basics Quiz', type: 'quiz', content: 'Quiz JSON for Python...', xpValue: 40, estimatedTime: '15m', order: 2 },
        ]},
    ],
    estimatedTime: '10 hours',
    difficulty: 'Beginner',
    badgeOnCompletionId: 'badge-python-pioneer',
    tags: ['Python', 'Beginner', 'Scripting', 'Automation', 'Data Science'],
    certificateFee: CERTIFICATE_FEE_ETB,
  },
  {
    id: 'course-go-concurrency',
    title: 'Concurrency in Go',
    description: 'Dive deep into Goroutines, Channels, and Mutexes.',
    longDescription: 'Unlock the power of Go\'s concurrency model. This course explores goroutines, channels, select statements, mutexes, and common concurrency patterns. Learn how to write efficient and safe concurrent programs.',
    imageUrl: 'https://placehold.co/600x400/76D7C4/000000.png?text=Go+Concurrent&font=montserrat',
    modules: [
      { id: 'mod-go-con-1', title: 'Understanding Goroutines', order: 1, lessons: [
        { id: 'l-go-con-1-1', title: 'Intro to Goroutines', type: 'video', content: 'https://www.youtube.com/watch?v=LvgVSSpwND8', xpValue: 25, estimatedTime: '15m', order: 1}, 
      ] },
      { id: 'mod-go-con-2', title: 'Mastering Channels', order: 2, lessons: [
        { id: 'l-go-con-2-1', title: 'Basic Channel Usage', type: 'text', content: 'channel_basics.md', xpValue: 30, estimatedTime: '20m', order: 1},
      ] },
    ],
    estimatedTime: '15 hours',
    difficulty: 'Intermediate',
    tags: ['Go', 'Concurrency', 'Intermediate', 'Advanced'],
    certificateFee: CERTIFICATE_FEE_ETB + 100, // Slightly more expensive for advanced
  },
  {
    id: 'course-go-web',
    title: 'Building Web Apps with Go',
    description: 'Learn to build robust web applications using Go\'s standard library and popular frameworks.',
    longDescription: 'This practical course guides you through building web applications with Go. Cover topics like HTTP servers, routing, templating, database interaction, and an introduction to frameworks like Gin or Echo.',
    imageUrl: 'https://placehold.co/600x400/5DADE2/FFFFFF.png?text=Go+Web+Dev&font=montserrat',
    modules: [],
    estimatedTime: '20 hours',
    difficulty: 'Intermediate',
    tags: ['Go', 'Web Development', 'Backend', 'API'],
    certificateFee: CERTIFICATE_FEE_ETB + 150, // Slightly more expensive for advanced
  },
];

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 'ch1', title: 'Daily Syntax Drill (Go)', description: 'Test your Go syntax knowledge with a quick daily quiz.', xpBonus: 50, type: 'daily', difficulty: 'Easy', relatedSkills: ['Go Fundamentals'] },
  { id: 'ch2', title: 'Concurrency Debugger (Go)', description: 'Find the bug in a concurrent Go program.', xpBonus: 150, badgeBonusId: 'badge-syntax-savvy', type: 'special', difficulty: 'Medium', relatedSkills: ['Concurrency in Go'] },
  { id: 'ch3', title: 'Weekly Java OOP Puzzle', description: 'Solve an object-oriented design puzzle in Java.', xpBonus: 200, type: 'weekly', difficulty: 'Medium', relatedSkills: ['Java Basics', 'OOP'] },
  { id: 'ch4', title: 'Python Scripting Challenge', description: 'Write a Python script to automate a file task.', xpBonus: 100, type: 'special', difficulty: 'Easy', relatedSkills: ['Python for Beginners', 'Scripting'] },
];

export const MOCK_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'lp1',
    title: 'Full Stack Go Developer',
    description: 'A comprehensive path from beginner to proficient Go developer, covering backend and frontend basics.',
    imageUrl: 'https://placehold.co/800x300/1ABC9C/FFFFFF.png?text=Go+Developer+Path&font=montserrat',
    nodes: [
      { id: 'lpn1-1', label: 'Go Fundamentals', type: 'course', resourceId: 'course-go-fundamentals', isUnlocked: true, childrenNodeIds: ['lpn1-2']},
      { id: 'lpn1-2', label: 'Concurrency Concepts', type: 'topic_group', description: "Understanding Go's approach to parallelism", isUnlocked: false, childrenNodeIds: ['lpn1-3'], parentId: 'lpn1-1'},
      { id: 'lpn1-3', label: 'Concurrency in Go (Course)', type: 'course', resourceId: 'course-go-concurrency', isUnlocked: false, childrenNodeIds: ['lpn1-4'], parentId: 'lpn1-2' },
      { id: 'lpn1-4', label: 'Build a Concurrent Tool', type: 'custom_challenge', description: "Apply your concurrency skills", isUnlocked: false, parentId: 'lpn1-3' },
      { id: 'lpn1-5', label: 'Go Web Development (Course)', type: 'course', resourceId: 'course-go-web', isUnlocked: false, parentId: 'lpn1-4' },
    ],
  },
  {
    id: 'lp2',
    title: 'Java Enterprise Pathway',
    description: 'Master Java for enterprise-level application development.',
    imageUrl: 'https://placehold.co/800x300/F39C12/FFFFFF.png?text=Java+Enterprise+Path&font=montserrat',
    nodes: [
      { id: 'lpn2-1', label: 'Java Basics', type: 'course', resourceId: 'course-java-basics', isUnlocked: true, childrenNodeIds: ['lpn2-2']},
      { id: 'lpn2-2', label: 'Advanced Java (Coming Soon)', type: 'topic_group', description: "Dive into advanced Java topics", isUnlocked: false, parentId: 'lpn2-1'},
    ],
  },
  {
    id: 'lp3',
    title: 'Python Data Science & AI Voyager',
    description: 'Explore Python for data analysis, machine learning, and AI.',
    imageUrl: 'https://placehold.co/800x300/3498DB/FFFFFF.png?text=Python+AI+Path&font=montserrat',
    nodes: [
      { id: 'lpn3-1', label: 'Python for Beginners', type: 'course', resourceId: 'course-python-beginners', isUnlocked: true, childrenNodeIds: ['lpn3-2']},
      { id: 'lpn3-2', label: 'Data Analysis with Pandas (Coming Soon)', type: 'topic_group', description: "Learn data manipulation", isUnlocked: false, parentId: 'lpn3-1'},
    ],
  },
];


export const MOCK_PERSONALIZED_MISSIONS: PersonalizedMission[] = [
    {
        id: 'mission1',
        title: 'Strengthen Your Concurrency Skills (Go)',
        description: 'Based on your recent quiz performance, focusing on channel usage in concurrent Go programs could be beneficial. This mission will help you master advanced channel patterns.',
        relatedWeakArea: 'Advanced Channel Patterns in Go Concurrency',
        suggestedAction: {
            type: 'complete_lesson',
            resourceId: 'l-go-con-2-1', // Hypothetical lesson ID in Course Go Concurrency
            details: 'Review the lesson on "Basic Channel Usage" in the "Concurrency in Go" course, then complete the associated coding exercise.',
        },
        reward: '150 XP and the "Channel Explorer" skill badge',
    },
    {
        id: 'mission2',
        title: 'Tackle a Real-World Web Challenge (Go)',
        description: 'You\'re making good progress in web development. Try applying your skills to build a small, practical web service. This will solidify your understanding of routing and handlers.',
        relatedWeakArea: 'Practical Application of Web Routing',
        suggestedAction: {
            type: 'take_challenge',
            resourceId: 'ch-web-mini-project-go', // Hypothetical challenge ID
            details: 'Complete the "Miniature URL Shortener (Go)" challenge, focusing on efficient routing and request handling.',
        },
        reward: '200 XP and progress towards "Go Web Artisan" badge',
    },
];

// Function to get a course by ID
export const getCourseById = (id: string | undefined): Course | undefined => {
  if (!id) return undefined;
  return MOCK_COURSES.find(course => course.id === id);
};


export const getUserCourseProgress = (userProfile: UserProfile | null, courseId: string) => {
  if (!userProfile) return null;
  const course = MOCK_COURSES.find(c => c.id === courseId);
  if (!course) return null;

  const isCompleted = userProfile.completedCourseIds.includes(courseId);
  const userProgress = isCompleted ? 100 : 0;
  return { ...course, userProgress, isCompleted };
};

export function isSubscriptionActive(user: UserProfile | null): boolean {
  if (!user) return false;
  if (user.subscriptionStatus === 'active') {
    if (user.subscriptionEndDate) {
      return new Date(user.subscriptionEndDate) > new Date();
    }
    // If active and no end date, assume it's a special case like lifetime or manually set
    // For robust production, an end date should always exist for 'active' status.
    return true;
  }
  return false;
}


    