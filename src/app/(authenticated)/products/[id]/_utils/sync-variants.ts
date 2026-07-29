import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import type { ProductEntity } from "@/features/product/domain/entities/product";
import type { VariantEntity } from "@/features/product/domain/entities/variant";
import type { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";

function isVariantChanged(local: VariantFormRow, original: VariantEntity): boolean {
  return local.name !== original.name || local.sku !== (original.sku ?? "") || local.price !== original.price;
}

// LNS-570: sentinel key for a single-price product that has no server-side variant yet. Never
// exported and never leaves this module — collision with a real key is structurally impossible
// (every real key is a server UUID or a crypto.randomUUID()).
const NEW_SINGLE_VARIANT_KEY = "new-default-variant";

/**
 * Builds the synthetic row that stands in for the "Harga Jual" input when the form is in
 * single-price mode. When `existing` is non-null it MUST carry the real variant id — that id is
 * what the reconciliation below keys on, and it is what grosir tiers and the recipe hang off as
 * variant-scoped sub-resources. Seeding name and SKU from `existing` is required, not tidiness:
 * `isVariantChanged` compares `local.sku !== (original.sku ?? "")`, so a hardcoded `sku: ""` would
 * report a phantom diff on any variant with a SKU — firing a PUT on an untouched save, and sending
 * that PUT with `sku` omitted since the body sends `sku.trim() || undefined`.
 */
function singlePriceRow(existing: VariantEntity | null, singlePrice: number): VariantFormRow {
  if (!existing) {
    return { key: NEW_SINGLE_VARIANT_KEY, name: DEFAULT_VARIANT_NAME, sku: "", price: singlePrice };
  }
  return { key: existing.id, name: existing.name, sku: existing.sku ?? "", price: singlePrice };
}

type SyncVariantsParams = {
  product: ProductEntity;
  formHasVariants: boolean;
  variants: VariantFormRow[];
  singlePrice: number;
  addVariant: (params: { productId: string; name: string; sku?: string; price: number }) => Promise<unknown>;
  updateVariant: (params: {
    productId: string;
    variantId: string;
    name: string;
    sku?: string;
    price: number;
  }) => Promise<unknown>;
  deleteVariant: (params: { productId: string; variantId: string }) => Promise<unknown>;
};

export async function syncVariants({
  product,
  formHasVariants,
  variants,
  singlePrice,
  addVariant,
  updateVariant,
  deleteVariant,
}: SyncVariantsParams): Promise<void> {
  const currentVariants = formHasVariants ? variants : [singlePriceRow(product.defaultVariant, singlePrice)];

  const originalMap = new Map(product.variants.map((v) => [v.id, v]));
  const currentKeys = new Set(currentVariants.map((v) => v.key));

  const toDelete = product.variants.filter((v) => !currentKeys.has(v.id));
  const toUpdate = currentVariants.filter((v) => {
    const original = originalMap.get(v.key);
    return original && isVariantChanged(v, original);
  });
  const toAdd = currentVariants.filter((v) => !originalMap.has(v.key));

  // These writes fire concurrently, so the collapse path (multi -> single) can partially apply if
  // one write fails while its siblings succeed — out of scope here, identity is the subject of
  // this fix. The rejection must propagate so handleSave's catch can classify it (price-guard,
  // NOT_FOUND, or generic failure).
  await Promise.all([
    ...toDelete.map((v) => deleteVariant({ productId: product.id, variantId: v.id })),
    ...toUpdate.map((v) =>
      updateVariant({
        productId: product.id,
        variantId: v.key,
        name: v.name.trim(),
        sku: v.sku.trim() || undefined,
        price: v.price,
      }),
    ),
    ...toAdd.map((v) =>
      addVariant({
        productId: product.id,
        name: v.name.trim(),
        sku: v.sku.trim() || undefined,
        price: v.price,
      }),
    ),
  ]);
}

export { isVariantChanged };
