"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Circle,
  Flame,
  Sparkles,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { areaClasses } from "@/lib/areas";
import { Progress } from "@/components/ui/progress";

type TabId = "today" | "goals" | "analytics";

const tabs: { id: TabId; label: string; icon: typeof CalendarDays }[] = [
  { id: "today", label: "Today", icon: CalendarDays },
  { id: "goals", label: "Goals", icon: Target },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const timeline = [
  { time: "9:30", title: "Deep work — investor update", type: "focus", area: "work" as const },
  { time: "11:15", title: "Product standup", type: "meeting", area: "work" as const },
  { time: "12:00", title: "Onboarding funnel review", type: "focus", area: "work" as const },
  { time: "13:00", title: "Lunch + walk", type: "break", area: "health" as const },
  { time: "16:15", title: "Call Mom", type: "admin", area: "relationships" as const },
  { time: "18:30", title: "Strength session", type: "habit", area: "health" as const },
];

const previewTasks = [
  { title: "Ship the Q3 investor update", done: false, area: "work" as const },
  { title: "Review onboarding drop-off", done: false, area: "work" as const },
  { title: "Rebalance index portfolio", done: false, area: "finance" as const },
  { title: "Meal prep for the week", done: true, area: "health" as const },
];

const previewGoals = [
  { title: "Take LifeOS to $1M ARR", progress: 42, area: "work" as const, sub: "$420k of $1M" },
  { title: "Run a sub-50 minute 10K", progress: 64, area: "health" as const, sub: "53:10 best" },
  { title: "12-month runway fund", progress: 58, area: "finance" as const, sub: "7.1 of 12 months" },
  { title: "Fluent in systems design", progress: 35, area: "learning" as const, sub: "7 of 20 chapters" },
];

const bars = [62, 78, 44, 92, 84, 33, 26];
const days = ["M", "T", "W", "T", "F", "S", "S"];

export function DashboardPreview() {
  const [tab, setTab] = useState<TabId>("today");
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto max-w-6xl">
      <div
        aria-hidden
        className="absolute -inset-x-6 -top-6 -bottom-10 -z-10 rounded-[2.5rem] bg-gradient-to-b from-primary/12 to-transparent blur-2xl"
      />
      <div className="surface overflow-hidden rounded-[1.75rem] p-1.5 ring-1 ring-foreground/5">
        <div className="rounded-[1.35rem] border border-border/60 bg-card">
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="mx-auto hidden items-center gap-2 rounded-lg bg-muted px-3 py-1 text-xs text-muted-foreground sm:flex">
              app.lifeos.ai/dashboard
            </div>
            <div
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              role="status"
            >
              <Sparkles className="size-3" />
              Plan ready
            </div>
          </div>

          <div className="flex flex-col gap-0 sm:flex-row">
            <div className="flex shrink-0 gap-1 border-b border-border/60 p-3 sm:w-44 sm:flex-col sm:border-r sm:border-b-0">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-pressed={tab === t.id}
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:flex-none",
                    tab === t.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <t.icon className="size-4" />
                  {t.label}
                </button>
              ))}
              <div className="hidden pt-4 sm:block">
                <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Streaks
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
                  <Flame className="size-4 text-amber-500" />
                  <span className="font-medium">21 days</span>
                </div>
              </div>
            </div>

            <div className="min-h-[22rem] flex-1 p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {tab === "today" ? <TodayPanel /> : null}
                  {tab === "goals" ? <GoalsPanel /> : null}
                  {tab === "analytics" ? <AnalyticsPanel /> : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TodayPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold">Today&apos;s AI plan</h3>
          <span className="text-xs text-muted-foreground">4h 25m focus</span>
        </div>
        <ol className="mt-3 space-y-2">
          {timeline.map((item, i) => (
            <li
              key={item.title}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5"
            >
              <span className="w-11 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                {item.time}
              </span>
              <span className={cn("h-8 w-1 rounded-full", areaClasses[item.area].bar)} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.title}</span>
              <span
                className={cn(
                  "hidden rounded-md px-2 py-0.5 text-[11px] font-medium capitalize sm:inline",
                  i === 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {item.type}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <h3 className="text-sm font-semibold">Priority tasks</h3>
          <ul className="mt-3 space-y-2.5">
            {previewTasks.map((task) => (
              <li key={task.title} className="flex items-center gap-2.5 text-sm">
                {task.done ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="size-4 shrink-0 text-muted-foreground/50" />
                )}
                <span className={cn("truncate", task.done && "text-muted-foreground line-through")}>
                  {task.title}
                </span>
                <span className={cn("ml-auto size-2 shrink-0 rounded-full", areaClasses[task.area].dot)} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-primary/25 bg-primary/[0.06] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" />
            AI insight
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your 9:30–11:30 window finishes 2.4× more tasks. LifeOS moved the investor
            update there and pushed admin work to the afternoon dip.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoalsPanel() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {previewGoals.map((goal) => (
        <div key={goal.title} className="rounded-xl border border-border/60 bg-background/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold leading-snug">{goal.title}</h3>
            <span className="text-sm font-semibold tabular-nums">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="mt-3" />
          <p className="mt-2 text-xs text-muted-foreground">{goal.sub}</p>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Focus hours", value: "27.3" },
          { label: "Plan adherence", value: "91%" },
          { label: "Tasks done", value: "47" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border/60 bg-background/60 p-4">
            <p className="text-2xl font-semibold tracking-tight">{kpi.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border/60 bg-background/60 p-4">
        <h3 className="text-sm font-semibold">Focus by day</h3>
        <div className="mt-5 flex h-40 items-end gap-3">
          {bars.map((value, i) => (
            <div key={days[i] + i} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "w-full rounded-t-md",
                  value > 80 ? "bg-primary" : "bg-primary/35",
                )}
              />
              <span className="text-xs text-muted-foreground">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
