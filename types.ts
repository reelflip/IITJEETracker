
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
  passwordHash: string; 
  role: 'admin' | 'student'; // Added Role
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

export interface Topic {
  id: string;
  name: string;
  subject: Subject;
  phase: number; // 1-6 for a comprehensive 2-year course
  estimatedHours: number;
  theorySummary?: string; // New field for basic theory notes
}

export interface ExerciseProgress {
  completed: number;
  total: number;
}

export interface TopicProgress {
  topicId: string;
  status: Status;
  notes?: string;
  // Fixed 4 exercises as per requirement
  exercises: [ExerciseProgress, ExerciseProgress, ExerciseProgress, ExerciseProgress];
}

export interface PlanRequest {
  topics: string[];
  daysAvailable: number;
  hoursPerDay: number;
  focusArea: string; // e.g., "Problem Solving", "Theory Revision"
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

// New interfaces for Structured Timetable
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
