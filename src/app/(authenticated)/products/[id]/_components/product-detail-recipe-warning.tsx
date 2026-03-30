"use client";

import { ProductType } from "@/features/product/domain/enums/product-type";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailRecipeWarning() {
  const { product } = useProductDetail();

  if (!product) return null;
  if (product.type !== ProductType.MANUFACTURED) return null;
  if (product.metadata?.recipeComplete !== false) return null;

  const missingVariants = product.variants
    .filter((v) => v.metadata?.hasRecipe === false)
    .map((v) => v.name);

  return (
    <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-400">
      <span className="font-semibold">⚠ Produk ini belum dapat dijual.</span>{" "}
      {missingVariants.length > 0 ? (
        <>Beberapa varian belum memiliki resep: {missingVariants.join(", ")}. </>
      ) : (
        <>Belum ada varian yang memiliki resep. </>
      )}
      Tambahkan resep di bagian Resep / Bill of Materials di bawah.
    </div>
  );
}
