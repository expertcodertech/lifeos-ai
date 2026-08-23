import { z } from "zod";
import { repository } from "@/server/repository";
import { fail, ok, parseBody } from "@/server/http";
import { notesSchema } from "@/server/schemas";

export async function GET() {
  try {
    const data = await repository.notes.list();
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unexpected error",
      "notes_read_failed",
      500,
    );
  }
}

export async function POST(request: Request) {
  const parsed = await parseBody(request, notesSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const created = await repository.notes.create({
      id: `note-${crypto.randomUUID().slice(0, 8)}`,
      ...parsed.data,
    } as z.infer<typeof notesSchema> & { id: string });
    return ok(created, { status: 201 });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unexpected error",
      "notes_write_failed",
      500,
    );
  }
}
