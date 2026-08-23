import type { Metadata } from "next";
import { NotesView } from "@/components/app/views/notes-view";

export const metadata: Metadata = {
  title: "Notes",
  description: "Ideas and meeting notes the AI turns into action items.",
};

export default function NotesPage() {
  return <NotesView />;
}
