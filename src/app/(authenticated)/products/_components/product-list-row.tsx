"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ProductType, ProductTypeLabel, ProductTypeType } from "@/features/product/domain/enums/product-type";
import { ProductionMode, ProductionModeLabel, ProductionModeType } from "@/features/product/domain/enums/production-mode";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { ProductActiveToggle } from "@/app/(authenticated)/products/_components/product-active-toggle";
import { ProductStockCell } from "@/app/(authenticated)/products/_components/product-stock-cell";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";

type ProductListRowProps = {
  product: ProductEntity;
  stockMap: Map<string, StockItemEntity>;
};

export function ProductListRow({ product, stockMap }: ProductListRowProps) {
  const stock = useMemo(() => {
    if (product.type === ProductType.SERVICE) return null;
    if (product.type === ProductType.MANUFACTURED && product.productionMode === ProductionMode.ON_DEMAND) return null;

    let totalStock = 0;
    let isLowStock = false;

    for (const variant of product.variants) {
      const stockItem = stockMap.get(variant.id);
      if (stockItem) {
        totalStock += stockItem.currentStock;
        if (stockItem.isLowStock) isLowStock = true;
      }
    }

    return { totalStock, isLowStock };
  }, [product, stockMap]);

  const typeLabel = ProductTypeLabel[product.type as ProductTypeType] ?? product.type;
  const recipeIncomplete = product.metadata?.recipeComplete === false;

  return (
    <>
      {/* Desktop: grid row (lg and up) */}
      <Link
        href={`/products/${product.id}`}
        className={clsx(
          "hover:border-l-primary-300 hover:bg-primary-50 hidden cursor-pointer grid-cols-[2fr_1fr_0.7fr_0.6fr_0.8fr_0.8fr] items-center gap-x-4 border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0 transition-opacity lg:grid",
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
            <div className="flex flex-row items-center gap-x-1.5">
              {stock?.isLowStock && <span className="size-2 shrink-0 rounded-full bg-warning-300" />}
              <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{product.name}</span>
            </div>
            <span className="text-xs leading-4 text-neutral-200">
              {product.sku} · {product.variants.length} varian
            </span>
          </div>
        </div>
        <span className="text-right text-sm leading-5 font-semibold text-neutral-500">{product.displayPrice}</span>
        <ProductStockCell totalStock={stock?.totalStock ?? null} />
        <span className="text-sm leading-5 text-neutral-400">{product.category?.name ?? "-"}</span>
        <div className="flex flex-col">
          <span className="text-sm leading-5 font-medium text-neutral-400">{typeLabel}</span>
          {product.type === ProductType.MANUFACTURED && product.productionMode && (
            <span className="text-xs leading-4 text-neutral-200">
              {ProductionModeLabel[product.productionMode as ProductionModeType]}
            </span>
          )}
          {recipeIncomplete && <span className="text-xs leading-4 text-warning-300">Resep belum lengkap</span>}
        </div>
        <ProductActiveToggle product={product} />
      </Link>

      {/* Mobile: stacked card (below lg) */}
      <div className={clsx("lg:hidden", !product.active && "opacity-50")}>
        <MobileListCard
          href={`/products/${product.id}`}
          title={
            <span className="inline-flex items-center gap-x-1.5">
              {stock?.isLowStock && <span className="size-2 shrink-0 rounded-full bg-warning-300" />}
              {product.name}
            </span>
          }
          subtitle={`${product.sku} · ${product.variants.length} varian`}
          meta={
            <>
              {product.category?.name ?? "-"} · {typeLabel}
              {recipeIncomplete && " · Resep belum lengkap"}
            </>
          }
          trailingTop={product.displayPrice}
          trailingBottom={<ProductActiveToggle product={product} />}
        />
      </div>
    </>
  );
}
