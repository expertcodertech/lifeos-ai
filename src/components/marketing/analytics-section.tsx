"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { monthlyMomentum, weeklyFocus, insights } from "@/lib/data/analytics";
import { cn } from "@/lib/utils";

const axisProps = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  fontSize: "12px",
  color: "var(--popover-foreground)",
  boxShadow: "0 8px 30px -12px rgba(0,0,0,0.25)",
};

export function AnalyticsSection() {
  return (
    <section id="analytics" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Productivity analytics"
          title="Know why your week worked"
          description="Focus hours, plan adherence and life-area balance — measured automatically, explained in plain language."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="surface p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold">Focus hours this week</h3>
                <p className="text-xs text-muted-foreground">27.3 hours · up 18% vs last week</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-3" />
                +18%
              </span>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyFocus} margin={{ left: -22, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" {...axisProps} />
                  <YAxis {...axisProps} width={44} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
                  <Area
                    type="monotone"
                    dataKey="focusHours"
                    name="Focus hours"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#focusFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            <Reveal delay={0.08} className="surface p-5 sm:p-6">
              <h3 className="text-sm font-semibold">Planned vs completed</h3>
              <div className="mt-4 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyMomentum} margin={{ left: -28, right: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="week" {...axisProps} />
                    <YAxis {...axisProps} width={40} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                    <Bar dataKey="planned" name="Planned" fill="var(--muted-foreground)" opacity={0.35} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" name="Completed" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Reveal>

            <Reveal delay={0.16} className="surface flex flex-1 flex-col gap-3 p-5 sm:p-6">
              <h3 className="text-sm font-semibold">What LifeOS noticed</h3>
              <ul className="flex flex-col gap-3">
                {insights.slice(0, 2).map((insight) => (
                  <li key={insight.id} className="flex gap-3">
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        insight.tone === "positive" ? "bg-emerald-500" : "bg-amber-500",
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium leading-snug">{insight.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {insight.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="lg"
                className="mt-auto w-full rounded-xl"
                render={
                  <Link href="/analytics">
                    Open analytics
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                }
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
