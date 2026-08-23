import type { Metadata } from "next";
import { GoalsView } from "@/components/app/views/goals-view";

export const metadata: Metadata = {
  title: "Goals",
  description: "Long-range outcomes broken into schedulable milestones.",
};

export default function GoalsPage() {
  return <GoalsView />;
}
