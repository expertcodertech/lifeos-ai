import { z } from "zod";
import { repository } from "@/server/repository";
import { fail, ok, parseBody } from "@/server/http";
import { habitsSchema } from "@/server/schemas";

export async function GET() {
  try {
    const data = await repository.habits.list();
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unexpected error",
      "habits_read_failed",
      500,
    );
  }
}

export async function POST(request: Request) {
  const parsed = await parseBody(request, habitsSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const created = await repository.habits.create({
      id: `habit-${crypto.randomUUID().slice(0, 8)}`,
      ...parsed.data,
    } as z.infer<typeof habitsSchema> & { id: string });
    return ok(created, { status: 201 });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unexpected error",
      "habits_write_failed",
      500,
    );
  }
}
