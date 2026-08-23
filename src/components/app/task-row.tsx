"use client";

import { CalendarClock, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { areaClasses, areaLabel, priorityClasses, priorityLabel } from "@/lib/areas";
import { formatDuration, isOverdue, relativeDayLabel } from "@/lib/format";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TaskRow({
  task,
  onToggle,
  onRemove,
  compact = false,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onRemove?: (id: string) => void;
  compact?: boolean;
}) {
  const done = task.status === "done";
  const overdue = !done && isOverdue(task.dueDate);

  return (
    <li
      className={cn(
        "group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent/60",
        done && "opacity-60",
      )}
    >
      <Checkbox
        checked={done}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={done ? `Mark ${task.title} as not done` : `Complete ${task.title}`}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium", done && "line-through")}>{task.title}</p>
        {task.notes && !compact ? (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{task.notes}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
              areaClasses[task.area].chip,
            )}
          >
            {areaLabel[task.area]}
          </span>
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 font-medium",
              priorityClasses[task.priority],
            )}
          >
            {priorityLabel[task.priority]}
          </span>
          {task.dueDate ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-muted-foreground",
                overdue && "font-medium text-destructive",
              )}
            >
              <CalendarClock className="size-3" />
              {relativeDayLabel(task.dueDate)}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3" />
            {formatDuration(task.estimateMinutes)}
          </span>
        </div>
      </div>
      {onRemove ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${task.title}`}
          className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          onClick={() => onRemove(task.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      ) : null}
    </li>
  );
}
