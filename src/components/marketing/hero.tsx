"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { stats } from "@/lib/data/marketing";

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden pt-14 pb-10 sm:pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] dark:bg-primary/25" />
        <div className="absolute top-32 right-[12%] h-72 w-72 rounded-full bg-chart-5/20 blur-[100px]" />
      </div>

      <div className="container-page flex flex-col items-center text-center">
        <motion.div {...fade(0)}>
          <Link
            href="/planner"
            className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 py-1.5 pr-3 pl-1.5 text-sm backdrop-blur transition-colors hover:border-primary/40"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3" />
              New
            </span>
            <span className="text-muted-foreground">AI Planner v2 — replan your day in one click</span>
            <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.h1
          {...fade(0.08)}
          className="mt-7 max-w-4xl text-balance text-[2.6rem] leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl"
        >
          Your Life,{" "}
          <span className="bg-gradient-to-br from-primary via-primary to-chart-5 bg-clip-text text-transparent">
            Organized by AI.
          </span>
        </motion.h1>

        <motion.p
          {...fade(0.16)}
          className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          Tasks, notes, calendar, goals, habits and finances in one command center.
          LifeOS reads everything you capture and hands you a realistic plan for the
          day — every morning, in seconds.
        </motion.p>

        <motion.div {...fade(0.24)} className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Button
            size="lg"
            className="h-12 w-full rounded-xl px-6 text-base shadow-lg shadow-primary/20 sm:w-auto"
            render={
              <Link href="/planner">
                Build My Plan
                <ArrowRight data-icon="inline-end" />
              </Link>
            }
          />
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-full rounded-xl px-6 text-base sm:w-auto"
            render={<Link href="/dashboard">Explore the dashboard</Link>}
          />
        </motion.div>

        <motion.div
          {...fade(0.32)}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
              ))}
            </span>
            4.9 from 2,100+ reviews
          </span>
          <span>No credit card required</span>
          <span>Free forever plan</span>
        </motion.div>
      </div>

      <motion.div
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, y: 40 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.8, delay: 0.36, ease: [0.22, 1, 0.36, 1] as const },
            })}
        className="container-page mt-14"
      >
        <DashboardPreview />
      </motion.div>

      <div className="container-page mt-14">
        <dl className="grid grid-cols-2 gap-6 border-y border-border/60 py-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {stat.value}
              </dd>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
