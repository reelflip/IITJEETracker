
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

export interface Topic {
  id: string;
  name: string;
  subject: Subject;
  phase: number; // 1-6 for a comprehensive 2-year course
  estimatedHours: number;
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
