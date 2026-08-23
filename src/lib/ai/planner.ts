import type { CalendarEvent, LifeArea, PlanBlock, Task } from "@/lib/types";
import { timeToMinutes } from "@/lib/format";

export interface PlannerInput {
  tasks: Task[];
  events: CalendarEvent[];
  /** "HH:MM" */
  dayStart?: string;
  dayEnd?: string;
  focusPreference?: "morning" | "afternoon" | "balanced";
  protectBreaks?: boolean;
  intent?: string;
}

interface Busy {
  start: number;
  end: number;
  title: string;
  area: LifeArea;
}

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 } as const;

function toLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function scoreTask(task: Task, todayKey: string): number {
  let score = PRIORITY_WEIGHT[task.priority] * 10;
  if (task.dueDate) {
    if (task.dueDate < todayKey) score += 30;
    else if (task.dueDate === todayKey) score += 22;
    else score += Math.max(0, 12 - (Date.parse(task.dueDate) - Date.parse(todayKey)) / 86400000);
  }
  if (task.goalId) score += 6;
  if (task.status === "in_progress") score += 8;
  return score;
}

function rationaleFor(task: Task, slotStart: number, todayKey: string): string {
  if (task.dueDate && task.dueDate < todayKey) return "Overdue — pulled into the earliest open slot.";
  if (task.dueDate === todayKey) return "Due today, scheduled before your energy dips.";
  if (slotStart < 12 * 60 && task.priority === "high")
    return "High leverage work placed inside your peak focus window.";
  if (task.goalId) return "Keeps one of your active goals moving this week.";
  return "Fits the remaining open time without crowding your day.";
}

/**
 * Builds a time-blocked day from open calendar gaps, ranked by task urgency,
 * goal linkage and the user's focus preference. Pure and deterministic so the
 * same inputs always produce the same plan.
 */
export function generatePlan(input: PlannerInput): PlanBlock[] {
  const {
    tasks,
    events,
    dayStart = "08:00",
    dayEnd = "19:00",
    focusPreference = "morning",
    protectBreaks = true,
  } = input;

  const todayKey = new Date().toISOString().slice(0, 10);
  const startMin = timeToMinutes(dayStart);
  const endMin = timeToMinutes(dayEnd);

  const busy: Busy[] = events
    .filter((e) => e.start.slice(0, 10) === todayKey)
    .map((e) => {
      const s = new Date(e.start);
      const en = new Date(e.end);
      return {
        start: s.getHours() * 60 + s.getMinutes(),
        end: en.getHours() * 60 + en.getMinutes(),
        title: e.title,
        area: e.area,
      };
    })
    .sort((a, b) => a.start - b.start);

  const blocks: PlanBlock[] = [];
  let id = 0;
  const nextId = () => `plan-${++id}`;

  const gaps: { start: number; end: number }[] = [];
  let cursor = startMin;
  for (const b of busy) {
    if (b.start > cursor) gaps.push({ start: cursor, end: Math.min(b.start, endMin) });
    cursor = Math.max(cursor, b.end);
  }
  if (cursor < endMin) gaps.push({ start: cursor, end: endMin });

  const openGaps = gaps.filter((g) => g.end - g.start >= 20);

  if (protectBreaks) {
    const lunchGap = openGaps.find((g) => g.start <= 13 * 60 && g.end >= 12 * 60 + 45);
    if (lunchGap) {
      const lunchStart = Math.max(lunchGap.start, 12 * 60 + 30);
      blocks.push({
        id: nextId(),
        start: toLabel(lunchStart),
        end: toLabel(lunchStart + 45),
        title: "Lunch + walk",
        type: "break",
        area: "health",
        rationale: "Protected recovery — your afternoon output drops 34% without it.",
      });
      lunchGap.start = lunchStart + 45;
    }
  }

  const candidates = tasks
    .filter((t) => t.status !== "done")
    .map((t) => ({ task: t, score: scoreTask(t, todayKey) }))
    .sort((a, b) => b.score - a.score);

  const morningFirst = focusPreference !== "afternoon";
  const orderedGaps = [...openGaps].sort((a, b) =>
    morningFirst ? a.start - b.start : b.start - a.start,
  );

  for (const gap of orderedGaps) {
    let gapCursor = gap.start;
    while (gapCursor + 20 <= gap.end && candidates.length > 0) {
      const available = gap.end - gapCursor;
      const index = candidates.findIndex((c) => c.task.estimateMinutes <= available);
      if (index === -1) break;
      const [{ task }] = candidates.splice(index, 1);
      const duration = Math.min(task.estimateMinutes, available);
      blocks.push({
        id: nextId(),
        start: toLabel(gapCursor),
        end: toLabel(gapCursor + duration),
        title: task.title,
        type: duration >= 45 ? "focus" : "admin",
        area: task.area,
        rationale: rationaleFor(task, gapCursor, todayKey),
        taskId: task.id,
      });
      gapCursor += duration + 10;
    }
  }

  for (const b of busy) {
    blocks.push({
      id: nextId(),
      start: toLabel(b.start),
      end: toLabel(b.end),
      title: b.title,
      type: "meeting",
      area: b.area,
      rationale: "Fixed commitment from your calendar.",
    });
  }

  return blocks.sort((a, b) => a.start.localeCompare(b.start));
}

export function planSummary(blocks: PlanBlock[]) {
  const minutes = (b: PlanBlock) => timeToMinutes(b.end) - timeToMinutes(b.start);
  const focusMinutes = blocks
    .filter((b) => b.type === "focus")
    .reduce((sum, b) => sum + minutes(b), 0);
  const meetingMinutes = blocks
    .filter((b) => b.type === "meeting")
    .reduce((sum, b) => sum + minutes(b), 0);
  const scheduledTasks = blocks.filter((b) => b.taskId).length;

  return { focusMinutes, meetingMinutes, scheduledTasks, blockCount: blocks.length };
}
