import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Moon, Sun, RotateCcw, Bell, BellOff, BookMarked } from "lucide-react";
import { MANZIL_PLAN } from "@/lib/khatm-data";
import { useKhatm } from "@/lib/use-khatm";
import { CircularProgress } from "@/components/CircularProgress";
import { DayCard } from "@/components/DayCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Qur'an Weekly Khatm Planner — Complete the Qur'an in 7 Days" },
      { name: "description", content: "Follow the traditional Manzil division and build a consistent recitation habit. Track daily progress and complete the Qur'an every week." },
      { property: "og:title", content: "Qur'an Weekly Khatm Planner" },
      { property: "og:description", content: "Complete the Qur'an every 7 days using the Manzil division." },
      { name: "theme-color", content: "#1f3b5c" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/icon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: Home,
});

function Home() {
  const { state, hydrated, toggleDay, setNote, reset, setReminder } = useKhatm();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const completedCount = useMemo(
    () => Object.values(state.days).filter((d) => d.completed).length,
    [state.days],
  );
  const percent = (completedCount / 7) * 100;

  const today = new Date();
  const cycleStart = hydrated ? new Date(state.cycleStart) : today;
  const dayOfCycle = Math.min(7, Math.max(1, Math.floor((today.getTime() - cycleStart.getTime()) / 864e5) + 1));
  const eta = useMemo(() => {
    const remaining = 7 - completedCount;
    const d = new Date();
    d.setDate(d.getDate() + remaining);
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }, [completedCount]);

  const hijri = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-TN-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" }).format(today);
    } catch {
      return "";
    }
  }, [today]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight">Khatm Planner</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Manzil · 7 days</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setReminder(!state.reminderEnabled, state.reminderTime)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Toggle reminders"
            >
              {state.reminderEnabled ? <Bell className="h-4 w-4 text-gold" /> : <BellOff className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-8">
        {/* Hero */}
        <section className="text-center">
          <p className="font-arabic text-2xl text-gold" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Complete the Qur'an Every <span className="text-primary">7 Days</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Follow the traditional Manzil division and build a consistent recitation habit.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            {hijri && <> · <span className="text-gold">{hijri}</span></>}
          </p>
        </section>

        {/* Dashboard */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1 flex flex-col items-center justify-center rounded-2xl border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <CircularProgress value={percent} label="This week" sub={`${completedCount} / 7 days`} />
          </div>
          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
            <Stat label="Current streak" value={`${state.currentStreak} 🔥`} hint={`Longest: ${state.longestStreak}`} />
            <Stat label="Cycles completed" value={String(state.cyclesCompleted)} hint="Lifetime khatms" />
            <Stat label="Estimated finish" value={eta} hint="At this pace" />
            <Stat label="Day of cycle" value={`${dayOfCycle} / 7`} hint={`Started ${cycleStart.toLocaleDateString()}`} />
          </div>
        </section>

        {/* Reminder bar */}
        {state.reminderEnabled && (
          <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/5 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4 text-gold" />
              <span>Daily reminder at</span>
              <input
                type="time"
                value={state.reminderTime}
                onChange={(e) => setReminder(true, e.target.value)}
                className="rounded-md border bg-background px-2 py-1 text-sm"
              />
            </div>
            <p className="text-xs italic text-muted-foreground">
              "The most beloved deeds to Allah are those done consistently."
            </p>
          </section>
        )}

        {/* Plan */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h3 className="font-serif text-xl font-semibold">Your weekly plan</h3>
              <p className="text-xs text-muted-foreground">Tap the circle to mark a day complete.</p>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" /> Reset week
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {MANZIL_PLAN.map((m) => (
              <DayCard
                key={m.day}
                manzil={m}
                record={state.days[m.day]}
                isToday={m.day === dayOfCycle && !state.days[m.day].completed}
                onToggle={() => toggleDay(m.day)}
                onNote={(n) => setNote(m.day, n)}
              />
            ))}
          </div>
        </section>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p className="font-arabic text-base text-foreground" dir="rtl">
            خَيْرُكُمْ مَنْ تَعَلَّمَ ٱلْقُرْءَانَ وَعَلَّمَهُ
          </p>
          <p className="mt-1">"The best of you are those who learn the Qur'an and teach it." — Bukhari</p>
        </footer>
      </main>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-2xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
