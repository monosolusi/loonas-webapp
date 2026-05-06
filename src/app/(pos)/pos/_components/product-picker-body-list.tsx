"use client";

import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { ProductPickerRow } from "@/app/(pos)/pos/_components/product-picker-row";
import { ProductPickerVariantRow } from "@/app/(pos)/pos/_components/product-picker-variant-row";

export type PickerRow =
  | { kind: "variant"; variant: VariantForSaleEntity }
  | { kind: "product"; product: ProductForSaleEntity };

type ProductPickerBodyListProps = {
  rows: PickerRow[];
  highlight: number;
  onActivate: (idx: number) => void;
};

export function ProductPickerBodyList({ rows, highlight, onActivate }: ProductPickerBodyListProps) {
  return (
    <div className="flex flex-col">
      {rows.map((row, idx) => {
        if (row.kind === "variant") {
          return (
            <ProductPickerVariantRow
              key={row.variant.id}
              variant={row.variant}
              active={idx === highlight}
              onClick={() => onActivate(idx)}
            />
          );
        }
        return (
          <ProductPickerRow
            key={row.product.id}
            product={row.product}
            active={idx === highlight}
            onClick={() => onActivate(idx)}
          />
        );
      })}
    </div>
  );
}
