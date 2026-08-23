"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useTheme } from "next-themes";
import { Check, Database, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

const THEMES = ["light", "dark", "system"] as const;

export function SettingsView() {
  const { user, updateUser, reset } = useAppStore();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [start, setStart] = useState(user.workingHours.start);
  const [end, setEnd] = useState(user.workingHours.end);
  const [timezone, setTimezone] = useState(user.timezone);
  const [morningBrief, setMorningBrief] = useState(true);
  const [replanAlerts, setReplanAlerts] = useState(true);
  const [weeklyReview, setWeeklyReview] = useState(false);

  function handleSave(event: FormEvent) {
    event.preventDefault();
    updateUser({
      name,
      email,
      timezone,
      workingHours: { start, end },
      initials: name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    });
    toast.success("Settings saved");
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Profile, planning window and how much the AI is allowed to nudge you."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <form onSubmit={handleSave} className="surface space-y-5 p-5 lg:col-span-2">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-base">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {user.plan} plan
            </Badge>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="start">Working hours start</Label>
              <Input
                id="start"
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">Working hours end</Label>
              <Input id="end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit">
            <Check className="size-4" />
            Save changes
          </Button>
        </form>

        <div className="flex flex-col gap-4">
          <section className="surface space-y-4 p-5" aria-labelledby="appearance">
            <h2 id="appearance" className="font-semibold">
              Appearance
            </h2>
            <div className="flex rounded-lg border border-border p-0.5">
              {THEMES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTheme(option)}
                  aria-pressed={theme === option}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                    theme === option
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="surface space-y-4 p-5" aria-labelledby="notifications">
            <h2 id="notifications" className="font-semibold">
              AI notifications
            </h2>
            {[
              {
                id: "morning-brief",
                label: "Morning brief",
                description: "Your plan lands at 7:30am.",
                value: morningBrief,
                set: setMorningBrief,
              },
              {
                id: "replan-alerts",
                label: "Replan alerts",
                description: "Nudge me when the day slips.",
                value: replanAlerts,
                set: setReplanAlerts,
              },
              {
                id: "weekly-review",
                label: "Weekly review",
                description: "Sunday summary of what moved.",
                value: weeklyReview,
                set: setWeeklyReview,
              },
            ].map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4">
                <div>
                  <Label htmlFor={item.id} className="text-sm">
                    {item.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  id={item.id}
                  checked={item.value}
                  onCheckedChange={(checked: boolean) => item.set(checked)}
                />
              </div>
            ))}
          </section>

          <section className="surface space-y-3 p-5" aria-labelledby="data">
            <h2 id="data" className="flex items-center gap-2 font-semibold">
              <Database className="size-4" />
              Workspace data
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              This demo stores your workspace in the browser. Connect Supabase to sync it across
              devices with row-level security.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  reset();
                  toast.success("Workspace reset to sample data");
                }}
              >
                <RotateCcw className="size-4" />
                Reset demo data
              </Button>
              <Button variant="ghost" size="sm" render={<Link href="/pricing" />}>
                <ShieldCheck className="size-4" />
                Compare plans
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
