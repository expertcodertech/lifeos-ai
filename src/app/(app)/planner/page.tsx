import type { Metadata } from "next";
import { PlannerView } from "@/components/app/views/planner-view";

export const metadata: Metadata = {
  title: "AI Planner",
  description: "Turn your tasks and calendar into a realistic, time-blocked day.",
};

export default function PlannerPage() {
  return <PlannerView />;
}
