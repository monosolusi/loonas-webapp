import clsx from "clsx";
import { LOW_STOCK_THRESHOLD } from "@/app/(pos)/pos/_components/availability-helpers";

type StockHintProps = {
  /** Variant's currentStock (TRADING/BATCH) or maxMakeable (ON_DEMAND). null → service / no concept. */
  available: number | null;
};

/** Tiny "· N" indicator shown only when stock is low. Returns null otherwise. */
export function StockHint({ available }: StockHintProps) {
  if (available === null) return null;
  if (available > LOW_STOCK_THRESHOLD) return null;
  if (available <= 0) return null; // out-of-stock is rendered via the unavailable chip, not here.

  const tone = available <= 3 ? "text-warning-300" : "text-neutral-400";

  return (
    <span className={clsx("flex flex-row items-center gap-x-0.5 text-xs", tone)}>
      <span aria-hidden>·</span>
      <span className="tabular-nums">{available}</span>
    </span>
  );
}
