import {
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  FileText,
  Flame,
  Sparkles,
  Target,
  Wallet,
  Workflow,
  Zap,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: boolean;
}

export const features: Feature[] = [
  {
    icon: Brain,
    title: "AI daily planner",
    description:
      "Every morning LifeOS reads your tasks, calendar, goals and energy patterns, then builds a realistic plan you can actually finish.",
    accent: true,
  },
  {
    icon: CheckCircle2,
    title: "Tasks that understand context",
    description:
      "Priority, effort and the right time of day are inferred automatically. Type a sentence, get a scheduled task.",
  },
  {
    icon: CalendarDays,
    title: "Calendar-aware scheduling",
    description:
      "Meetings, focus blocks and personal time live in one timeline. Conflicts resolve themselves before they cost you a morning.",
  },
  {
    icon: Target,
    title: "Goals that decompose themselves",
    description:
      "Set an outcome, and LifeOS breaks it into milestones and weekly commitments that show up in your plan.",
  },
  {
    icon: Flame,
    title: "Habits with real streak logic",
    description:
      "Cadence-aware streaks, gentle recovery after misses, and habit blocks placed where you actually complete them.",
  },
  {
    icon: FileText,
    title: "Notes that turn into action",
    description:
      "Drop meeting notes in and LifeOS extracts tasks, dates and owners — with a one-line summary you can scan later.",
  },
  {
    icon: Wallet,
    title: "Finance signals",
    description:
      "Track spend against your runway goal and get nudges when a category quietly drifts.",
  },
  {
    icon: BarChart3,
    title: "Productivity analytics",
    description:
      "Focus hours, plan adherence and life-area balance — the numbers that explain why a week worked or didn't.",
  },
  {
    icon: ShieldCheck,
    title: "Private by architecture",
    description:
      "Row-level security on every table, SOC 2 aligned infrastructure, and your data is never used to train models.",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Capture",
    icon: Zap,
    description:
      "Tasks, notes, meetings, goals and habits land in one inbox — typed, dictated or synced from the tools you already use.",
  },
  {
    step: "02",
    title: "Understand",
    icon: Brain,
    description:
      "LifeOS reads intent, deadlines and effort, links each item to a goal, and learns when you actually do your best work.",
  },
  {
    step: "03",
    title: "Plan",
    icon: Workflow,
    description:
      "A time-blocked day is generated around your real calendar, protecting deep work and leaving room for life.",
  },
  {
    step: "04",
    title: "Execute",
    icon: Sparkles,
    description:
      "Work the plan, check things off, and let LifeOS reflow the rest of the day the moment reality changes.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "I stopped starting my day with a blank page. LifeOS hands me a plan that already accounts for my meetings — I just execute.",
    name: "Priya Raghavan",
    role: "Head of Product, Northwind",
    initials: "PR",
  },
  {
    quote:
      "The goal decomposition is the part nobody else gets right. My quarterly targets actually show up in Tuesday afternoon.",
    name: "Marcus Bell",
    role: "Founder, Ledgerly",
    initials: "MB",
  },
  {
    quote:
      "Notes to tasks in one step killed my entire triage ritual. I've got 40 minutes back every single morning.",
    name: "Sofia Almeida",
    role: "Engineering Manager, Kite",
    initials: "SA",
  },
  {
    quote:
      "Plan adherence went from 58% to 91% in six weeks. Nothing else I tried moved that number.",
    name: "Daniel Okafor",
    role: "Independent consultant",
    initials: "DO",
  },
  {
    quote:
      "It's the first tool that treats health and finances as first-class citizens next to work. My weeks feel balanced now.",
    name: "Hannah Weiss",
    role: "Design Lead, Superset",
    initials: "HW",
  },
  {
    quote:
      "We rolled LifeOS out to the whole leadership team. Shared goals plus private plans was exactly the right split.",
    name: "Arjun Mehta",
    role: "COO, Fieldstack",
    initials: "AM",
  },
];

export interface PricingPlan {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    tagline: "For getting your life into one place.",
    monthly: 0,
    yearly: 0,
    features: [
      "Unlimited tasks and notes",
      "1 connected calendar",
      "3 active goals and habits",
      "AI plan 3× per week",
      "7-day analytics history",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    tagline: "For people who plan every single day.",
    monthly: 12,
    yearly: 108,
    features: [
      "Everything in Free",
      "Unlimited AI daily planning + replan",
      "Unlimited goals, habits and calendars",
      "Notes → tasks extraction",
      "Finance tracking and runway goals",
      "Full analytics history and insights",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    name: "Team",
    tagline: "For small teams sharing outcomes.",
    monthly: 24,
    yearly: 228,
    features: [
      "Everything in Pro",
      "Shared goals and team dashboards",
      "Workload balancing across the team",
      "Admin controls and SSO",
      "Audit logs and data residency",
      "Dedicated success manager",
    ],
    cta: "Talk to sales",
  },
];

export const faqs = [
  {
    q: "How does the AI actually build my day?",
    a: "LifeOS combines four signals: hard commitments from your calendar, task deadlines and effort estimates, the goals you said matter this quarter, and your historical completion patterns by time of day. It then solves for a schedule that fits inside your working hours, protects one deep-work block, and leaves buffer for the overruns that always happen.",
  },
  {
    q: "Do I have to change how I already work?",
    a: "No. Connect Google or Outlook Calendar, keep capturing tasks the way you like, and LifeOS organizes around you. Most people start by using only the daily plan and add goals and habits in week two.",
  },
  {
    q: "What happens when my day falls apart?",
    a: "Hit Replan. LifeOS reflows everything that's left around your remaining time, pushing lower-leverage work and protecting whatever is due today. Rescheduling is a two-second action, not a chore.",
  },
  {
    q: "Is my data private?",
    a: "Your data lives in your own Postgres row set with row-level security enforced per user, encrypted in transit and at rest. We never train models on your content, and you can export or delete everything at any time.",
  },
  {
    q: "Can I use LifeOS with my team?",
    a: "Yes. The Team plan adds shared goals, team dashboards and workload balancing while keeping individual plans private by default.",
  },
  {
    q: "What if I cancel?",
    a: "You keep full read access and a one-click export of every task, note, goal and habit. No lock-in, no dark patterns, cancel from Settings in two clicks.",
  },
];

export const stats = [
  { value: "91%", label: "average plan adherence after 6 weeks" },
  { value: "6.4h", label: "focus time reclaimed per week" },
  { value: "38k", label: "plans generated every morning" },
  { value: "4.9/5", label: "average rating across 2,100 reviews" },
];

export const logos = [
  "Northwind",
  "Ledgerly",
  "Kite",
  "Superset",
  "Fieldstack",
  "Arclight",
  "Bloomtree",
];
