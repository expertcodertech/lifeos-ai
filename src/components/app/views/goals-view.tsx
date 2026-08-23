"use client";

import { useState } from "react";
import { CalendarClock, Check, Target } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AREAS, areaClasses, areaLabel } from "@/lib/areas";
import { formatDay } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";
import type { LifeArea } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GoalsView() {
  const { goals, tasks, toggleMilestone } = useAppStore();
  const [area, setArea] = useState<LifeArea | "all">("all");

  const filtered = area === "all" ? goals : goals.filter((g) => g.area === area);
  const averageProgress =
    goals.length === 0
      ? 0
      : Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length);

  return (
    <>
      <PageHeader
        title="Goals"
        description="Long-range outcomes broken into milestones the planner can schedule."
        actions={
          <Badge variant="secondary" className="text-xs">
            {averageProgress}% average progress
          </Badge>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setArea("all")}
          aria-pressed={area === "all"}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            area === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
          )}
        >
          All areas
        </button>
        {AREAS.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => setArea(a.value)}
            aria-pressed={area === a.value}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              area === a.value
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals in this area"
          description="Pick another life area, or set a goal you want the planner to protect time for."
          action={
            <Button variant="outline" size="sm" onClick={() => setArea("all")}>
              Show all goals
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((goal) => {
            const linked = tasks.filter((t) => t.goalId === goal.id);
            const doneMilestones = goal.milestones.filter((m) => m.done).length;
            return (
              <article key={goal.id} className="surface flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="font-semibold">{goal.title}</h2>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                      areaClasses[goal.area].chip,
                    )}
                  >
                    {areaLabel[goal.area]}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="size-3.5" />
                      Target {formatDay(goal.targetDate)}
                    </span>
                    <span className="font-medium text-foreground tabular-nums">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full transition-[width] duration-500", areaClasses[goal.area].bar)}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {goal.metric ? (
                  <div className="rounded-xl bg-accent/50 px-3 py-2 text-xs">
                    <span className="font-medium">{goal.metric.label}: </span>
                    <span className="text-muted-foreground">
                      {goal.metric.current}
                      {goal.metric.unit} of {goal.metric.target}
                      {goal.metric.unit}
                    </span>
                  </div>
                ) : null}

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Milestones · {doneMilestones}/{goal.milestones.length}
                  </p>
                  <ul className="space-y-1.5">
                    {goal.milestones.map((milestone) => (
                      <li key={milestone.id} className="flex items-center gap-2.5">
                        <Checkbox
                          checked={milestone.done}
                          onCheckedChange={() => toggleMilestone(goal.id, milestone.id)}
                          aria-label={`Toggle milestone ${milestone.title}`}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            milestone.done && "text-muted-foreground line-through",
                          )}
                        >
                          {milestone.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {linked.length > 0 ? (
                  <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="size-3.5" />
                    {linked.filter((t) => t.status === "done").length}/{linked.length} linked tasks
                    complete
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
