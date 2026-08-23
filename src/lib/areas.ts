import type { LifeArea, Priority, TaskStatus } from "@/lib/types";

export const AREAS: { value: LifeArea; label: string }[] = [
  { value: "work", label: "Work" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "learning", label: "Learning" },
  { value: "personal", label: "Personal" },
  { value: "relationships", label: "Relationships" },
];

export const areaLabel: Record<LifeArea, string> = {
  work: "Work",
  health: "Health",
  finance: "Finance",
  learning: "Learning",
  personal: "Personal",
  relationships: "Relationships",
};

/** Tailwind classes per life area — one source of truth for area color. */
export const areaClasses: Record<LifeArea, { chip: string; dot: string; bar: string }> = {
  work: {
    chip: "bg-primary/10 text-primary ring-1 ring-primary/20",
    dot: "bg-primary",
    bar: "bg-primary",
  },
  health: {
    chip: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  finance: {
    chip: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  learning: {
    chip: "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20 dark:text-sky-300",
    dot: "bg-sky-500",
    bar: "bg-sky-500",
  },
  personal: {
    chip: "bg-fuchsia-500/10 text-fuchsia-700 ring-1 ring-fuchsia-500/20 dark:text-fuchsia-300",
    dot: "bg-fuchsia-500",
    bar: "bg-fuchsia-500",
  },
  relationships: {
    chip: "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
  },
};

export const priorityClasses: Record<Priority, string> = {
  high: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
  medium: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300",
  low: "bg-muted text-muted-foreground ring-1 ring-border",
};

export const priorityLabel: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const statusLabel: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};
