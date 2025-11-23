
export enum Subject {
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  MATHS = 'Maths'
}

export enum Status {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  REVISED = 'Revised'
}

export enum Difficulty {
  EASY = 'Easy (Mains Level)',
  MEDIUM = 'Medium (Advanced Foundation)',
  HARD = 'Hard (Advanced Challenger)'
}

export interface User {
  id: string;
  name: string;
  email: string;
  coachingInstitute?: string;
  targetYear?: string;
  passwordHash: string; 
  role: 'admin' | 'student';
  // New fields for recovery
  securityQuestion?: string;
  securityAnswer?: string;
}

export const COACHING_INSTITUTES = [
  "Bakliwal Tutorials",
  "Allen Career Institute",
  "Aakash Institute",
  "FIITJEE",
  "Resonance",
  "Sri Chaitanya",
  "Narayana",
  "Physics Wallah (Vidyapeeth)",
  "Unacademy (Offline/Online)",
  "Motion Education",
  "Reliable Institute",
  "Vibrant Academy",
  "Self Study / Other"
];

export const SECURITY_QUESTIONS = [
  "What is the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What is your favorite food?",
  "What is the name of your elementary school?",
  "Who is your favorite superhero?"
];

export interface Topic {
  id: string;
  name: string;
  subject: Subject;
  phase: number; 
  estimatedHours: number;
  theorySummary?: string;
}

export interface ExerciseProgress {
  completed: number;
  total: number;
}

export interface TopicProgress {
  topicId: string;
  status: Status;
  notes?: string;
  exercises: [ExerciseProgress, ExerciseProgress, ExerciseProgress, ExerciseProgress];
}

export interface TopicPracticeStats {
  topicId: string;
  attempts: number;
  correct: number;
}

export interface PlanRequest {
  topics: string[];
  daysAvailable: number;
  hoursPerDay: number;
  focusArea: string; 
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

export interface TimetableConstraints {
  coachingDays: string[];
  coachingTime: { start: string; end: string };
  schoolDetails: { attending: boolean; start: string; end: string };
  sleepSchedule: { wake: string; bed: string };
}

export interface DailySchedule {
  day: string;
  activities: string[];
  type: 'coaching' | 'school' | 'holiday' | 'exam';
  hours: number;
}

export interface WeeklySchedule {
  summary: string;
  schedule: DailySchedule[];
  guidelines: string[];
}
