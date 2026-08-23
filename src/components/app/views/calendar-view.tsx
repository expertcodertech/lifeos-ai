"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AREAS, areaClasses, areaLabel } from "@/lib/areas";
import { formatTime, toDateKey } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";
import type { CalendarEvent, LifeArea } from "@/lib/types";
import { cn } from "@/lib/utils";

const DAY_MS = 86400000;

function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = (d.getDay() + 6) % 7; // Monday-first
  return new Date(d.getTime() - diff * DAY_MS);
}

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const rangeFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" });

export function CalendarView() {
  const { events, addEvent, removeEvent } = useAppStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedKey, setSelectedKey] = useState(toDateKey(new Date()));

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const [area, setArea] = useState<LifeArea>("work");

  const weekStart = useMemo(
    () => new Date(startOfWeek(new Date()).getTime() + weekOffset * 7 * DAY_MS),
    [weekOffset],
  );

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart.getTime() + i * DAY_MS);
        return { date, key: toDateKey(date) };
      }),
    [weekStart],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = toDateKey(new Date(event.start));
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.start.localeCompare(b.start));
    return map;
  }, [events]);

  const selectedEvents = byDay.get(selectedKey) ?? [];
  const todayKey = toDateKey(new Date());

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const [y, m, d] = selectedKey.split("-").map(Number);
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startDate = new Date(y, m - 1, d, sh, sm);
    const endDate = new Date(y, m - 1, d, eh, em);
    if (endDate <= startDate) {
      toast.error("End time must be after the start time.");
      return;
    }
    addEvent({
      id: `event-${Math.random().toString(36).slice(2, 9)}`,
      title: trimmed,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      area,
      kind: "meeting",
    });
    setTitle("");
    toast.success("Event added to your calendar");
  }

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Meetings, focus blocks and personal time on one timeline the planner respects."
        actions={
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous week"
              onClick={() => setWeekOffset((w) => w - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next week"
              onClick={() => setWeekOffset((w) => w + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />

      <p className="mb-3 text-sm font-medium text-muted-foreground">
        {rangeFormatter.format(days[0].date)} – {rangeFormatter.format(days[6].date)}
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface p-3 lg:col-span-2" aria-label="Week view">
          <div className="grid grid-cols-7 gap-2">
            {days.map(({ date, key }) => {
              const dayEvents = byDay.get(key) ?? [];
              const isToday = key === todayKey;
              const isSelected = key === selectedKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedKey(key)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex min-h-40 flex-col gap-1.5 rounded-xl border p-2 text-left transition-colors",
                    isSelected
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/60 hover:bg-accent/50",
                  )}
                >
                  <span className="text-[11px] font-medium text-muted-foreground uppercase">
                    {weekdayFormatter.format(date)}
                  </span>
                  <span
                    className={cn(
                      "grid size-7 place-items-center rounded-lg text-sm font-semibold",
                      isToday && "bg-primary text-primary-foreground",
                    )}
                  >
                    {date.getDate()}
                  </span>
                  <div className="mt-1 flex flex-col gap-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className={cn(
                          "truncate rounded-md px-1.5 py-1 text-[10px] font-medium",
                          areaClasses[event.area].chip,
                        )}
                      >
                        {formatTime(event.start)} {event.title}
                      </span>
                    ))}
                    {dayEvents.length > 3 ? (
                      <span className="text-[10px] text-muted-foreground">
                        +{dayEvents.length - 3} more
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <section className="surface p-5" aria-labelledby="day-detail">
            <h2 id="day-detail" className="font-semibold">
              {selectedKey === todayKey ? "Today" : rangeFormatter.format(new Date(selectedKey))}
            </h2>
            {selectedEvents.length === 0 ? (
              <EmptyState
                className="mt-3 py-8"
                icon={CalendarDays}
                title="Nothing scheduled"
                description="A clear day — perfect for a long focus block."
              />
            ) : (
              <ul className="mt-3 space-y-2">
                {selectedEvents.map((event) => (
                  <li
                    key={event.id}
                    className="group flex items-start gap-3 rounded-xl border border-border/60 px-3 py-2.5"
                  >
                    <span
                      className={cn("mt-1.5 size-2 shrink-0 rounded-full", areaClasses[event.area].dot)}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(event.start)} – {formatTime(event.end)}
                        {event.location ? ` · ${event.location}` : ""}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {areaLabel[event.area]}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${event.title}`}
                      className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                      onClick={() => removeEvent(event.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <form onSubmit={handleAdd} className="surface space-y-3 p-5" aria-label="Add event">
            <h2 className="font-semibold">Add event</h2>
            <div className="space-y-1.5">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design review"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="event-start">Start</Label>
                <Input
                  id="event-start"
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="event-end">End</Label>
                <Input
                  id="event-end"
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {AREAS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setArea(a.value)}
                  aria-pressed={area === a.value}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    area === a.value
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <Button type="submit" className="w-full" disabled={!title.trim()}>
              <Plus className="size-4" />
              Add to {selectedKey === todayKey ? "today" : rangeFormatter.format(new Date(selectedKey))}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
