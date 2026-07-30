import { PriceTierEntity } from "@/features/product/domain/entities/price-tier";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { TierMode } from "@/features/product/domain/enums/tier-mode";

/**
 * DISPLAY-ONLY estimate of what a cart line will cost.
 *
 * The server is the sole authority on POS pricing: `POST /pos/sales` resolves every line
 * from the variant's own schedule and rejects a submitted `unit_price` that disagrees.
 * Nothing here may ever reach a request body — its only job is to keep the pre-submit
 * quote honest, because the cashier collects cash and hands back change *before* the
 * sale is created. Quoting base price x qty on a tiered basket overcharges the customer
 * at the counter.
 *
 * Every field is named `estimated*` for that reason. After a 201 lands, every displayed
 * amount must come from the response instead.
 *
 * Divergence from the server's arithmetic is possible (its rounding is unspecified) and
 * costs at most a rupiah or two on the quote, which the receipt then corrects. It can
 * never cause a rejected sale, because the client no longer sends a price at all.
 */

export type PriceTierPreviewInput = {
  /** The variant's list price, whole rupiah. */
  basePrice: number;
  /** `null` when the schedule was never hydrated — treated as flat. */
  schedule: PriceTierScheduleEntity | null;
  /** May be fractional. */
  qty: number;
};

export type PriceTierPreviewResult = {
  /** Whole rupiah. DISPLAY ONLY. */
  estimatedLineAmount: number;
  /** Presentational unit price, 2dp. Blended under GRADUATED. DISPLAY ONLY. */
  estimatedUnitPrice: number;
  /** `min_qty` of the highest bracket reached; `null` when no bracket applies. */
  appliedTierMinQty: number | null;
  /** Whether a bracket applied. Deliberately not called `priceSource` — that name belongs
   * to the invoice domain and describes what the server actually charged. */
  isTiered: boolean;
};

function clamp(value: number, lower: number, upper: number): number {
  return Math.min(Math.max(value, lower), upper);
}

function ascendingByMinQty(tiers: readonly PriceTierEntity[]): PriceTierEntity[] {
  // Defensive copy: the server sorts, but a locally-built schedule may not, and mutating
  // the caller's array would be a surprise.
  return [...tiers].sort((a, b) => a.minQty - b.minQty);
}

/** Highest bracket whose threshold the quantity reaches. Entry is inclusive of `minQty`. */
function reachedBracket(sorted: PriceTierEntity[], qty: number): PriceTierEntity | null {
  let reached: PriceTierEntity | null = null;
  for (const tier of sorted) {
    if (tier.minQty <= qty) reached = tier;
    else break;
  }
  return reached;
}

/** Whole quantity at one price. */
function volumeAmount(sorted: PriceTierEntity[], basePrice: number, qty: number): number {
  const bracket = reachedBracket(sorted, qty);
  return (bracket ? bracket.unitPrice : basePrice) * qty;
}

/** Each bracket priced separately across the span it covers, then summed. */
function graduatedAmount(sorted: PriceTierEntity[], basePrice: number, qty: number): number {
  // The span below the first threshold is charged at the base price.
  let amount = basePrice * clamp(qty, 0, sorted[0].minQty);

  for (let index = 0; index < sorted.length; index += 1) {
    const tier = sorted[index];
    const next = sorted[index + 1];
    const spanWidth = next ? next.minQty - tier.minQty : Number.POSITIVE_INFINITY;
    amount += tier.unitPrice * clamp(qty - tier.minQty, 0, spanWidth);
  }

  return amount;
}

export function previewLinePrice(input: PriceTierPreviewInput): PriceTierPreviewResult {
  const { basePrice, schedule, qty } = input;

  if (qty <= 0) {
    return { estimatedLineAmount: 0, estimatedUnitPrice: basePrice, appliedTierMinQty: null, isTiered: false };
  }

  const tiers = schedule?.tiers ?? [];
  if (tiers.length === 0) {
    return {
      estimatedLineAmount: Math.round(basePrice * qty),
      estimatedUnitPrice: basePrice,
      appliedTierMinQty: null,
      isTiered: false,
    };
  }

  const sorted = ascendingByMinQty(tiers);
  const bracket = reachedBracket(sorted, qty);

  const rawAmount =
    schedule?.tierMode === TierMode.GRADUATED
      ? graduatedAmount(sorted, basePrice, qty)
      : volumeAmount(sorted, basePrice, qty);

  return {
    estimatedLineAmount: Math.round(rawAmount),
    // Derived from the UNROUNDED amount so rounding never compounds. Under GRADUATED this
    // is a blend that deliberately does not reproduce the line amount.
    estimatedUnitPrice: Math.round((rawAmount / qty) * 100) / 100,
    appliedTierMinQty: bracket ? bracket.minQty : null,
    isTiered: bracket !== null,
  };
}
