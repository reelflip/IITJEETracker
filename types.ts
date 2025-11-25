
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

// Matches SQL: users table
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string; // Internal use
  role: 'admin' | 'student' | 'parent';
  coachingInstitute?: string; // coaching_institute
  targetYear?: string;        // target_year
  securityQuestion?: string;  // security_question
  securityAnswer?: string;    // security_answer
  linkedUserId?: string;      // linked_user_id
  connectionRequestFrom?: string; // connection_request_from
  created_at?: string;
  updated_at?: string;
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
  "What is the favorite food?",
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

// Matches SQL: chapter_progress table (Frontend representation)
export interface TopicProgress {
  topicId: string; // topic_id
  status: Status;
  notes?: string;
  exercises: [ExerciseProgress, ExerciseProgress, ExerciseProgress, ExerciseProgress];
}

// Helper type for DB flat structure mapping
export interface DBChapterProgress {
  id?: number;
  user_id: string;
  topic_id: string;
  status: Status;
  notes: string;
  ex1_solved: number; ex1_total: number;
  ex2_solved: number; ex2_total: number;
  ex3_solved: number; ex3_total: number;
  ex4_solved: number; ex4_total: number;
  updated_at?: string;
}

// Matches SQL: practice_stats table
export interface TopicPracticeStats {
  topicId: string; // topic_id
  attempts: number;
  correct: number;
  last_attempt_at?: string;
}

export interface PlanRequest {
  topics: string[];
  daysAvailable: number;
  hoursPerDay: number;
  focusArea: string; 
}

export interface Question {
  id?: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  subject?: Subject;
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

// Matches SQL: timetables table (stored as JSON)
export interface WeeklySchedule {
  summary: string;
  schedule: DailySchedule[];
  guidelines: string[];
}

// Matches SQL: custom_exams table
export interface ExamPaper {
  id: string;
  title: string;
  year: string;
  type: 'Mains' | 'Advanced';
  durationMinutes: number;
  totalMarks: number;
  sections: {
    subject: Subject;
    questions: Question[];
  }[];
  created_by?: string;
  created_at?: string;
}

export enum QuestionPaletteStatus {
  NOT_VISITED = 'not_visited',
  NOT_ANSWERED = 'not_answered',
  ANSWERED = 'answered',
  MARKED_FOR_REVIEW = 'marked',
  ANSWERED_AND_MARKED = 'answered_marked'
}

// Matches SQL: exam_results table
export interface ExamResult {
  id?: number;
  examId: string;
  score: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number;
  timeTaken: string;
  attempted_at?: string;
}

// Matches SQL: notices table
export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string; // mapped from created_at
  isImportant: boolean; // is_important
}

// Matches SQL: motivation table
export interface MotivationItem {
  id: string;
  type: 'quote' | 'image';
  content: string; 
  author?: string;
}

// Matches SQL: blogs table
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string; // mapped from created_at
  readTime: string; // read_time
  category: 'Strategy' | 'Mental Health' | 'Success Story' | 'Academic';
  imageUrl?: string; // image_url
}
