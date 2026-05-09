import { useEffect, useState, useCallback } from "react";

export type DayRecord = {
  completed: boolean;
  completionDate: string | null;
  notes: string;
};

export type KhatmState = {
  cycleStart: string;
  days: Record<number, DayRecord>;
  cyclesCompleted: number;
  longestStreak: number;
  currentStreak: number;
  lastCompletionDate: string | null;
  reminderEnabled: boolean;
  reminderTime: string;
};

const STORAGE_KEY = "khatm-planner-v1";

const emptyDays = (): Record<number, DayRecord> =>
  Object.fromEntries(
    Array.from({ length: 7 }, (_, i) => [
      i + 1,
      { completed: false, completionDate: null, notes: "" },
    ]),
  );

const initial = (): KhatmState => ({
  cycleStart: new Date().toISOString(),
  days: emptyDays(),
  cyclesCompleted: 0,
  longestStreak: 0,
  currentStreak: 0,
  lastCompletionDate: null,
  reminderEnabled: false,
  reminderTime: "06:00",
});

export function useKhatm() {
  const [state, setState] = useState<KhatmState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initial(), ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const toggleDay = useCallback((day: number) => {
    setState((s) => {
      const cur = s.days[day];
      const nowDone = !cur.completed;
      const newDays = {
        ...s.days,
        [day]: {
          ...cur,
          completed: nowDone,
          completionDate: nowDone ? new Date().toISOString() : null,
        },
      };
      let { currentStreak, longestStreak, lastCompletionDate, cyclesCompleted, cycleStart } = s;
      if (nowDone) {
        const today = new Date().toDateString();
        const last = lastCompletionDate ? new Date(lastCompletionDate).toDateString() : null;
        if (last !== today) {
          const yest = new Date(Date.now() - 864e5).toDateString();
          currentStreak = last === yest ? currentStreak + 1 : 1;
          longestStreak = Math.max(longestStreak, currentStreak);
          lastCompletionDate = new Date().toISOString();
        }
      }
      const allDone = Object.values(newDays).every((d) => d.completed);
      if (allDone) {
        cyclesCompleted += 1;
        return {
          ...s,
          days: emptyDays(),
          cycleStart: new Date().toISOString(),
          cyclesCompleted,
          currentStreak,
          longestStreak,
          lastCompletionDate,
        };
      }
      return { ...s, days: newDays, currentStreak, longestStreak, lastCompletionDate, cycleStart };
    });
  }, []);

  const setNote = useCallback((day: number, notes: string) => {
    setState((s) => ({ ...s, days: { ...s.days, [day]: { ...s.days[day], notes } } }));
  }, []);

  const reset = useCallback(() => {
    setState((s) => ({ ...s, days: emptyDays(), cycleStart: new Date().toISOString() }));
  }, []);

  const setReminder = useCallback((enabled: boolean, time: string) => {
    setState((s) => ({ ...s, reminderEnabled: enabled, reminderTime: time }));
  }, []);

  return { state, hydrated, toggleDay, setNote, reset, setReminder };
}
