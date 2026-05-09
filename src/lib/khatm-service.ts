import { supabase } from "@/integrations/supabase/client";
import { getPlan, type PlanType } from "./khatm-data";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  selected_plan: PlanType | null;
  mushaf: "madinah" | "hafs";
  reminder_enabled: boolean;
  reminder_time: string;
  theme: "light" | "dark";
  language: string;
  onboarded: boolean;
  cycle_start: string;
};

export type ProgressRow = {
  id: string;
  user_id: string;
  plan_type: PlanType;
  day_number: number;
  title: string;
  start_surah: string;
  end_surah: string;
  estimated_pages: number;
  completed: boolean;
  completed_at: string | null;
  notes: string;
};

export type Stats = {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  cycles_completed: number;
  last_completion_date: string | null;
};

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function fetchStats(userId: string): Promise<Stats | null> {
  const { data, error } = await supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data as Stats | null;
}

export async function fetchProgress(userId: string, planType: PlanType): Promise<ProgressRow[]> {
  const { data, error } = await supabase
    .from("plan_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("plan_type", planType)
    .order("day_number");
  if (error) throw error;
  return (data ?? []) as ProgressRow[];
}

export async function generatePlan(userId: string, planType: PlanType): Promise<void> {
  // remove existing for this plan
  await supabase.from("plan_progress").delete().eq("user_id", userId).eq("plan_type", planType);
  const rows = getPlan(planType).map((d) => ({
    user_id: userId,
    plan_type: planType,
    day_number: d.day,
    title: d.title,
    start_surah: d.startSurah,
    end_surah: d.endSurah,
    estimated_pages: d.estimatedPages,
  }));
  const { error } = await supabase.from("plan_progress").insert(rows);
  if (error) throw error;
  await supabase.from("profiles").update({ cycle_start: new Date().toISOString() }).eq("id", userId);
}

export async function toggleDay(row: ProgressRow, userId: string): Promise<void> {
  const nowDone = !row.completed;
  const { error } = await supabase
    .from("plan_progress")
    .update({ completed: nowDone, completed_at: nowDone ? new Date().toISOString() : null })
    .eq("id", row.id);
  if (error) throw error;
  if (nowDone) await bumpStreak(userId);
}

export async function setNote(rowId: string, notes: string): Promise<void> {
  await supabase.from("plan_progress").update({ notes }).eq("id", rowId);
}

async function bumpStreak(userId: string): Promise<void> {
  const stats = await fetchStats(userId);
  if (!stats) return;
  const today = new Date().toISOString().slice(0, 10);
  if (stats.last_completion_date === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = stats.last_completion_date === yesterday ? stats.current_streak + 1 : 1;
  await supabase.from("user_stats").update({
    current_streak: newStreak,
    longest_streak: Math.max(stats.longest_streak, newStreak),
    last_completion_date: today,
  }).eq("user_id", userId);
}

export async function maybeCompleteCycle(userId: string, planType: PlanType, rows: ProgressRow[]): Promise<boolean> {
  if (rows.length === 0 || !rows.every((r) => r.completed)) return false;
  const stats = await fetchStats(userId);
  await supabase.from("user_stats").update({
    cycles_completed: (stats?.cycles_completed ?? 0) + 1,
  }).eq("user_id", userId);
  await generatePlan(userId, planType); // resets all rows for the same plan
  return true;
}

export async function updateProfile(userId: string, patch: Partial<Profile>): Promise<void> {
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}
