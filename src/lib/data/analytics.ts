export interface FocusPoint {
  day: string;
  focusHours: number;
  tasksDone: number;
  planAdherence: number;
}

export const weeklyFocus: FocusPoint[] = [
  { day: "Mon", focusHours: 4.5, tasksDone: 7, planAdherence: 82 },
  { day: "Tue", focusHours: 5.2, tasksDone: 9, planAdherence: 91 },
  { day: "Wed", focusHours: 3.1, tasksDone: 5, planAdherence: 64 },
  { day: "Thu", focusHours: 5.8, tasksDone: 11, planAdherence: 94 },
  { day: "Fri", focusHours: 4.9, tasksDone: 8, planAdherence: 88 },
  { day: "Sat", focusHours: 2.2, tasksDone: 4, planAdherence: 71 },
  { day: "Sun", focusHours: 1.6, tasksDone: 3, planAdherence: 68 },
];

export const areaBalance = [
  { area: "Work", value: 42, color: "var(--chart-1)" },
  { area: "Health", value: 21, color: "var(--chart-4)" },
  { area: "Learning", value: 15, color: "var(--chart-2)" },
  { area: "Finance", value: 10, color: "var(--chart-3)" },
  { area: "Personal", value: 12, color: "var(--chart-5)" },
];

export const monthlyMomentum = [
  { week: "W1", planned: 38, completed: 29 },
  { week: "W2", planned: 41, completed: 34 },
  { week: "W3", planned: 36, completed: 33 },
  { week: "W4", planned: 44, completed: 40 },
  { week: "W5", planned: 40, completed: 37 },
  { week: "W6", planned: 46, completed: 43 },
];

export const energyByHour = [
  { hour: "6a", energy: 42 },
  { hour: "8a", energy: 68 },
  { hour: "10a", energy: 92 },
  { hour: "12p", energy: 74 },
  { hour: "2p", energy: 51 },
  { hour: "4p", energy: 63 },
  { hour: "6p", energy: 58 },
  { hour: "8p", energy: 38 },
];

export const insights = [
  {
    id: "insight-1",
    title: "Your best focus window is 9:30–11:30am",
    body: "Tasks scheduled here finish 2.4x more often. LifeOS now protects it by default.",
    tone: "positive" as const,
  },
  {
    id: "insight-2",
    title: "Wednesdays are your weak point",
    body: "Plan adherence drops to 64% — mostly from back-to-back meetings after 1pm.",
    tone: "warning" as const,
  },
  {
    id: "insight-3",
    title: "Health is trending up 3 weeks straight",
    body: "You moved 21% of your scheduled time to health, up from 12% last month.",
    tone: "positive" as const,
  },
];
