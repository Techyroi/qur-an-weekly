import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Moon, Sun, RotateCcw, Bell, BellOff, BookMarked, Settings, LogOut, Loader2, Check, FileText, ChevronDown, BookOpen, Headphones } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { CircularProgress } from "@/components/CircularProgress";
import { fetchProfile, fetchProgress, fetchStats, generatePlan, maybeCompleteCycle, setNote, toggleDay, type Profile, type ProgressRow, type Stats, updateProfile } from "@/lib/khatm-service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    if (!p?.onboarded || !p.selected_plan) { navigate({ to: "/onboarding" }); return; }
    const [rows, s] = await Promise.all([fetchProgress(user.id, p.selected_plan), fetchStats(user.id)]);
    setProfile(p); setProgress(rows); setStats(s); setLoading(false);
    document.documentElement.classList.toggle("dark", p.theme === "dark");
  }, [user, navigate]);

  useEffect(() => { load(); }, [load]);

  const completedCount = useMemo(() => progress.filter((r) => r.completed).length, [progress]);
  const total = progress.length || 1;
  const percent = (completedCount / total) * 100;

  const today = new Date();
  const cycleStart = profile ? new Date(profile.cycle_start) : today;
  const dayOfCycle = Math.min(total, Math.max(1, Math.floor((today.getTime() - cycleStart.getTime()) / 864e5) + 1));
  const eta = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (total - completedCount));
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }, [completedCount, total]);

  const onToggle = async (row: ProgressRow) => {
    if (!user) return;
    await toggleDay(row, user.id);
    const fresh = await fetchProgress(user.id, row.plan_type);
    const cycled = await maybeCompleteCycle(user.id, row.plan_type, fresh);
    if (cycled) toast.success("Khatm completed! May Allah accept it. 🌙");
    await load();
  };

  const onNote = async (row: ProgressRow, n: string) => {
    setProgress((p) => p.map((r) => (r.id === row.id ? { ...r, notes: n } : r)));
    await setNote(row.id, n);
  };

  const reset = async () => {
    if (!user || !profile?.selected_plan) return;
    if (!confirm("Reset this cycle's progress?")) return;
    await generatePlan(user.id, profile.selected_plan);
    await load();
  };

  const toggleTheme = async () => {
    if (!user || !profile) return;
    const next = profile.theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    await updateProfile(user.id, { theme: next });
    setProfile({ ...profile, theme: next });
  };

  const toggleReminder = async () => {
    if (!user || !profile) return;
    const next = !profile.reminder_enabled;
    if (next && "Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    await updateProfile(user.id, { reminder_enabled: next });
    setProfile({ ...profile, reminder_enabled: next });
  };

  if (loading || !profile) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><BookMarked className="h-5 w-5" /></div>
            <div>
              <h1 className="text-sm font-semibold leading-tight">Khatm Planner</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{profile.selected_plan}-day plan</p>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <button onClick={toggleReminder} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Toggle reminders">
              {profile.reminder_enabled ? <Bell className="h-4 w-4 text-gold" /> : <BellOff className="h-4 w-4" />}
            </button>
            <button onClick={toggleTheme} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Toggle theme">
              {profile.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/settings" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Settings"><Settings className="h-4 w-4" /></Link>
            <button onClick={() => signOut()} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Sign out"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-8">
        <section className="text-center">
          <p className="font-arabic text-2xl text-gold" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1 flex items-center justify-center rounded-2xl border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <CircularProgress value={percent} label="This cycle" sub={`${completedCount} / ${total} days`} />
          </div>
          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
            <Stat label="Current streak" value={`${stats?.current_streak ?? 0} 🔥`} hint={`Longest: ${stats?.longest_streak ?? 0}`} />
            <Stat label="Cycles completed" value={String(stats?.cycles_completed ?? 0)} hint="Lifetime khatms" />
            <Stat label="Estimated finish" value={eta} hint="At this pace" />
            <Stat label="Day of cycle" value={`${dayOfCycle} / ${total}`} hint={`Started ${cycleStart.toLocaleDateString()}`} />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h3 className="font-serif text-xl font-semibold">Your plan</h3>
              <p className="text-xs text-muted-foreground">Tap the circle to mark a day complete.</p>
            </div>
            <button onClick={reset} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {progress.map((r) => (
              <ProgressCard key={r.id} row={r} isToday={r.day_number === dayOfCycle && !r.completed}
                onToggle={() => onToggle(r)} onNote={(n) => onNote(r, n)} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ProgressCard({ row, isToday, onToggle, onNote }: { row: ProgressRow; isToday: boolean; onToggle: () => void; onNote: (n: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("rounded-2xl border bg-card p-5 transition-all",
      row.completed && "border-gold/40 bg-gold/5",
      isToday && !row.completed && "border-primary/40 ring-1 ring-primary/20")}
      style={{ boxShadow: row.completed ? "var(--shadow-glow)" : "var(--shadow-elegant)" }}>
      <div className="flex items-start gap-4">
        <button onClick={onToggle} aria-label={row.completed ? "Mark incomplete" : "Mark complete"}
          className={cn("mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            row.completed ? "border-gold bg-gold text-gold-foreground" : "border-border hover:border-primary hover:bg-primary/5")}>
          {row.completed ? <Check className="h-5 w-5" strokeWidth={3} /> : <span className="text-sm font-semibold text-muted-foreground">{row.day_number}</span>}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{row.title}</span>
            {isToday && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Today</span>}
          </div>
          <h3 className="mt-1 font-serif text-lg font-semibold">{row.start_surah} <span className="text-muted-foreground">→</span> {row.end_surah}</h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> ~{row.estimated_pages} pages</span>
            <a href={`https://quran.com/`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              <Headphones className="h-3 w-3" /> Listen
            </a>
          </div>
          <button onClick={() => setOpen((o) => !o)} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            <FileText className="h-3 w-3" /> Reflection <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <textarea value={row.notes} onChange={(e) => onNote(e.target.value)}
              placeholder="Write a reflection from today's recitation..."
              className="mt-2 w-full resize-none rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring" rows={3} />
          )}
        </div>
      </div>
    </div>
  );
}
