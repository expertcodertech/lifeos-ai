"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CalendarClock, Loader2, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatDuration, minutesToLabel, timeToMinutes } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";
import type { PlanBlock } from "@/lib/types";
import { cn } from "@/lib/utils";

const blockTone: Record<PlanBlock["type"], string> = {
  focus: "bg-primary",
  meeting: "bg-sky-500",
  habit: "bg-emerald-500",
  break: "bg-amber-500",
  admin: "bg-fuchsia-500",
};

type Preference = "morning" | "afternoon" | "balanced";

interface PlanResponse {
  blocks: PlanBlock[];
  summary: {
    focusMinutes: number;
    meetingMinutes: number;
    scheduledTasks: number;
    blockCount: number;
  };
  generatedAt: string;
}

export function PlannerView() {
  const { tasks, events, addTask } = useAppStore();

  const [intent, setIntent] = useState(
    "Ship the investor update, protect a gym slot and call mom before the day disappears.",
  );
  const [dayStart, setDayStart] = useState("08:00");
  const [dayEnd, setDayEnd] = useState("19:00");
  const [focusPreference, setFocusPreference] = useState<Preference>("morning");
  const [protectBreaks, setProtectBreaks] = useState(true);

  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          events,
          dayStart,
          dayEnd,
          focusPreference,
          protectBreaks,
          intent,
        }),
      });
      const body = (await res.json()) as
        | { data: PlanResponse }
        | { error: { message: string } };
      if (!res.ok || !("data" in body)) {
        throw new Error(
          "error" in body ? body.error.message : "The planner could not build your day.",
        );
      }
      setPlan(body.data);
      toast.success("Plan ready", {
        description: `${body.data.summary.blockCount} blocks scheduled.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function captureIntent() {
    const lines = intent
      .split(/\n|,(?![^(]*\))/)
      .map((line) => line.trim())
      .filter((line) => line.length > 3);
    if (lines.length === 0) {
      toast.error("Write what's on your mind first.");
      return;
    }
    lines.forEach((line) => addTask({ title: line, aiSuggested: true }));
    toast.success(`${lines.length} tasks captured`, {
      description: "Added to your task list, ready to schedule.",
    });
  }

  return (
    <>
      <PageHeader
        title="AI Planner"
        description="Tell LifeOS what today needs to look like. It reads your tasks and calendar, then hands back a plan you can actually finish."
        actions={
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Planning…" : "Generate plan"}
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="surface space-y-5 p-5 lg:col-span-2" aria-labelledby="planner-inputs">
          <h2 id="planner-inputs" className="font-semibold">
            What matters today
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="intent">Brain dump</Label>
            <Textarea
              id="intent"
              rows={5}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="What's on your mind today?"
            />
            <Button variant="outline" size="sm" onClick={captureIntent} className="mt-1">
              <Wand2 className="size-4" />
              Capture as tasks
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="day-start">Day starts</Label>
              <Input
                id="day-start"
                type="time"
                value={dayStart}
                onChange={(e) => setDayStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="day-end">Day ends</Label>
              <Input
                id="day-end"
                type="time"
                value={dayEnd}
                onChange={(e) => setDayEnd(e.target.value)}
              />
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Deep work preference</legend>
            <div className="flex rounded-lg border border-border p-0.5">
              {(["morning", "balanced", "afternoon"] as Preference[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFocusPreference(p)}
                  aria-pressed={focusPreference === p}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                    focusPreference === p
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 px-3 py-2.5">
            <div>
              <Label htmlFor="protect-breaks" className="text-sm">
                Protect lunch and breaks
              </Label>
              <p className="text-xs text-muted-foreground">
                Keeps a midday gap free instead of stacking focus blocks.
              </p>
            </div>
            <Switch
              id="protect-breaks"
              checked={protectBreaks}
              onCheckedChange={(checked: boolean) => setProtectBreaks(checked)}
            />
          </div>

          <div className="rounded-xl bg-accent/50 p-3 text-xs text-muted-foreground">
            Planning from {tasks.filter((t) => t.status !== "done").length} open tasks and{" "}
            {events.length} calendar events.
          </div>
        </section>

        <section className="surface p-5 lg:col-span-3" aria-labelledby="planner-output">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="planner-output" className="font-semibold">
              Your day
            </h2>
            {plan ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">
                  {formatDuration(plan.summary.focusMinutes)} focus
                </Badge>
                <Badge variant="secondary">
                  {formatDuration(plan.summary.meetingMinutes)} meetings
                </Badge>
                <Button variant="ghost" size="sm" onClick={generate} disabled={loading}>
                  <RotateCcw className="size-4" />
                  Replan
                </Button>
              </div>
            ) : null}
          </div>

          <div aria-live="polite" className="mt-4">
            {error ? (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <AlertTriangle className="mt-0.5 size-4 text-destructive" />
                <div>
                  <p className="text-sm font-medium">Planning failed</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={generate}>
                    Try again
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <ul className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li
                    key={i}
                    className="h-16 animate-pulse rounded-xl border border-border/60 bg-muted/60"
                  />
                ))}
              </ul>
            ) : !plan ? (
              <EmptyState
                icon={CalendarClock}
                title="No plan generated yet"
                description="Set your window and hit Generate plan — LifeOS schedules the highest-leverage work into your open time."
                action={
                  <Button size="sm" onClick={generate}>
                    <Sparkles className="size-4" />
                    Generate plan
                  </Button>
                }
              />
            ) : (
              <ol className="space-y-2">
                <AnimatePresence initial={false}>
                  {plan.blocks.map((block, index) => (
                    <motion.li
                      key={block.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.35 }}
                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-background px-3 py-3"
                    >
                      <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                        {minutesToLabel(timeToMinutes(block.start))} –{" "}
                        {minutesToLabel(timeToMinutes(block.end))}
                      </span>
                      <span
                        className={cn("mt-1 h-9 w-1 shrink-0 rounded-full", blockTone[block.type])}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{block.title}</p>
                        <p className="text-xs text-muted-foreground">{block.rationale}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-[10px] capitalize">
                        {block.type}
                      </Badge>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
