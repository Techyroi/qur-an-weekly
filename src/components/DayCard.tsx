import { useState } from "react";
import { Check, BookOpen, FileText, Headphones, ChevronDown } from "lucide-react";
import type { ManzilDay } from "@/lib/khatm-data";
import type { DayRecord } from "@/lib/use-khatm";
import { cn } from "@/lib/utils";

type Props = {
  manzil: ManzilDay;
  record: DayRecord;
  isToday: boolean;
  onToggle: () => void;
  onNote: (n: string) => void;
};

export function DayCard({ manzil, record, isToday, onToggle, onNote }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "group rounded-2xl border bg-card p-5 transition-all",
        record.completed && "border-gold/40 bg-gold/5",
        isToday && !record.completed && "border-primary/40 ring-1 ring-primary/20",
      )}
      style={{ boxShadow: record.completed ? "var(--shadow-glow)" : "var(--shadow-elegant)" }}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          aria-label={record.completed ? "Mark incomplete" : "Mark complete"}
          className={cn(
            "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            record.completed
              ? "border-gold bg-gold text-gold-foreground"
              : "border-border hover:border-primary hover:bg-primary/5",
          )}
        >
          {record.completed ? <Check className="h-5 w-5" strokeWidth={3} /> : <span className="text-sm font-semibold text-muted-foreground">{manzil.day}</span>}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Day {manzil.day}</span>
            {isToday && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                Today
              </span>
            )}
          </div>
          <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">
            {manzil.startSurah} <span className="text-muted-foreground">→</span> {manzil.endSurah}
          </h3>
          <p className="font-arabic text-xl text-primary mt-1" dir="rtl">
            {manzil.startSurahArabic} — {manzil.endSurahArabic}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> {manzil.surahCount} surah{manzil.surahCount > 1 ? "s" : ""}</span>
            <span>~{manzil.estimatedPages} pages</span>
            <a href={manzil.reciterUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              <Headphones className="h-3 w-3" /> Listen
            </a>
          </div>

          {manzil.verse && (
            <blockquote className="mt-3 rounded-lg border-l-2 border-gold/60 bg-muted/40 p-3">
              <p className="font-arabic text-base text-foreground" dir="rtl">{manzil.verse.ar}</p>
              <p className="mt-1 text-xs italic text-muted-foreground">{manzil.verse.en}</p>
            </blockquote>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <FileText className="h-3 w-3" />
            Reflection
            <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <textarea
              value={record.notes}
              onChange={(e) => onNote(e.target.value)}
              placeholder="Write a reflection from today's recitation..."
              className="mt-2 w-full resize-none rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
          )}
        </div>
      </div>
    </div>
  );
}
