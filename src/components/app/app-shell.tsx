"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Repeat,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "AI Planner", icon: Sparkles },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/habits", label: "Habits", icon: Repeat },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Workspace" className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UpgradeCard() {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-sm font-semibold">Unlimited AI plans</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Replan your day as many times as it changes.
      </p>
      <Button size="sm" className="mt-3 w-full" render={<Link href="/pricing" />}>
        See plans
      </Button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAppStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-muted/40">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col justify-between border-r border-border/70 bg-background px-4 py-5 lg:flex">
        <div className="flex flex-col gap-6">
          <Logo />
          <NavList />
        </div>
        <UpgradeCard />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open navigation" className="lg:hidden" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-5">
              <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Move between LifeOS workspace pages.
              </SheetDescription>
              <div className="flex flex-col gap-6">
                <Logo />
                <NavList onNavigate={() => setOpen(false)} />
                <UpgradeCard />
              </div>
            </SheetContent>
          </Sheet>

          <Logo showWordmark={false} className="lg:hidden" />

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex"
              render={<Link href="/planner" />}
            >
              <Sparkles className="size-4" />
              Build my plan
            </Button>
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-full border border-border/70 py-1 pr-3 pl-1">
              <Avatar className="size-7">
                <AvatarFallback className="text-[11px]">{user.initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
              <Badge variant="secondary" className="hidden text-[10px] md:inline-flex">
                {user.plan}
              </Badge>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
