"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ProductType, ProductTypeLabel, ProductTypeType } from "@/features/product/domain/enums/product-type";
import { ProductionModeLabel, ProductionModeType } from "@/features/product/domain/enums/production-mode";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { ProductActiveToggle } from "@/app/(authenticated)/products/_components/product-active-toggle";
import { ProductStockCell } from "@/app/(authenticated)/products/_components/product-stock-cell";

export const PRODUCT_LIST_GRID_COLS = "grid-cols-[2fr_0.8fr_0.8fr_0.8fr_0.5fr_0.6fr_1fr]";

type ProductListRowProps = {
  product: ProductEntity;
  stockMap: Map<string, StockItemEntity>;
};

export function ProductListRow({ product, stockMap }: ProductListRowProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={clsx(
        "hover:border-l-primary-300 hover:bg-primary-50 grid cursor-pointer items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0 transition-opacity",
        PRODUCT_LIST_GRID_COLS,
        !product.active && "opacity-50",
      )}
    >
      <div className="flex flex-row items-center gap-x-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-50">
          {product.primaryPhoto?.publicUrl ? (
            <img src={product.primaryPhoto.publicUrl} alt="" className="size-8 rounded-md object-cover" />
          ) : (
            <Image src="/assets/images/box-icon-neutral-300-w16-h16.svg" alt="" width={14} height={14} />
          )}
        </div>
        <div className="flex flex-col">
          <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{product.name}</span>
          <span className="text-xs leading-4 text-neutral-200">{product.variants.length} varian</span>
        </div>
      </div>
      <span className="text-sm leading-5 text-neutral-400">{product.sku}</span>
      <div className="flex flex-col">
        <span className="text-sm leading-5 font-medium text-neutral-400">
          {ProductTypeLabel[product.type as ProductTypeType] ?? product.type}
        </span>
        {product.type === ProductType.MANUFACTURED && product.productionMode && (
          <span className="text-xs leading-4 text-neutral-200">
            {ProductionModeLabel[product.productionMode as ProductionModeType]}
          </span>
        )}
        {product.metadata?.recipeComplete === false && (
          <span className="text-xs leading-4 text-warning-300">Resep belum lengkap</span>
        )}
      </div>
      <span className="text-sm leading-5 text-neutral-400">{product.category?.name ?? "-"}</span>
      <ProductActiveToggle product={product} />
      <ProductStockCell product={product} stockMap={stockMap} />
      <span className="text-right text-sm leading-5 font-semibold text-neutral-500">{product.displayPrice}</span>
    </Link>
  );
}
