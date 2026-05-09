import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, Calendar, Bell, CheckCircle2, ChevronRight, Star, Heart, Sparkles, BookMarked } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight">Khatm Planner</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">7 · 15 · 30 day plans</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/auth" className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">Sign in</Link>
            <Link to="/auth" search={{ mode: "signup" }} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pt-20 text-center">
        <p className="font-arabic text-2xl text-gold sm:text-3xl" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
        <h1 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Complete the Qur'an with <span className="text-primary">Consistency</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Choose a 7-day, 15-day, or 30-day plan and track your recitation progress.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/auth" search={{ mode: "signup" }} className="inline-flex items-center gap-1 rounded-xl bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90" style={{ boxShadow: "var(--shadow-glow)" }}>
            Get Started <ChevronRight className="h-4 w-4" />
          </Link>
          <a href="#features" className="inline-flex items-center rounded-xl border bg-background px-6 py-3 text-base font-medium hover:bg-muted">
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-serif text-3xl font-bold">Everything you need to stay consistent</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Calendar, title: "Flexible Plans", body: "Pick the pace that fits your life — weekly, bi-weekly, or monthly khatm." },
            { icon: CheckCircle2, title: "Daily Tracking", body: "Mark each day complete and watch your streak grow." },
            { icon: Bell, title: "Gentle Reminders", body: "Set a daily reminder so your recitation becomes a habit." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold">The benefits of consistent recitation</h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                "A purified heart and increased tranquility (13:28).",
                "Light on the Day of Judgment for the believer.",
                "Intercession of the Qur'an for its companions.",
                "A multiplied reward — ten hasanat for every letter.",
                "Stronger memorization and deeper understanding.",
              ].map((b) => (
                <li key={b} className="flex gap-2">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border bg-card p-8 text-center" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <p className="font-arabic mt-4 text-2xl text-foreground" dir="rtl">
              وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ
            </p>
            <p className="mt-2 text-sm italic text-muted-foreground">
              "And We have certainly made the Qur'an easy for remembrance." (54:17)
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-serif text-3xl font-bold">Choose your plan</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">All plans are free. Switch anytime.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { type: "7", name: "Weekly Khatm", per: "~80 pages/day", desc: "Traditional Manzil division — complete the Qur'an every week." },
            { type: "15", name: "Bi-Weekly", per: "~40 pages/day", desc: "Balanced sections, finish the Qur'an every two weeks.", highlight: true },
            { type: "30", name: "Monthly Khatm", per: "1 Juz/day", desc: "Standard 30 Juz, one per day — great for Ramadan." },
          ].map((p) => (
            <div key={p.type} className={`relative rounded-2xl border bg-card p-6 ${p.highlight ? "border-gold/60" : ""}`} style={{ boxShadow: p.highlight ? "var(--shadow-glow)" : "var(--shadow-elegant)" }}>
              {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground">Popular</span>}
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.name}</p>
              <p className="mt-2 font-serif text-4xl font-bold text-primary">{p.type} <span className="text-base font-medium text-muted-foreground">days</span></p>
              <p className="mt-1 text-sm font-medium text-gold">{p.per}</p>
              <p className="mt-4 text-sm text-muted-foreground">{p.desc}</p>
              <Link to="/auth" search={{ mode: "signup" }} className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Start this plan
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-serif text-3xl font-bold">Loved by the community</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { name: "Aisha", quote: "I finally completed a khatm during Ramadan — alhamdulillah." },
            { name: "Yusuf", quote: "The 7-day plan keeps me grounded every week." },
            { name: "Fatimah", quote: "Simple, beautiful, and so easy to stay consistent." },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-3 text-sm italic text-foreground">"{t.quote}"</p>
              <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center font-serif text-3xl font-bold">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-8">
          {[
            { q: "Is the app free?", a: "Yes — all plans and features are free." },
            { q: "What is the Manzil division?", a: "A traditional 7-part split of the Qur'an by the early scholars to complete it weekly." },
            { q: "Can I switch plans?", a: "Yes — change your plan anytime from settings; your progress for the new plan starts fresh." },
            { q: "Does it work offline?", a: "Yes — your data is cached locally and syncs when you're online." },
            { q: "Will I get reminders?", a: "Yes — enable browser notifications during onboarding or in settings." },
          ].map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="font-arabic text-2xl text-foreground" dir="rtl">وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ</p>
          <p className="mt-2 text-sm italic text-muted-foreground">"And We have certainly made the Qur'an easy for remembrance." — (54:17)</p>
          <p className="mt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} Khatm Planner · Made with <BookOpen className="inline h-3 w-3 text-gold" /> for the Ummah</p>
        </div>
      </footer>
    </div>
  );
}
