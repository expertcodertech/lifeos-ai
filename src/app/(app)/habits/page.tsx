import type { Metadata } from "next";
import { HabitsView } from "@/components/app/views/habits-view";

export const metadata: Metadata = {
  title: "Habits",
  description: "Streaks, consistency and the small repeated wins.",
};

export default function HabitsPage() {
  return <HabitsView />;
}
