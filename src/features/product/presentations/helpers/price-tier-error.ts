import { ErrorCodes, ServerError } from "@/core/resources/server-error";

/**
 * Centralised classification AND messaging for every price-tier write failure.
 *
 * Both halves live here deliberately: a helper that maps codes to messages but leaves the
 * matching predicate scattered across call sites is only half-centralised, and the two
 * drift apart. Call sites should branch on `kind`, never on `err.code` directly.
 *
 * The 422 bodies these read are FLAT — `reason`, `min_qty`, `count`, `offending_variants`,
 * `offending_tiers` and `new_price` sit alongside `code`/`message` with no `details`
 * envelope. `HttpRequest` forwards those top-level keys onto `ServerError.details`.
 */

export const PriceTierScheduleReason = {
  TOO_MANY_TIERS: "too_many_tiers",
  DUPLICATE_MIN_QTY: "duplicate_min_qty",
  UNIT_PRICE_EXCEEDS_BASE: "unit_price_exceeds_base",
  PRICE_NOT_STRICTLY_DECREASING: "price_not_strictly_decreasing",
  VARIANT_PRICE_BELOW_TIER: "variant_price_below_tier",
} as const;

export type PriceTierScheduleReasonType = (typeof PriceTierScheduleReason)[keyof typeof PriceTierScheduleReason];

export type OffendingVariant = {
  id: string;
  name: string;
  price: number;
};

export type OffendingTier = {
  minQty: number;
  unitPrice: number;
};

export type PriceTierErrorInfo =
  /** 422 domain rejection — render as a form-level banner, keep the user's rows. */
  | { kind: "schedule-invalid"; message: string; offendingVariants: OffendingVariant[] }
  /** 422 on the variant update — the base price was lowered below a live tier. */
  | { kind: "variant-price-below-tier"; message: string; offendingTiers: OffendingTier[]; newPrice: number | null }
  /** 400 on the product-level copy when the product has no live variants. */
  | { kind: "no-variants"; message: string }
  /** 400 — surfaced distinctly, never as one of the domain reasons above. */
  | { kind: "validation-failed"; message: string }
  /** 404 — terminal, no retry affordance. */
  | { kind: "not-found"; message: string }
  | { kind: "unknown"; message: string };

export type PriceTierErrorContext = "variant" | "copy";

function formatQty(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString("id-ID", { maximumFractionDigits: 10 }) : "—";
}

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function parseOffendingVariants(value: unknown): OffendingVariant[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, any> => !!entry && typeof entry === "object")
    .map((entry) => ({
      id: typeof entry["id"] === "string" ? entry["id"] : "",
      name: typeof entry["name"] === "string" ? entry["name"] : "",
      price: typeof entry["price"] === "number" ? entry["price"] : 0,
    }));
}

function parseOffendingTiers(value: unknown): OffendingTier[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, any> => !!entry && typeof entry === "object")
    .map((entry) => ({
      minQty: typeof entry["min_qty"] === "number" ? entry["min_qty"] : 0,
      unitPrice: typeof entry["unit_price"] === "number" ? entry["unit_price"] : 0,
    }));
}

function messageForReason(reason: unknown, details: Record<string, any>, fallback: string): string {
  switch (reason) {
    case PriceTierScheduleReason.TOO_MANY_TIERS:
      return `Maksimal 10 tingkat harga, kamu mengirim ${formatQty(details["count"])}.`;
    case PriceTierScheduleReason.DUPLICATE_MIN_QTY:
      return `Jumlah minimum ${formatQty(details["min_qty"])} muncul lebih dari sekali.`;
    case PriceTierScheduleReason.UNIT_PRICE_EXCEEDS_BASE:
      return `Harga pada tingkat ${formatQty(details["min_qty"])} melebihi harga dasar varian.`;
    case PriceTierScheduleReason.PRICE_NOT_STRICTLY_DECREASING:
      return `Harga pada tingkat ${formatQty(details["min_qty"])} harus lebih murah dari tingkat sebelumnya.`;
    case PriceTierScheduleReason.VARIANT_PRICE_BELOW_TIER:
      return "Harga dasar sebagian varian lebih rendah dari harga grosir ini, jadi tidak ada varian yang diubah.";
    default:
      // An unrecognised reason must not be dressed up as one of the four known ones.
      return fallback;
  }
}

export function describePriceTierError(err: unknown, context: PriceTierErrorContext): PriceTierErrorInfo {
  if (!(err instanceof ServerError)) {
    return { kind: "unknown", message: "Terjadi gangguan jaringan. Silakan coba lagi." };
  }

  const details: Record<string, any> = err.details ?? {};

  if (err.code === ErrorCodes.PRICE_TIER_SCHEDULE_INVALID.code) {
    return {
      kind: "schedule-invalid",
      message: messageForReason(details["reason"], details, ErrorCodes.PRICE_TIER_SCHEDULE_INVALID.message),
      offendingVariants: parseOffendingVariants(details["offending_variants"]),
    };
  }

  if (err.code === ErrorCodes.VARIANT_PRICE_BELOW_TIER.code) {
    return {
      kind: "variant-price-below-tier",
      message: ErrorCodes.VARIANT_PRICE_BELOW_TIER.message,
      offendingTiers: parseOffendingTiers(details["offending_tiers"]),
      newPrice: typeof details["new_price"] === "number" ? details["new_price"] : null,
    };
  }

  if (err.code === ErrorCodes.NOT_FOUND.code || err.httpCode === 404) {
    return {
      kind: "not-found",
      message:
        context === "copy"
          ? "Produk sudah tidak ada. Muat ulang halaman."
          : "Varian sudah tidak ada. Muat ulang halaman.",
    };
  }

  if (err.code === ErrorCodes.VALIDATION_FAILED.code || err.httpCode === 400) {
    // On the product-level copy the only realistic 400 left, once the form has validated,
    // is a product with no live variants — say that instead of a generic rejection.
    if (context === "copy") {
      return { kind: "no-variants", message: "Produk ini belum punya varian untuk disalin." };
    }
    return { kind: "validation-failed", message: err.message ?? ErrorCodes.VALIDATION_FAILED.message };
  }

  return { kind: "unknown", message: err.message ?? "Terjadi kesalahan. Silakan coba lagi." };
}

/** Renders `offending_variants` as one line per variant, for AC-12. */
export function formatOffendingVariant(variant: OffendingVariant): string {
  return `${variant.name || "Varian tanpa nama"} — ${formatRupiah(variant.price)}`;
}

/** Renders `offending_tiers` as one line per tier, for AC-17. */
export function formatOffendingTier(tier: OffendingTier): string {
  return `Mulai ${formatQty(tier.minQty)} — ${formatRupiah(tier.unitPrice)}`;
}
