import { z } from "zod";
import { repository } from "@/server/repository";
import { fail, ok, parseBody } from "@/server/http";
import { eventsSchema } from "@/server/schemas";

export async function GET() {
  try {
    const data = await repository.events.list();
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unexpected error",
      "events_read_failed",
      500,
    );
  }
}

export async function POST(request: Request) {
  const parsed = await parseBody(request, eventsSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const created = await repository.events.create({
      id: `event-${crypto.randomUUID().slice(0, 8)}`,
      ...parsed.data,
    } as z.infer<typeof eventsSchema> & { id: string });
    return ok(created, { status: 201 });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unexpected error",
      "events_write_failed",
      500,
    );
  }
}
