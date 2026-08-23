import type { Metadata } from "next";
import { AnalyticsView } from "@/components/app/views/analytics-view";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Focus hours, plan adherence and life balance over time.",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
