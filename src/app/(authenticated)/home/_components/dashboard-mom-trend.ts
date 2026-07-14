// Shared month-over-month trend logic for the dashboard headline tiles (Pendapatan, Beban, Kas keluar).
// `changes` is a percentage vs the preceding equal-length period (from GET /dashboard); null when the
// baseline was zero and a percentage can't be computed.

export type MomTrend = {
  variant: "success" | "error" | "neutral";
  label: string;
  srText: string;
};

type ComputeMomTrendOptions = {
  // Expense / cash-out figures invert the good/bad reading: a rise reads as caution, a fall as
  // improvement. The arrow (↑/↓) always stays factual — only the color tint flips.
  invert?: boolean;
  // Subject noun for the screen-reader sentence, e.g. "Pendapatan", "Beban", "Kas keluar".
  noun?: string;
};

export function computeMomTrend(
  changes: number | null | undefined,
  opts?: ComputeMomTrendOptions,
): MomTrend | null {
  if (changes === null || changes === undefined) return null;
  const noun = opts?.noun ?? "Nilai";
  const pct = Math.abs(Math.round(changes));
  if (pct === 0) {
    return { variant: "neutral", label: "0%", srText: `${noun} sama dengan bulan lalu` };
  }
  const up = changes > 0;
  const good = opts?.invert ? !up : up;
  return {
    variant: good ? "success" : "error",
    label: `${up ? "↑" : "↓"} ${pct}%`,
    srText: `${noun} ${up ? "naik" : "turun"} ${pct}% dibanding bulan lalu`,
  };
}
