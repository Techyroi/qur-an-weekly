type Props = { value: number; size?: number; stroke?: number; label?: string; sub?: string };

export function CircularProgress({ value, size = 180, stroke = 12, label, sub }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-muted)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-gold)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold text-foreground">{Math.round(value)}%</span>
        {label && <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</span>}
        {sub && <span className="text-xs text-muted-foreground mt-0.5">{sub}</span>}
      </div>
    </div>
  );
}
