import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { VariantEntity } from "@/features/product/domain/entities/variant";
import { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";

function isVariantChanged(local: VariantFormRow, original: VariantEntity): boolean {
  return local.name !== original.name || local.sku !== (original.sku ?? "") || local.price !== original.price;
}

type SyncVariantsParams = {
  productId: string;
  hasVariants: boolean;
  variants: VariantFormRow[];
  singlePrice: number;
  originalVariants: VariantEntity[];
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
  productId,
  hasVariants,
  variants,
  singlePrice,
  originalVariants,
  addVariant,
  updateVariant,
  deleteVariant,
}: SyncVariantsParams): Promise<void> {
  const currentVariants = hasVariants
    ? variants
    : [{ key: "default", name: DEFAULT_VARIANT_NAME, sku: "", price: singlePrice }];

  const originalMap = new Map(originalVariants.map((v) => [v.id, v]));
  const currentKeys = new Set(currentVariants.map((v) => v.key));

  const toDelete = originalVariants.filter((v) => !currentKeys.has(v.id));
  const toUpdate = currentVariants.filter((v) => {
    const original = originalMap.get(v.key);
    return original && isVariantChanged(v, original);
  });
  const toAdd = currentVariants.filter((v) => !originalMap.has(v.key));

  await Promise.all([
    ...toDelete.map((v) => deleteVariant({ productId, variantId: v.id })),
    ...toUpdate.map((v) =>
      updateVariant({
        productId,
        variantId: v.key,
        name: v.name.trim(),
        sku: v.sku.trim() || undefined,
        price: v.price,
      }),
    ),
    ...toAdd.map((v) =>
      addVariant({
        productId,
        name: v.name.trim(),
        sku: v.sku.trim() || undefined,
        price: v.price,
      }),
    ),
  ]);
}

export { isVariantChanged };
