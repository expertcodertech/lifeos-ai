"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Brain, Check, Loader2, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import { areaClasses } from "@/lib/areas";
import type { LifeArea } from "@/lib/types";

const SAMPLE = `investor update due today, still need the retention chart
review onboarding drop-off before I write it
gym — lower body, missed it yesterday
call mom (3rd day I'm saying this)
book offsite flights before prices jump`;

const stages = [
  { id: "capture", label: "Capturing", detail: "5 items parsed from raw text" },
  { id: "understand", label: "Understanding", detail: "Deadlines, effort and goals linked" },
  { id: "plan", label: "Planning", detail: "Fitted around 3 fixed meetings" },
] as const;

interface DemoBlock {
  time: string;
  title: string;
  meta: string;
  area: LifeArea;
  highlight?: boolean;
}

const result: DemoBlock[] = [
  { time: "9:30", title: "Retention chart + investor update draft", meta: "90m deep work · due today", area: "work", highlight: true },
  { time: "11:15", title: "Product standup", meta: "30m · calendar", area: "work" },
  { time: "12:00", title: "Onboarding drop-off review", meta: "45m · unblocks the update", area: "work" },
  { time: "13:00", title: "Lunch + walk", meta: "45m · protected break", area: "health" },
  { time: "15:00", title: "Design review", meta: "60m · calendar", area: "work" },
  { time: "16:15", title: "Call Mom", meta: "20m · rolled over 3 days", area: "relationships", highlight: true },
  { time: "16:45", title: "Book offsite flights", meta: "25m · price-sensitive", area: "personal" },
  { time: "18:30", title: "Strength session — lower body", meta: "60m · keeps 10K goal on pace", area: "health" },
];

export function AiPlanningDemo() {
  const [input, setInput] = useState(SAMPLE);
  const [stage, setStage] = useState(-1);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDone(false);
    setStage(0);
    timers.current.push(setTimeout(() => setStage(1), 700));
    timers.current.push(setTimeout(() => setStage(2), 1500));
    timers.current.push(
      setTimeout(() => {
        setStage(3);
        setDone(true);
      }, 2300),
    );
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setStage(-1);
    setDone(false);
    setInput(SAMPLE);
  }

  const running = stage >= 0 && !done;

  return (
    <section id="ai-demo" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="AI daily planning"
          title="Dump the chaos. Get a day that works."
          description="Paste whatever is in your head. LifeOS extracts the work, understands what actually matters today, and lays it against your real calendar."
        />

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="surface flex flex-col gap-4 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Your brain dump</h3>
              <Badge variant="secondary" className="gap-1">
                <Brain className="size-3" />
                Natural language
              </Badge>
            </div>

            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={7}
              aria-label="Brain dump for the AI planner"
              className="resize-none font-mono text-[13px] leading-relaxed"
              placeholder="What's on your mind today?"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="lg"
                onClick={run}
                disabled={running || input.trim().length === 0}
                className="h-10 rounded-xl px-4"
              >
                {running ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Wand2 data-icon="inline-start" />
                )}
                {running ? "Planning…" : "Generate my day"}
              </Button>
              {done ? (
                <Button variant="ghost" size="lg" className="h-10" onClick={reset}>
                  <RotateCcw data-icon="inline-start" />
                  Reset
                </Button>
              ) : null}
              {input.trim().length === 0 ? (
                <p className="text-sm text-muted-foreground">Add at least one line to plan.</p>
              ) : null}
            </div>

            <ol className="mt-1 space-y-2.5" aria-live="polite">
              {stages.map((s, i) => {
                const state = stage > i ? "done" : stage === i ? "active" : "idle";
                return (
                  <li key={s.id} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border text-[10px] transition-colors",
                        state === "done" && "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                        state === "active" && "border-primary/40 bg-primary/15 text-primary",
                        state === "idle" && "border-border text-muted-foreground",
                      )}
                    >
                      {state === "done" ? (
                        <Check className="size-3" />
                      ) : state === "active" ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-medium", state === "idle" && "text-muted-foreground")}>
                        {s.label}
                      </p>
                      {state !== "idle" ? (
                        <p className="text-xs text-muted-foreground">{s.detail}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="surface min-h-[26rem] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Generated plan</h3>
              {done ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3" />
                  5h 20m of focus protected
                </span>
              ) : null}
            </div>

            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key="placeholder"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  className="mt-6 space-y-2.5"
                >
                  {running ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-14 animate-pulse rounded-xl bg-muted"
                        style={{ animationDelay: `${i * 80}ms` }}
                      />
                    ))
                  ) : (
                    <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-center">
                      <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="size-5" />
                      </span>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Your plan appears here. Hit <strong className="text-foreground">Generate my day</strong> to
                        watch LifeOS build it.
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.ol
                  key="plan"
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
                  className="mt-5 space-y-2"
                >
                  {result.map((block) => (
                    <motion.li
                      key={block.title}
                      variants={{
                        hidden: reduce ? { opacity: 1 } : { opacity: 0, x: -8 },
                        show: { opacity: 1, x: 0 },
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                        block.highlight
                          ? "border-primary/30 bg-primary/[0.06]"
                          : "border-border/60 bg-background/50",
                      )}
                    >
                      <span className="w-11 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                        {block.time}
                      </span>
                      <span className={cn("h-9 w-1 rounded-full", areaClasses[block.area].bar)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{block.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{block.meta}</p>
                      </div>
                      {block.highlight ? (
                        <Sparkles className="size-3.5 shrink-0 text-primary" aria-label="AI prioritized" />
                      ) : null}
                    </motion.li>
                  ))}
                </motion.ol>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
