"use client";

import { useMemo } from "react";
import { PickerRow } from "@/app/(pos)/pos/_components/product-picker-body-list";
import { ProductTile } from "@/app/(pos)/pos/_components/product-tile";
import { ProductVariantTile } from "@/app/(pos)/pos/_components/product-variant-tile";
import { usePosCart } from "@/app/(pos)/pos/_providers/pos-provider";

type ProductPickerGridProps = {
  rows: PickerRow[];
  onActivate: (idx: number) => void;
};

/** Mobile catalog: a tappable grid of product/variant tiles. Reuses the picker's
 *  `rows` + `activate` logic; only the presentation differs from the desktop list. */
export function ProductPickerGrid({ rows, onActivate }: ProductPickerGridProps) {
  const { items } = usePosCart();

  const { productQty, variantQty } = useMemo(() => {
    const productQty = new Map<string, number>();
    const variantQty = new Map<string, number>();
    for (const item of items) {
      productQty.set(item.productId, (productQty.get(item.productId) ?? 0) + item.qty);
      variantQty.set(item.variantId, (variantQty.get(item.variantId) ?? 0) + item.qty);
    }
    return { productQty, variantQty };
  }, [items]);

  return (
    <div className="grid grid-cols-2 gap-3 p-4 pb-[calc(8rem+env(safe-area-inset-bottom))] sm:grid-cols-3">
      {rows.map((row, idx) =>
        row.kind === "variant" ? (
          <ProductVariantTile
            key={row.variant.id}
            variant={row.variant}
            qtyInCart={variantQty.get(row.variant.id) ?? 0}
            onClick={() => onActivate(idx)}
          />
        ) : (
          <ProductTile
            key={row.product.id}
            product={row.product}
            qtyInCart={productQty.get(row.product.id) ?? 0}
            onClick={() => onActivate(idx)}
          />
        ),
      )}
    </div>
  );
}
