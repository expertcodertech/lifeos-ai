"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CheckSquare, ListFilter, Plus, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { TaskRow } from "@/components/app/task-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AREAS, areaLabel, statusLabel } from "@/lib/areas";
import { isoDate } from "@/lib/data/seed";
import { useAppStore } from "@/lib/store/app-store";
import type { LifeArea, Priority, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_TABS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: statusLabel.todo },
  { value: "in_progress", label: statusLabel.in_progress },
  { value: "done", label: statusLabel.done },
];

const PRIORITIES: Priority[] = ["low", "medium", "high"];

export function TasksView() {
  const { tasks, addTask, toggleTask, removeTask } = useAppStore();
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [area, setArea] = useState<LifeArea | "all">("all");
  const [query, setQuery] = useState("");

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [newArea, setNewArea] = useState<LifeArea>("work");
  const [estimate, setEstimate] = useState(45);
  const [due, setDue] = useState(isoDate(0));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((task) => {
      if (status !== "all" && task.status !== status) return false;
      if (area !== "all" && task.area !== area) return false;
      if (q && !`${task.title} ${task.notes ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tasks, status, area, query]);

  const grouped = useMemo(() => {
    const open = filtered.filter((t) => t.status !== "done");
    const done = filtered.filter((t) => t.status === "done");
    return { open, done };
  }, [filtered]);

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask({
      title: trimmed,
      priority,
      area: newArea,
      estimateMinutes: estimate,
      dueDate: due || undefined,
    });
    setTitle("");
    toast.success("Task added", { description: "The AI planner will slot it into your day." });
  }

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Everything you owe yourself, ranked by what actually matters today."
        actions={
          <span className="text-sm text-muted-foreground">
            {grouped.open.length} open · {grouped.done.length} done
          </span>
        }
      />

      <form
        onSubmit={handleAdd}
        className="surface mb-6 flex flex-col gap-4 p-4 sm:p-5"
        aria-label="Add a task"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="task-title">New task</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Draft the Q3 investor update"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-due">Due</Label>
            <Input
              id="task-due"
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="sm:w-40"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-estimate">Estimate (min)</Label>
            <Input
              id="task-estimate"
              type="number"
              min={5}
              step={5}
              value={estimate}
              onChange={(e) => setEstimate(Number(e.target.value) || 30)}
              className="sm:w-32"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Priority</span>
            <div className="flex rounded-lg border border-border p-0.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  aria-pressed={priority === p}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                    priority === p
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Area</span>
            <div className="flex flex-wrap gap-1">
              {AREAS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setNewArea(a.value)}
                  aria-pressed={newArea === a.value}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    newArea === a.value
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="ml-auto" disabled={!title.trim()}>
            <Plus className="size-4" />
            Add task
          </Button>
        </div>
      </form>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex rounded-lg border border-border p-0.5" role="tablist" aria-label="Filter by status">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={status === tab.value}
              onClick={() => setStatus(tab.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                status === tab.value
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative sm:ml-auto sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks"
            aria-label="Search tasks"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <ListFilter className="size-4 shrink-0 text-muted-foreground" />
          <button
            type="button"
            onClick={() => setArea("all")}
            aria-pressed={area === "all"}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
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
                "rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                area === a.value
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {areaLabel[a.value]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks match these filters"
          description="Try a different status or area — or add the thing you keep forgetting."
          action={
            <Button variant="outline" size="sm" onClick={() => { setStatus("all"); setArea("all"); setQuery(""); }}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="surface p-4" aria-labelledby="open-tasks">
            <h2 id="open-tasks" className="px-1 pb-1 font-semibold">
              Open
            </h2>
            {grouped.open.length === 0 ? (
              <p className="px-1 py-6 text-sm text-muted-foreground">Nothing open here.</p>
            ) : (
              <ul>
                {grouped.open.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onRemove={removeTask}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="surface p-4" aria-labelledby="done-tasks">
            <h2 id="done-tasks" className="flex items-center gap-2 px-1 pb-1 font-semibold">
              Completed
              <Sparkles className="size-4 text-primary" />
            </h2>
            {grouped.done.length === 0 ? (
              <p className="px-1 py-6 text-sm text-muted-foreground">
                Nothing completed yet today.
              </p>
            ) : (
              <ul>
                {grouped.done.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onRemove={removeTask}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  );
}
