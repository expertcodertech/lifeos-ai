"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import {
  areaBalance,
  energyByHour,
  insights,
  monthlyMomentum,
  weeklyFocus,
} from "@/lib/data/analytics";
import { formatCurrency } from "@/lib/format";
import { transactions } from "@/lib/data/seed";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
};

export function AnalyticsView() {
  const { tasks, habits } = useAppStore();

  const completion = useMemo(() => {
    const done = tasks.filter((t) => t.status === "done").length;
    return tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
  }, [tasks]);

  const focusTotal = weeklyFocus.reduce((sum, d) => sum + d.focusHours, 0);
  const adherence = Math.round(
    weeklyFocus.reduce((sum, d) => sum + d.planAdherence, 0) / weeklyFocus.length,
  );
  const habitRate =
    habits.length === 0
      ? 0
      : Math.round((habits.filter((h) => h.completedToday).length / habits.length) * 100);

  const spendByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of transactions) {
      map.set(tx.category, (map.get(tx.category) ?? 0) + Math.abs(tx.amount));
    }
    return [...map.entries()].map(([category, amount]) => ({ category, amount }));
  }, []);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Where your hours actually go — and what the AI learns from it."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Focus this week"
          value={`${focusTotal.toFixed(1)}h`}
          icon={Clock}
          trend={{ value: "+2.1h" }}
          hint="vs last week"
        />
        <StatCard
          label="Plan adherence"
          value={`${adherence}%`}
          icon={TrendingUp}
          trend={{ value: "+6%" }}
        />
        <StatCard label="Task completion" value={`${completion}%`} icon={CheckCircle2} />
        <StatCard
          label="Habit rate today"
          value={`${habitRate}%`}
          icon={Activity}
          hint={`${habits.length} tracked habits`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="surface p-5 lg:col-span-2" aria-labelledby="focus-chart">
          <h2 id="focus-chart" className="font-semibold">
            Focus hours and adherence
          </h2>
          <p className="text-xs text-muted-foreground">Last 7 days</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyFocus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--accent)" }} />
                <Bar dataKey="focusHours" name="Focus hours" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="tasksDone" name="Tasks done" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface p-5" aria-labelledby="balance-chart">
          <h2 id="balance-chart" className="font-semibold">
            Life balance
          </h2>
          <p className="text-xs text-muted-foreground">Share of scheduled time</p>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={areaBalance}
                  dataKey="value"
                  nameKey="area"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {areaBalance.map((entry) => (
                    <Cell key={entry.area} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {areaBalance.map((entry) => (
              <li key={entry.area} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: entry.color }}
                  aria-hidden="true"
                />
                <span className="flex-1">{entry.area}</span>
                <span className="text-muted-foreground tabular-nums">{entry.value}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="surface p-5" aria-labelledby="momentum-chart">
          <h2 id="momentum-chart" className="font-semibold">
            Planned vs completed
          </h2>
          <p className="text-xs text-muted-foreground">Last 6 weeks</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyMomentum}>
                <defs>
                  <linearGradient id="planned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="planned"
                  stroke="var(--chart-1)"
                  fill="url(#planned)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="var(--chart-2)"
                  fill="url(#completed)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface p-5" aria-labelledby="energy-chart">
          <h2 id="energy-chart" className="font-semibold">
            Energy curve
          </h2>
          <p className="text-xs text-muted-foreground">
            The planner schedules deep work where this peaks
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyByHour}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="var(--chart-5)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="surface p-5 lg:col-span-2" aria-labelledby="insight-list">
          <h2 id="insight-list" className="font-semibold">
            What the AI noticed
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {insights.map((insight) => (
              <li
                key={insight.id}
                className={cn(
                  "rounded-xl border p-3",
                  insight.tone === "warning"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-border/60 bg-accent/40",
                )}
              >
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {insight.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-5" aria-labelledby="spend-list">
          <h2 id="spend-list" className="font-semibold">
            Spending by category
          </h2>
          <p className="text-xs text-muted-foreground">This month</p>
          <ul className="mt-3 space-y-2.5">
            {spendByCategory.map((row) => (
              <li key={row.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{row.category}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatCurrency(row.amount)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(
                        100,
                        (row.amount /
                          Math.max(...spendByCategory.map((r) => r.amount), 1)) *
                          100,
                      )}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
