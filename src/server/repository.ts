import {
  events as seedEvents,
  goals as seedGoals,
  habits as seedHabits,
  notes as seedNotes,
  tasks as seedTasks,
} from "@/lib/data/seed";
import { createClient } from "@/lib/supabase/server";
import type { CalendarEvent, Goal, Habit, Note, Task } from "@/lib/types";

/**
 * One data-access surface for every resource. Each collection reads from
 * Supabase when it is configured and falls back to seeded demo data otherwise,
 * so route handlers never branch on environment.
 */
interface Collection<T> {
  list(userId?: string): Promise<T[]>;
  create(input: T): Promise<T>;
}

function collection<T extends { id: string }>(
  table: string,
  seed: T[],
): Collection<T> {
  const memory = [...seed];

  return {
    async list() {
      const supabase = await createClient();
      if (!supabase) return memory;

      const { data, error } = await supabase.from(table).select("*");
      if (error) throw new Error(`Failed to load ${table}: ${error.message}`);
      return (data ?? []) as T[];
    },
    async create(input: T) {
      const supabase = await createClient();
      if (!supabase) {
        memory.unshift(input);
        return input;
      }

      const { data, error } = await supabase
        .from(table)
        .insert(input)
        .select()
        .single();
      if (error) throw new Error(`Failed to create ${table} row: ${error.message}`);
      return data as T;
    },
  };
}

export const repository = {
  tasks: collection<Task>("tasks", seedTasks),
  events: collection<CalendarEvent>("events", seedEvents),
  goals: collection<Goal>("goals", seedGoals),
  habits: collection<Habit>("habits", seedHabits),
  notes: collection<Note>("notes", seedNotes),
};
