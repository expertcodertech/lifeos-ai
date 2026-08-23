import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <Logo />
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">This page took the day off</h1>
        <p className="max-w-sm text-muted-foreground">
          The page you are looking for is not part of LifeOS — yet.
        </p>
        <div className="flex gap-3">
          <Button render={<Link href="/" />}>Back home</Button>
          <Button variant="outline" render={<Link href="/dashboard" />}>
            Open dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
