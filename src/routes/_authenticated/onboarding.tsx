import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, Calendar, BookOpen, Bell, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchProfile, generatePlan, updateProfile } from "@/lib/khatm-service";
import type { PlanType } from "@/lib/khatm-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<PlanType>("7");
  const [mushaf, setMushaf] = useState<"madinah" | "hafs">("madinah");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("06:00");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then((p) => {
      if (p?.onboarded) navigate({ to: "/dashboard" });
    });
  }, [user, navigate]);

  const finish = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await updateProfile(user.id, {
        selected_plan: plan, mushaf, reminder_enabled: reminderEnabled, reminder_time: reminderTime, onboarded: true,
      });
      await generatePlan(user.id, plan);
      if (reminderEnabled && "Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }
      toast.success("You're all set!");
      navigate({ to: "/dashboard" });
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 w-12 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
          {step === 1 && (
            <Step icon={Calendar} title="Choose your plan" subtitle="How quickly do you want to complete the Qur'an?">
              <div className="space-y-2">
                {([
                  { v: "7", t: "7 Days — Weekly Khatm", d: "Traditional Manzil division" },
                  { v: "15", t: "15 Days", d: "Balanced ~40 pages per day" },
                  { v: "30", t: "30 Days — One Juz per day", d: "Great for Ramadan" },
                ] as const).map((o) => (
                  <button key={o.v} onClick={() => setPlan(o.v)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${plan === o.v ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "hover:bg-muted"}`}>
                    <p className="font-semibold">{o.t}</p>
                    <p className="text-xs text-muted-foreground">{o.d}</p>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step icon={BookOpen} title="Preferred Mushaf" subtitle="Which copy do you usually read from?">
              <div className="grid grid-cols-2 gap-3">
                {([{ v: "madinah", t: "Madinah Mushaf", d: "604 pages" }, { v: "hafs", t: "Hafs Mushaf", d: "Standard Hafs" }] as const).map((o) => (
                  <button key={o.v} onClick={() => setMushaf(o.v)}
                    className={`rounded-xl border p-4 text-left transition-all ${mushaf === o.v ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "hover:bg-muted"}`}>
                    <p className="font-semibold">{o.t}</p>
                    <p className="text-xs text-muted-foreground">{o.d}</p>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step icon={Bell} title="Daily reminder" subtitle="Set a time to nudge yourself each day.">
              <label className="flex items-center justify-between rounded-xl border p-4">
                <span className="text-sm font-medium">Enable reminders</span>
                <input type="checkbox" checked={reminderEnabled} onChange={(e) => setReminderEnabled(e.target.checked)} className="h-4 w-4 accent-primary" />
              </label>
              {reminderEnabled && (
                <label className="mt-3 flex items-center justify-between rounded-xl border p-4">
                  <span className="text-sm font-medium">Time</span>
                  <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="rounded-md border bg-background px-2 py-1 text-sm" />
                </label>
              )}
            </Step>
          )}

          {step === 4 && (
            <Step icon={CheckCircle2} title="You're ready!" subtitle="Confirm your setup and start your journey.">
              <ul className="space-y-2 rounded-xl border bg-muted/30 p-4 text-sm">
                <li><span className="text-muted-foreground">Plan:</span> <b>{plan} days</b></li>
                <li><span className="text-muted-foreground">Mushaf:</span> <b className="capitalize">{mushaf}</b></li>
                <li><span className="text-muted-foreground">Reminder:</span> <b>{reminderEnabled ? `Daily at ${reminderTime}` : "Off"}</b></li>
              </ul>
            </Step>
          )}

          <div className="mt-6 flex justify-between gap-3">
            <Button variant="outline" disabled={step === 1 || busy} onClick={() => setStep((s) => s - 1)}>Back</Button>
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={finish} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Finish setup"}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ icon: Icon, title, subtitle, children }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
        <div>
          <h2 className="font-serif text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
