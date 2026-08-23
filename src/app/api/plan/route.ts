import { generatePlan, planSummary } from "@/lib/ai/planner";
import { repository } from "@/server/repository";
import { fail, ok, parseBody } from "@/server/http";
import { planRequestSchema } from "@/server/schemas";
import type { CalendarEvent, Task } from "@/lib/types";

/**
 * Generates a time-blocked day. The client can pass its current workspace so
 * the plan reflects unsaved edits; otherwise the stored workspace is used.
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, planRequestSchema);
  if (!parsed.ok) return parsed.response;

  const { tasks, events, ...options } = parsed.data;

  try {
    const resolvedTasks = (tasks as Task[] | undefined) ?? (await repository.tasks.list());
    const resolvedEvents =
      (events as CalendarEvent[] | undefined) ?? (await repository.events.list());

    const blocks = generatePlan({
      tasks: resolvedTasks,
      events: resolvedEvents,
      ...options,
    });

    return ok({
      blocks,
      summary: planSummary(blocks),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Planner failed",
      "plan_failed",
      500,
    );
  }
}
