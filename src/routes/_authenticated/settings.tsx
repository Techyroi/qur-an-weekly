import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchProfile, generatePlan, updateProfile, type Profile } from "@/lib/khatm-service";
import type { PlanType } from "@/lib/khatm-data";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({ component: SettingsPage });

function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) fetchProfile(user.id).then(setProfile); }, [user]);
  if (!profile || !user) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const save = async () => {
    setBusy(true);
    try {
      await updateProfile(user.id, {
        full_name: profile.full_name, reminder_time: profile.reminder_time,
        reminder_enabled: profile.reminder_enabled, theme: profile.theme,
        language: profile.language, mushaf: profile.mushaf,
      });
      if (pw.length >= 8) {
        const { error } = await supabase.auth.updateUser({ password: pw });
        if (error) throw error;
        setPw("");
      }
      toast.success("Saved");
    } catch (e: unknown) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  const changePlan = async (p: PlanType) => {
    if (!confirm(`Switch to the ${p}-day plan? Current progress will be reset.`)) return;
    setBusy(true);
    try {
      await updateProfile(user.id, { selected_plan: p });
      await generatePlan(user.id, p);
      toast.success("Plan updated");
      navigate({ to: "/dashboard" });
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="font-serif text-3xl font-bold">Settings</h1>

      <div className="mt-6 space-y-6">
        <Card title="Profile">
          <Field label="Full name"><Input value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></Field>
          <Field label="Email"><Input value={profile.email ?? ""} disabled /></Field>
          <Field label="New password (optional)"><Input type="password" placeholder="8+ characters" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
        </Card>

        <Card title="Plan">
          <div className="grid grid-cols-3 gap-2">
            {(["7", "15", "30"] as PlanType[]).map((p) => (
              <button key={p} onClick={() => changePlan(p)}
                className={`rounded-xl border p-3 text-center text-sm transition-all ${profile.selected_plan === p ? "border-primary bg-primary/5 font-semibold" : "hover:bg-muted"}`}>
                {p} days
              </button>
            ))}
          </div>
        </Card>

        <Card title="Reminders">
          <Field label="Enable">
            <input type="checkbox" checked={profile.reminder_enabled} onChange={(e) => setProfile({ ...profile, reminder_enabled: e.target.checked })} className="h-4 w-4 accent-primary" />
          </Field>
          <Field label="Time"><input type="time" value={profile.reminder_time} onChange={(e) => setProfile({ ...profile, reminder_time: e.target.value })} className="rounded-md border bg-background px-2 py-1 text-sm" /></Field>
        </Card>

        <Card title="Preferences">
          <Field label="Theme">
            <select value={profile.theme} onChange={(e) => setProfile({ ...profile, theme: e.target.value as "light" | "dark" })} className="rounded-md border bg-background px-2 py-1 text-sm">
              <option value="light">Light</option><option value="dark">Dark</option>
            </select>
          </Field>
          <Field label="Mushaf">
            <select value={profile.mushaf} onChange={(e) => setProfile({ ...profile, mushaf: e.target.value as "madinah" | "hafs" })} className="rounded-md border bg-background px-2 py-1 text-sm">
              <option value="madinah">Madinah</option><option value="hafs">Hafs</option>
            </select>
          </Field>
          <Field label="Language">
            <select value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })} className="rounded-md border bg-background px-2 py-1 text-sm">
              <option value="en">English</option><option value="ar">العربية</option>
            </select>
          </Field>
        </Card>

        <Button onClick={save} disabled={busy} className="w-full">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}</Button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <h2 className="font-serif text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <label className="text-sm text-muted-foreground">{label}</label>
      <div className="min-w-[160px] flex-1 sm:flex-none">{children}</div>
    </div>
  );
}
