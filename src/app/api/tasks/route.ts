import { z } from "zod";
import { repository } from "@/server/repository";
import { fail, ok, parseBody } from "@/server/http";
import { tasksSchema } from "@/server/schemas";

export async function GET() {
  try {
    const data = await repository.tasks.list();
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unexpected error",
      "tasks_read_failed",
      500,
    );
  }
}

export async function POST(request: Request) {
  const parsed = await parseBody(request, tasksSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const created = await repository.tasks.create({
      id: `task-${crypto.randomUUID().slice(0, 8)}`,
      ...parsed.data,
    } as z.infer<typeof tasksSchema> & { id: string });
    return ok(created, { status: 201 });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unexpected error",
      "tasks_write_failed",
      500,
    );
  }
}
