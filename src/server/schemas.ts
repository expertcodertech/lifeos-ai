import { z } from "zod";

export const areaSchema = z.enum([
  "work",
  "health",
  "finance",
  "learning",
  "personal",
  "relationships",
]);

export const tasksSchema = z.object({
  title: z.string().min(1).max(200),
  notes: z.string().max(2000).optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  area: areaSchema.default("personal"),
  dueDate: z.string().optional(),
  estimateMinutes: z.number().int().min(5).max(480).default(30),
  goalId: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString().slice(0, 10)),
});

export const eventsSchema = z.object({
  title: z.string().min(1).max(200),
  start: z.string(),
  end: z.string(),
  area: areaSchema.default("work"),
  location: z.string().optional(),
  attendees: z.array(z.string()).optional(),
  kind: z.enum(["meeting", "focus", "personal", "habit"]).default("focus"),
});

export const goalsSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(1000).default(""),
  area: areaSchema.default("personal"),
  targetDate: z.string(),
  progress: z.number().min(0).max(100).default(0),
  milestones: z
    .array(z.object({ id: z.string(), title: z.string(), done: z.boolean() }))
    .default([]),
});

export const habitsSchema = z.object({
  name: z.string().min(1).max(120),
  cadence: z.enum(["daily", "weekdays", "3x_week"]).default("daily"),
  area: areaSchema.default("personal"),
  streak: z.number().int().min(0).default(0),
  bestStreak: z.number().int().min(0).default(0),
  history: z.array(z.boolean()).default([]),
  timeOfDay: z.enum(["morning", "afternoon", "evening"]).default("morning"),
  completedToday: z.boolean().default(false),
});

export const notesSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(20000).default(""),
  tags: z.array(z.string()).default([]),
  updatedAt: z.string().default(() => new Date().toISOString()),
  pinned: z.boolean().default(false),
});

export const planRequestSchema = z.object({
  intent: z.string().max(500).optional(),
  dayStart: z.string().regex(/^\d{2}:\d{2}$/).default("08:00"),
  dayEnd: z.string().regex(/^\d{2}:\d{2}$/).default("19:00"),
  focusPreference: z.enum(["morning", "afternoon", "balanced"]).default("morning"),
  protectBreaks: z.boolean().default(true),
  tasks: z.array(z.any()).optional(),
  events: z.array(z.any()).optional(),
});
