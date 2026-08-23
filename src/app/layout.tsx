import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AppStoreProvider } from "@/lib/store/app-store";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lifeos.ai"),
  title: {
    default: "LifeOS AI — Your Life, Organized by AI",
    template: "%s · LifeOS AI",
  },
  description:
    "LifeOS AI is the personal command center that turns your tasks, notes, calendar, goals, habits and finances into an organized daily plan.",
  keywords: [
    "AI planner",
    "personal productivity",
    "daily planning",
    "task manager",
    "habit tracker",
    "life dashboard",
  ],
  openGraph: {
    title: "LifeOS AI — Your Life, Organized by AI",
    description:
      "One intelligent dashboard for tasks, notes, calendar, goals, habits and finances.",
    type: "website",
    url: "https://lifeos.ai",
    siteName: "LifeOS AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeOS AI — Your Life, Organized by AI",
    description:
      "One intelligent dashboard for tasks, notes, calendar, goals, habits and finances.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#131217" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <AppStoreProvider>{children}</AppStoreProvider>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
