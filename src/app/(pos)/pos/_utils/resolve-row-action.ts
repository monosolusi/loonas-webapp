import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";

/**
 * The single owner of "what should picking this catalog row do".
 *
 * Both entry points into the POS picker resolve through here — a keyboard/click activation of a
 * visible row, and a scanned code resolved by exact SKU. They previously carried independent
 * copies of the same three-branch rule, which is the drift surface CLAUDE.md's derived-invariant
 * guidance warns about: a later change (a success toast, a default quantity for weighed goods)
 * applied to one copy and not the other diverges silently. Keeping the rule here also puts it
 * inside the node-env test suite's reach, which a `.tsx` component would not be.
 *
 * `isAvailable` is the hard sellability gate — `stockStatus` / `isOutOfStock` is advisory display
 * only and deliberately plays no part in this decision.
 */

export type RowTarget =
  | { kind: "variant"; product: ProductForSaleEntity; variant: VariantForSaleEntity }
  | { kind: "product"; product: ProductForSaleEntity };

export type RowAction =
  | { action: "add"; product: ProductForSaleEntity; variant: VariantForSaleEntity }
  | { action: "drilldown"; product: ProductForSaleEntity }
  | { action: "noop" };

export function resolveRowAction(target: RowTarget): RowAction {
  if (target.kind === "variant") {
    if (!target.variant.isAvailable) return { action: "noop" };
    return { action: "add", product: target.product, variant: target.variant };
  }

  const product = target.product;
  if (!product.hasAvailableVariant) return { action: "noop" };
  // A multi-variant product can't be added outright — the cashier picks the variant first.
  if (product.hasMultipleVariants) return { action: "drilldown", product };
  return { action: "add", product, variant: product.variants[0] };
}
