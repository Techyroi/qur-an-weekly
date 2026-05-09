import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { BookMarked, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ mode: (s.mode as string) === "signup" ? "signup" : "signin" }),
  component: AuthPage,
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Required"),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">(mode);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) routeAfterAuth(navigate);
  }, [loading, user, navigate]);

  // signup state
  const [su, setSu] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [si, setSi] = useState({ email: "", password: "", remember: true });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse(su);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: su.email.trim(),
      password: su.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: su.fullName.trim() },
      },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created. Welcome!");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse(si);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: si.email.trim(), password: si.password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
  };

  const handleForgot = async () => {
    if (!si.email) { toast.error("Enter your email above first"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(si.email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Check your email for a reset link.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <BookMarked className="h-5 w-5" />
        </div>
        <span className="font-serif text-lg font-semibold">Khatm Planner</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-3 pt-4">
            <form onSubmit={handleSignIn} className="space-y-3">
              <Input type="email" placeholder="Email" value={si.email} onChange={(e) => setSi({ ...si, email: e.target.value })} autoComplete="email" />
              <Input type="password" placeholder="Password" value={si.password} onChange={(e) => setSi({ ...si, password: e.target.value })} autoComplete="current-password" />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox checked={si.remember} onCheckedChange={(v) => setSi({ ...si, remember: !!v })} />
                  Remember me
                </label>
                <button type="button" onClick={handleForgot} className="text-primary hover:underline">Forgot?</button>
              </div>
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-3 pt-4">
            <form onSubmit={handleSignUp} className="space-y-3">
              <Input placeholder="Full name" value={su.fullName} onChange={(e) => setSu({ ...su, fullName: e.target.value })} autoComplete="name" />
              <Input type="email" placeholder="Email" value={su.email} onChange={(e) => setSu({ ...su, email: e.target.value })} autoComplete="email" />
              <Input type="password" placeholder="Password (8+ chars)" value={su.password} onChange={(e) => setSu({ ...su, password: e.target.value })} autoComplete="new-password" />
              <Input type="password" placeholder="Confirm password" value={su.confirm} onChange={(e) => setSu({ ...su, confirm: e.target.value })} autoComplete="new-password" />
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">By signing up you agree to our terms.</p>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-foreground">← Back to home</Link>
    </div>
  );
}

function routeAfterAuth(navigate: ReturnType<typeof useNavigate>) {
  navigate({ to: "/dashboard" });
}
