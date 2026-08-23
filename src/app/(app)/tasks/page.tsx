import type { Metadata } from "next";
import { TasksView } from "@/components/app/views/tasks-view";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Capture, prioritise and complete the work that matters.",
};

export default function TasksPage() {
  return <TasksView />;
}
