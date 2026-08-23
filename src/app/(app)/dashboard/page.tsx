import type { Metadata } from "next";
import { DashboardView } from "@/components/app/views/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Today's plan, priority tasks, habits and goal progress in one view.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
