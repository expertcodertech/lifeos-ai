import type { Metadata } from "next";
import { SettingsView } from "@/components/app/views/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Profile, planning window, appearance and AI notifications.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
