"use client";

import { Flame, Sunrise, Sunset, Trophy } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { areaClasses, areaLabel } from "@/lib/areas";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

const cadenceLabel: Record<string, string> = {
  daily: "Daily",
  weekdays: "Weekdays",
  "3x_week": "3× per week",
};

const timeIcon = {
  morning: Sunrise,
  afternoon: Flame,
  evening: Sunset,
} as const;

export function HabitsView() {
  const { habits, toggleHabit } = useAppStore();

  const doneToday = habits.filter((h) => h.completedToday).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);
  const consistency =
    habits.length === 0
      ? 0
      : Math.round(
          (habits.reduce(
            (sum, h) => sum + h.history.filter(Boolean).length / Math.max(1, h.history.length),
            0,
          ) /
            habits.length) *
            100,
        );

  return (
    <>
      <PageHeader
        title="Habits"
        description="The small repeated things. Tap a day to mark it done — streaks update instantly."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Completed today"
          value={`${doneToday}/${habits.length}`}
          icon={Flame}
          hint="keep the streak alive"
        />
        <StatCard label="Best streak" value={`${bestStreak} days`} icon={Trophy} />
        <StatCard
          label="28-day consistency"
          value={`${consistency}%`}
          icon={Sunrise}
          trend={{ value: "+9%" }}
          hint="vs last month"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {habits.map((habit) => {
          const Icon = timeIcon[habit.timeOfDay];
          return (
            <article key={habit.id} className="surface flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl",
                      areaClasses[habit.area].chip,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <h2 className="font-semibold">{habit.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {cadenceLabel[habit.cadence]} · {areaLabel[habit.area]} ·{" "}
                      <span className="capitalize">{habit.timeOfDay}</span>
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 gap-1 text-[11px]">
                  <Flame className="size-3" />
                  {habit.streak}d
                </Badge>
              </div>

              <div>
                <p className="mb-2 text-xs text-muted-foreground">Last 28 days</p>
                <div className="grid grid-cols-14 gap-1">
                  {habit.history.map((done, index) => (
                    <span
                      key={index}
                      title={`Day ${index + 1}: ${done ? "done" : "missed"}`}
                      className={cn(
                        "h-4 rounded-[4px]",
                        done ? areaClasses[habit.area].bar : "bg-muted",
                      )}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleHabit(habit.id)}
                aria-pressed={habit.completedToday}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                  habit.completedToday
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-border hover:bg-accent",
                )}
              >
                {habit.completedToday ? "Done today" : "Mark done today"}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}
