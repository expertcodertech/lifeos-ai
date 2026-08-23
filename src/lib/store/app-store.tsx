"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  events as seedEvents,
  goals as seedGoals,
  habits as seedHabits,
  notes as seedNotes,
  tasks as seedTasks,
  user as seedUser,
} from "@/lib/data/seed";
import type {
  CalendarEvent,
  Goal,
  Habit,
  Note,
  Task,
  UserProfile,
} from "@/lib/types";

const STORAGE_KEY = "lifeos.workspace.v1";

interface State {
  tasks: Task[];
  events: CalendarEvent[];
  goals: Goal[];
  habits: Habit[];
  notes: Note[];
  user: UserProfile;
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; payload: Partial<State> }
  | { type: "task/add"; payload: Task }
  | { type: "task/update"; payload: { id: string; patch: Partial<Task> } }
  | { type: "task/toggle"; payload: string }
  | { type: "task/remove"; payload: string }
  | { type: "event/add"; payload: CalendarEvent }
  | { type: "event/remove"; payload: string }
  | { type: "habit/toggle"; payload: string }
  | { type: "habit/add"; payload: Habit }
  | { type: "goal/toggleMilestone"; payload: { goalId: string; milestoneId: string } }
  | { type: "goal/add"; payload: Goal }
  | { type: "note/upsert"; payload: Note }
  | { type: "note/remove"; payload: string }
  | { type: "note/togglePin"; payload: string }
  | { type: "user/update"; payload: Partial<UserProfile> }
  | { type: "workspace/reset" };

const initialState: State = {
  tasks: seedTasks,
  events: seedEvents,
  goals: seedGoals,
  habits: seedHabits,
  notes: seedNotes,
  user: seedUser,
  hydrated: false,
};

function recomputeGoalProgress(goal: Goal): Goal {
  if (goal.milestones.length === 0) return goal;
  const done = goal.milestones.filter((m) => m.done).length;
  return { ...goal, progress: Math.round((done / goal.milestones.length) * 100) };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload, hydrated: true };

    case "task/add":
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case "task/update":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.patch } : t,
        ),
      };

    case "task/toggle":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, status: t.status === "done" ? "todo" : "done" }
            : t,
        ),
      };

    case "task/remove":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };

    case "event/add":
      return {
        ...state,
        events: [...state.events, action.payload].sort((a, b) =>
          a.start.localeCompare(b.start),
        ),
      };

    case "event/remove":
      return { ...state, events: state.events.filter((e) => e.id !== action.payload) };

    case "habit/toggle":
      return {
        ...state,
        habits: state.habits.map((h) => {
          if (h.id !== action.payload) return h;
          const completedToday = !h.completedToday;
          const streak = completedToday ? h.streak + 1 : Math.max(0, h.streak - 1);
          return {
            ...h,
            completedToday,
            streak,
            bestStreak: Math.max(h.bestStreak, streak),
            history: [...h.history.slice(0, -1), completedToday],
          };
        }),
      };

    case "habit/add":
      return { ...state, habits: [...state.habits, action.payload] };

    case "goal/toggleMilestone":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.goalId
            ? recomputeGoalProgress({
                ...g,
                milestones: g.milestones.map((m) =>
                  m.id === action.payload.milestoneId ? { ...m, done: !m.done } : m,
                ),
              })
            : g,
        ),
      };

    case "goal/add":
      return { ...state, goals: [...state.goals, action.payload] };

    case "note/upsert": {
      const exists = state.notes.some((n) => n.id === action.payload.id);
      return {
        ...state,
        notes: exists
          ? state.notes.map((n) => (n.id === action.payload.id ? action.payload : n))
          : [action.payload, ...state.notes],
      };
    }

    case "note/remove":
      return { ...state, notes: state.notes.filter((n) => n.id !== action.payload) };

    case "note/togglePin":
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload ? { ...n, pinned: !n.pinned } : n,
        ),
      };

    case "user/update":
      return { ...state, user: { ...state.user, ...action.payload } };

    case "workspace/reset":
      return { ...initialState, hydrated: true };

    default:
      return state;
  }
}

interface AppStore extends State {
  dispatch: (action: Action) => void;
  addTask: (input: Partial<Task> & { title: string }) => Task;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleHabit: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  saveNote: (note: Note) => void;
  removeNote: (id: string) => void;
  togglePin: (id: string) => void;
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  reset: () => void;
}

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "hydrate", payload: JSON.parse(raw) as Partial<State> });
        return;
      }
    } catch {
      // Corrupted or unavailable storage falls back to seed data.
    }
    dispatch({ type: "hydrate", payload: {} });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          tasks: state.tasks,
          events: state.events,
          goals: state.goals,
          habits: state.habits,
          notes: state.notes,
          user: state.user,
        }),
      );
    } catch {
      // Storage full or blocked — the session stays in memory.
    }
  }, [state]);

  const addTask = useCallback((input: Partial<Task> & { title: string }) => {
    const task: Task = {
      id: `task-${Math.random().toString(36).slice(2, 9)}`,
      status: "todo",
      priority: "medium",
      area: "personal",
      estimateMinutes: 30,
      createdAt: new Date().toISOString().slice(0, 10),
      ...input,
    };
    dispatch({ type: "task/add", payload: task });
    return task;
  }, []);

  const value = useMemo<AppStore>(
    () => ({
      ...state,
      dispatch,
      addTask,
      toggleTask: (id) => dispatch({ type: "task/toggle", payload: id }),
      removeTask: (id) => dispatch({ type: "task/remove", payload: id }),
      updateTask: (id, patch) => dispatch({ type: "task/update", payload: { id, patch } }),
      toggleHabit: (id) => dispatch({ type: "habit/toggle", payload: id }),
      toggleMilestone: (goalId, milestoneId) =>
        dispatch({ type: "goal/toggleMilestone", payload: { goalId, milestoneId } }),
      saveNote: (note) => dispatch({ type: "note/upsert", payload: note }),
      removeNote: (id) => dispatch({ type: "note/remove", payload: id }),
      togglePin: (id) => dispatch({ type: "note/togglePin", payload: id }),
      addEvent: (event) => dispatch({ type: "event/add", payload: event }),
      removeEvent: (id) => dispatch({ type: "event/remove", payload: id }),
      updateUser: (patch) => dispatch({ type: "user/update", payload: patch }),
      reset: () => dispatch({ type: "workspace/reset" }),
    }),
    [state, addTask],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStore {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside <AppStoreProvider>");
  return ctx;
}
