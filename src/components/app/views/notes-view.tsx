"use client";

import { useMemo, useState } from "react";
import { NotebookPen, Pin, PinOff, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDay } from "@/lib/format";
import { useAppStore } from "@/lib/store/app-store";
import type { Note } from "@/lib/types";
import { cn } from "@/lib/utils";

function newNote(): Note {
  return {
    id: `note-${Math.random().toString(36).slice(2, 9)}`,
    title: "Untitled note",
    content: "",
    tags: [],
    updatedAt: new Date().toISOString(),
    pinned: false,
  };
}

/** Pulls action-like lines out of a note so they can become tasks. */
function extractActions(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.replace(/^[-*\u2022\s\[\]x]+/i, "").trim())
    .filter((line) => line.length > 4 && /^(ship|write|send|book|call|review|draft|fix|plan|build|follow up|schedule)/i.test(line));
}

export function NotesView() {
  const { notes, saveNote, removeNote, togglePin, addTask } = useAppStore();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(notes[0]?.id ?? null);

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...notes]
      .filter((n) =>
        q ? `${n.title} ${n.content} ${n.tags.join(" ")}`.toLowerCase().includes(q) : true,
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [notes, query]);

  const active = notes.find((n) => n.id === activeId) ?? sorted[0] ?? null;

  function patchActive(patch: Partial<Note>) {
    if (!active) return;
    saveNote({ ...active, ...patch, updatedAt: new Date().toISOString() });
  }

  function createNote() {
    const note = newNote();
    saveNote(note);
    setActiveId(note.id);
  }

  function toTasks() {
    if (!active) return;
    const actions = extractActions(active.content);
    if (actions.length === 0) {
      toast.error("No action items found", {
        description: "Start a line with a verb like “Ship” or “Call”.",
      });
      return;
    }
    actions.forEach((title) => addTask({ title, aiSuggested: true }));
    toast.success(`${actions.length} tasks extracted`, {
      description: "Added to your task list.",
    });
  }

  return (
    <>
      <PageHeader
        title="Notes"
        description="Meeting notes, ideas and journals — the raw material the AI turns into tasks."
        actions={
          <Button onClick={createNote}>
            <Plus className="size-4" />
            New note
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <section className="surface flex flex-col gap-3 p-4" aria-label="All notes">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes"
              aria-label="Search notes"
              className="pl-9"
            />
          </div>

          {sorted.length === 0 ? (
            <EmptyState
              className="py-10"
              icon={NotebookPen}
              title="No notes found"
              description="Nothing matches that search yet."
            />
          ) : (
            <ul className="space-y-1.5">
              {sorted.map((note) => (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(note.id)}
                    aria-current={active?.id === note.id ? "true" : undefined}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                      active?.id === note.id
                        ? "border-primary/50 bg-primary/5"
                        : "border-transparent hover:bg-accent/60",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {note.pinned ? <Pin className="size-3.5 shrink-0 text-primary" /> : null}
                      <span className="truncate text-sm font-medium">{note.title}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                      {note.content || "Empty note"}
                    </span>
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {formatDay(note.updatedAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {active ? (
          <section className="surface flex flex-col gap-4 p-5" aria-label="Note editor">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Label htmlFor="note-title" className="sr-only">
                  Note title
                </Label>
                <Input
                  id="note-title"
                  value={active.title}
                  onChange={(e) => patchActive({ title: e.target.value })}
                  className="border-0 bg-transparent px-0 text-lg font-semibold shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={active.pinned ? "Unpin note" : "Pin note"}
                  onClick={() => togglePin(active.id)}
                >
                  {active.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete note"
                  onClick={() => {
                    removeNote(active.id);
                    setActiveId(null);
                    toast.success("Note deleted");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {active.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[11px]">
                  #{tag}
                </Badge>
              ))}
            </div>

            <Label htmlFor="note-content" className="sr-only">
              Note content
            </Label>
            <Textarea
              id="note-content"
              value={active.content}
              onChange={(e) => patchActive({ content: e.target.value })}
              rows={14}
              placeholder="Start typing — LifeOS reads notes for action items."
              className="resize-none"
            />

            {active.aiSummary ? (
              <div className="rounded-xl bg-accent/50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-medium">
                  <Sparkles className="size-3.5 text-primary" />
                  AI summary
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{active.aiSummary}</p>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Saved automatically · {formatDay(active.updatedAt)}
              </p>
              <Button variant="outline" size="sm" onClick={toTasks}>
                <Sparkles className="size-4" />
                Extract tasks
              </Button>
            </div>
          </section>
        ) : (
          <EmptyState
            icon={NotebookPen}
            title="No note selected"
            description="Pick a note from the list, or start a new one."
            action={
              <Button size="sm" onClick={createNote}>
                New note
              </Button>
            }
          />
        )}
      </div>
    </>
  );
}
