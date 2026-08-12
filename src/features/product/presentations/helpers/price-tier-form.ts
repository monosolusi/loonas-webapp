import { PriceTierEntity } from "@/features/product/domain/entities/price-tier";
import { SavePriceTiersUseCaseTier } from "@/features/product/domain/usecases/save-price-tiers.usecases";
import {
  PriceTierFormRow,
  PriceTierRowErrors,
} from "@/features/product/presentations/types/price-tier-form.types";

/** The server rejects anything at or below this; the floor is exclusive and is NOT 2. */
export const MIN_QTY_EXCLUSIVE_FLOOR = 1;

/** The server rejects more than this many tiers. */
export const MAX_TIER_ROWS = 10;

export function createEmptyPriceTierRow(): PriceTierFormRow {
  return { key: crypto.randomUUID(), minQty: "", unitPrice: 0 };
}

/**
 * Parses a `min_qty` the user typed.
 *
 * Accepts both "1,5" and "1.5" as 1.5. A quantity threshold is a small number and never
 * needs thousands grouping, so a lone separator is unambiguously a decimal point — which
 * is precisely what makes this safe where the shared id-ID number parser is not.
 */
export function parseMinQty(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/** Formats a stored threshold back into the id-ID text the editor shows. */
export function formatMinQty(value: number): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: 10 });
}

export function scheduleToFormRows(tiers: readonly PriceTierEntity[]): PriceTierFormRow[] {
  return tiers.map((tier) => ({
    key: crypto.randomUUID(),
    minQty: formatMinQty(tier.minQty),
    unitPrice: tier.unitPrice,
  }));
}

export function toSaveTiers(rows: readonly PriceTierFormRow[]): SavePriceTiersUseCaseTier[] {
  // Submitted order is irrelevant to the server, so rows go up exactly as the user left
  // them; ascending order comes back on the next read.
  return rows.map((row) => ({ minQty: parseMinQty(row.minQty) ?? 0, unitPrice: row.unitPrice }));
}

export function validatePriceTierRows(rows: readonly PriceTierFormRow[]): {
  rowErrors: PriceTierRowErrors;
  isValid: boolean;
} {
  const rowErrors: PriceTierRowErrors = {};
  let isValid = true;

  for (const row of rows) {
    const parsed = parseMinQty(row.minQty);

    if (parsed === null) {
      rowErrors[row.key] = { minQty: "Isi jumlah minimal, contoh 1,5 atau 10." };
      isValid = false;
    } else if (parsed <= MIN_QTY_EXCLUSIVE_FLOOR) {
      rowErrors[row.key] = { minQty: "Jumlah minimal harus lebih dari 1." };
      isValid = false;
    } else if (row.unitPrice < 0) {
      rowErrors[row.key] = { unitPrice: "Harga tidak boleh negatif." };
      isValid = false;
    }
  }

  // Zero rows is deliberately valid: an empty schedule is the legal "clear it" path, not
  // an incomplete form. Do NOT add a minimum-row floor here — the other repeating-row
  // forms in this codebase have one, and copying it would break clearing a schedule.
  return { rowErrors, isValid };
}

/**
 * Duplicate thresholds, strictly-decreasing prices and tier-vs-base comparisons are
 * deliberately NOT checked here. They are server rules, and the base price shown on the
 * variant card may be an unsaved edit, so a local comparison could reject a valid
 * schedule. The 422 handler renders the server's verdict instead.
 */
