"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { TaskRow } from "@/components/app/task-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { insights } from "@/lib/data/analytics";
import { formatDuration, minutesToLabel, timeToMinutes, toDateKey } from "@/lib/format";
import { generatePlan, planSummary } from "@/lib/ai/planner";
import { useAppStore } from "@/lib/store/app-store";
import { areaClasses } from "@/lib/areas";
import { cn } from "@/lib/utils";

const blockTone: Record<string, string> = {
  focus: "bg-primary",
  meeting: "bg-sky-500",
  habit: "bg-emerald-500",
  break: "bg-amber-500",
  admin: "bg-fuchsia-500",
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardView() {
  const { tasks, events, goals, habits, user, toggleTask, toggleHabit } = useAppStore();
  const todayKey = toDateKey(new Date());

  const plan = useMemo(() => generatePlan({ tasks, events }), [tasks, events]);
  const summary = useMemo(() => planSummary(plan), [plan]);

  const dueToday = tasks.filter((t) => t.dueDate === todayKey);
  const completedToday = dueToday.filter((t) => t.status === "done").length;
  const priorityTasks = tasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => {
      const rank = { high: 0, medium: 1, low: 2 } as const;
      return rank[a.priority] - rank[b.priority];
    })
    .slice(0, 5);
  const habitsDone = habits.filter((h) => h.completedToday).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const activeGoals = goals.slice(0, 3);

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${user.name.split(" ")[0]}`}
        description={`${dueToday.length} tasks due today, ${summary.focusMinutes > 0 ? formatDuration(summary.focusMinutes) : "no"} focus time scheduled.`}
        actions={
          <Button render={<Link href="/planner" />}>
            <Sparkles className="size-4" />
            Build my plan
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tasks done today"
          value={`${completedToday}/${dueToday.length || 0}`}
          icon={CheckCircle2}
          hint="due today"
        />
        <StatCard
          label="Focus scheduled"
          value={formatDuration(summary.focusMinutes)}
          icon={Timer}
          trend={{ value: "+42m" }}
          hint="vs last week"
        />
        <StatCard
          label="Habits completed"
          value={`${habitsDone}/${habits.length}`}
          icon={Flame}
          hint={`best streak ${bestStreak}d`}
        />
        <StatCard
          label="Plan adherence"
          value="91%"
          icon={TrendingUp}
          trend={{ value: "+6%" }}
          hint="6-week average"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="surface p-5 lg:col-span-2" aria-labelledby="today-plan">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 id="today-plan" className="font-semibold">
                Today&apos;s AI plan
              </h2>
              <p className="text-xs text-muted-foreground">
                {summary.blockCount} blocks · {formatDuration(summary.focusMinutes)} of deep work
              </p>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/planner" />}>
              Replan
              <ArrowRight className="size-4" />
            </Button>
          </div>

          {plan.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon={Sparkles}
              title="No plan yet"
              description="Add a few tasks and LifeOS will schedule them around your calendar."
              action={
                <Button size="sm" render={<Link href="/tasks" />}>
                  Add tasks
                </Button>
              }
            />
          ) : (
            <ol className="mt-4 space-y-2">
              {plan.map((block) => (
                <li
                  key={block.id}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background px-3 py-3"
                >
                  <span className="w-14 shrink-0 pt-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                    {minutesToLabel(timeToMinutes(block.start))}
                  </span>
                  <span
                    className={cn("mt-1 h-9 w-1 shrink-0 rounded-full", blockTone[block.type])}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{block.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {block.rationale}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[10px] capitalize">
                    {block.type}
                  </Badge>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="flex flex-col gap-4">
          <section className="surface p-5" aria-labelledby="priority-tasks">
            <div className="flex items-center justify-between">
              <h2 id="priority-tasks" className="font-semibold">
                Priority tasks
              </h2>
              <Button variant="ghost" size="sm" render={<Link href="/tasks" />}>
                All
              </Button>
            </div>
            {priorityTasks.length === 0 ? (
              <EmptyState
                className="mt-3 py-8"
                icon={CheckCircle2}
                title="Inbox zero"
                description="Every open task is done. Enjoy the quiet."
              />
            ) : (
              <ul className="mt-2 -mx-2">
                {priorityTasks.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggleTask} compact />
                ))}
              </ul>
            )}
          </section>

          <section className="surface p-5" aria-labelledby="today-habits">
            <div className="flex items-center justify-between">
              <h2 id="today-habits" className="font-semibold">
                Habits
              </h2>
              <Button variant="ghost" size="sm" render={<Link href="/habits" />}>
                All
              </Button>
            </div>
            <ul className="mt-3 space-y-2">
              {habits.slice(0, 4).map((habit) => (
                <li key={habit.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleHabit(habit.id)}
                    aria-pressed={habit.completedToday}
                    className={cn(
                      "flex flex-1 items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                      habit.completedToday
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-border/60 hover:bg-accent/60",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        areaClasses[habit.area].dot,
                      )}
                      aria-hidden="true"
                    />
                    <span className="flex-1 font-medium">{habit.name}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className="size-3" />
                      {habit.streak}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="surface p-5 lg:col-span-2" aria-labelledby="goal-progress">
          <div className="flex items-center justify-between">
            <h2 id="goal-progress" className="font-semibold">
              Goal progress
            </h2>
            <Button variant="ghost" size="sm" render={<Link href="/goals" />}>
              All goals
            </Button>
          </div>
          <ul className="mt-4 space-y-4">
            {activeGoals.map((goal) => (
              <li key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <Target className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">{goal.title}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">
                    {goal.progress}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", areaClasses[goal.area].bar)}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-5" aria-labelledby="ai-insights">
          <h2 id="ai-insights" className="font-semibold">
            AI insights
          </h2>
          <ul className="mt-3 space-y-3">
            {insights.slice(0, 3).map((insight) => (
              <li key={insight.id} className="rounded-xl bg-accent/50 p-3">
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {insight.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Working hours {minutesToLabel(Number(user.workingHours.start.split(":")[0]) * 60)} –{" "}
            {minutesToLabel(Number(user.workingHours.end.split(":")[0]) * 60)} · {user.timezone}
          </p>
        </section>
      </div>
    </>
  );
}
