"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="font-medium">This view could not load</p>
        <p className="text-sm text-muted-foreground">
          Your data is safe. Retry the request, or head back to the dashboard.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
