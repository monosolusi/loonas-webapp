"use client";

import { useMemo } from "react";
import { Chip } from "@/core/presentations/components/chip";

const DENOMINATIONS = [1000, 5000, 10000, 50000, 100000];

type Suggestion = { label: string; amount: number };

function buildSuggestions(total: number): Suggestion[] {
  if (total <= 0) return [];

  const candidates = new Set<number>([total]);
  for (const d of DENOMINATIONS) {
    const ceil = Math.ceil(total / d) * d;
    if (ceil > total) candidates.add(ceil);
  }
  if (candidates.size === 1) {
    candidates.add(total + DENOMINATIONS[DENOMINATIONS.length - 1]);
  }

  const sorted = [...candidates].sort((a, b) => a - b);
  // Cap at 5 chips: keep "Pas" + the 4 highest. Drops the smallest non-Pas suggestion
  // (typically the +1K rounding) so cash-friendly higher denominations stay visible.
  const capped = sorted.length <= 5 ? sorted : [sorted[0], ...sorted.slice(2, 6)];

  return capped.map((amount) => ({
    label: amount === total ? "Pas" : `Rp ${amount.toLocaleString("id-ID")}`,
    amount,
  }));
}

type CashQuickAmountChipsProps = {
  total: number;
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
};

export function CashQuickAmountChips({ total, selectedAmount, onSelect }: CashQuickAmountChipsProps) {
  const suggestions = useMemo(() => buildSuggestions(total), [total]);

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {suggestions.map((s) => (
        <Chip
          key={s.amount}
          label={s.label}
          active={selectedAmount === s.amount}
          onClick={() => onSelect(s.amount)}
        />
      ))}
    </div>
  );
}
