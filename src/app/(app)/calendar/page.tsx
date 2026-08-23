import type { Metadata } from "next";
import { CalendarView } from "@/components/app/views/calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Meetings, focus blocks and personal time on one timeline.",
};

export default function CalendarPage() {
  return <CalendarView />;
}
