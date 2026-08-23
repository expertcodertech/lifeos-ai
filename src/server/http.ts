import { NextResponse } from "next/server";
import type { ZodError, ZodType } from "zod";

export interface ApiError {
  error: { message: string; code: string; details?: unknown };
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function fail(
  message: string,
  code = "bad_request",
  status = 400,
  details?: unknown,
) {
  return NextResponse.json<ApiError>(
    { error: { message, code, details } },
    { status },
  );
}

export async function parseBody<T>(request: Request, schema: ZodType<T>) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false as const, response: fail("Request body must be JSON", "invalid_json") };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      ok: false as const,
      response: fail(
        "Request body failed validation",
        "validation_error",
        422,
        (result.error as ZodError).flatten(),
      ),
    };
  }

  return { ok: true as const, data: result.data };
}
