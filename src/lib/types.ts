export type Priority = "low" | "medium" | "high";

export type TaskStatus = "todo" | "in_progress" | "done";

export type LifeArea =
  | "work"
  | "health"
  | "finance"
  | "learning"
  | "personal"
  | "relationships";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  priority: Priority;
  area: LifeArea;
  /** ISO date string (yyyy-mm-dd) */
  dueDate?: string;
  /** Minutes of focused work the AI estimates this needs. */
  estimateMinutes: number;
  goalId?: string;
  createdAt: string;
  aiSuggested?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  /** ISO datetime */
  start: string;
  end: string;
  area: LifeArea;
  location?: string;
  attendees?: string[];
  kind: "meeting" | "focus" | "personal" | "habit";
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  area: LifeArea;
  targetDate: string;
  progress: number;
  milestones: { id: string; title: string; done: boolean }[];
  metric?: { label: string; current: number; target: number; unit: string };
}

export interface Habit {
  id: string;
  name: string;
  cadence: "daily" | "weekdays" | "3x_week";
  area: LifeArea;
  streak: number;
  bestStreak: number;
  /** Last 28 days, most recent last. */
  history: boolean[];
  timeOfDay: "morning" | "afternoon" | "evening";
  completedToday: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  pinned: boolean;
  aiSummary?: string;
}

export interface PlanBlock {
  id: string;
  start: string;
  end: string;
  title: string;
  type: "focus" | "meeting" | "habit" | "break" | "admin";
  area: LifeArea;
  rationale: string;
  taskId?: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: "housing" | "food" | "transport" | "health" | "fun" | "savings";
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  plan: "Free" | "Pro" | "Team";
  timezone: string;
  workingHours: { start: string; end: string };
}
