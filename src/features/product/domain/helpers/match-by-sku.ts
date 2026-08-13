import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";

/**
 * Resolves a scanned/typed code against a set of catalog products by EXACT SKU — never
 * substring. A substring match is exactly how the wrong item gets added when a scanner code
 * happens to be a prefix of another SKU (e.g. `ABC-1` must not match `ABC-12`).
 *
 * The caller (POS picker) maps this to an action; this module knows nothing about carts,
 * drilldown, or availability gating — it only answers "which product/variant carries this SKU".
 */
export type SkuMatch =
  | { kind: "variant"; product: ProductForSaleEntity; variant: VariantForSaleEntity }
  | { kind: "product"; product: ProductForSaleEntity }
  | { kind: "ambiguous"; products: ProductForSaleEntity[] }
  | { kind: "none" };

function normalize(code: string): string {
  return code.trim().toLowerCase();
}

function uniqueById(products: ProductForSaleEntity[]): ProductForSaleEntity[] {
  const seen = new Set<string>();
  const result: ProductForSaleEntity[] = [];
  for (const product of products) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    result.push(product);
  }
  return result;
}

/**
 * Exact, case-insensitive, whitespace-trimmed match on SKU.
 *
 * Variant-SKU matches take precedence over product-SKU matches. Any code matched by more than
 * one candidate is `ambiguous` — whether that's two products, or two variants of a single
 * product — and the caller must not silently pick one. An empty/blank code is `none`.
 */
export function matchBySku(products: ProductForSaleEntity[], code: string): SkuMatch {
  const normalized = normalize(code);
  if (!normalized) return { kind: "none" };

  const variantMatches: { product: ProductForSaleEntity; variant: VariantForSaleEntity }[] = [];
  for (const product of products) {
    for (const variant of product.variants) {
      if (variant.sku !== null && normalize(variant.sku) === normalized) {
        variantMatches.push({ product, variant });
      }
    }
  }

  // More than one variant carrying this code is ambiguous even when they belong to the SAME
  // product — nothing verifies that SKUs are unique within a product, and silently taking the
  // first match would add an arbitrary size/colour to the cart with no signal to the cashier.
  if (variantMatches.length > 1) {
    return { kind: "ambiguous", products: uniqueById(variantMatches.map((match) => match.product)) };
  }
  if (variantMatches.length === 1) {
    return { kind: "variant", product: variantMatches[0].product, variant: variantMatches[0].variant };
  }

  const productMatches = products.filter((product) => normalize(product.sku) === normalized);
  if (productMatches.length > 1) return { kind: "ambiguous", products: productMatches };
  if (productMatches.length === 1) return { kind: "product", product: productMatches[0] };

  return { kind: "none" };
}
