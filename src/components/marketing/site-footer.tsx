import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/planner", label: "AI Planner" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/analytics", label: "Analytics" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Workspace",
    links: [
      { href: "/tasks", label: "Tasks" },
      { href: "/calendar", label: "Calendar" },
      { href: "/goals", label: "Goals" },
      { href: "/habits", label: "Habits" },
      { href: "/notes", label: "Notes" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/features#security", label: "Security" },
      { href: "/pricing#faq", label: "FAQ" },
      { href: "/signup", label: "Get started" },
      { href: "/login", label: "Log in" },
      { href: "/settings", label: "Settings" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            The personal command center that turns everything you capture into a plan
            you can actually finish.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border/60">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} LifeOS AI. All rights reserved.</p>
          <p>Built for people with more ambition than hours.</p>
        </div>
      </div>
    </footer>
  );
}
