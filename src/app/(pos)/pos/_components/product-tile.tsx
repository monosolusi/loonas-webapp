"use client";

import clsx from "clsx";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { StockHint } from "@/app/(pos)/pos/_components/stock-hint";
import { UnavailableBadge } from "@/app/(pos)/pos/_components/unavailable-badge";
import { OutOfStockBadge } from "@/app/(pos)/pos/_components/out-of-stock-badge";

type ProductTileProps = {
  product: ProductForSaleEntity;
  qtyInCart: number;
  onClick: () => void;
};

/** A tappable catalog tile (mobile POS grid). Tap adds a single-variant product
 *  straight to the cart, or opens the variant drill-down for multi-variant ones. */
export function ProductTile({ product, qtyInCart, onClick }: ProductTileProps) {
  const photo = product.photos[0]?.publicUrl ?? null;
  const unavailable = product.variants.length > 0 && !product.hasAvailableVariant;
  const firstReason = product.variants[0]?.unavailableReason ?? null;
  const singleVariant = product.variants.length === 1 ? product.variants[0] : null;
  const { min } = product.priceRange;

  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={onClick}
      className={clsx(
        "relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-left transition-colors",
        unavailable ? "opacity-60" : "active:bg-primary-50",
      )}
    >
      <div className="relative aspect-square w-full bg-neutral-50">
        {photo ? (
          <img src={photo} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-3xl font-semibold text-neutral-200">
            {product.name.charAt(0).toUpperCase()}
          </div>
        )}
        {qtyInCart > 0 && (
          <span className="absolute top-2 right-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-300 px-1.5 text-xs font-semibold tabular-nums text-white">
            {qtyInCart}
          </span>
        )}
        {unavailable && firstReason && (
          <div className="absolute inset-x-2 bottom-2 flex justify-center">
            <UnavailableBadge reason={firstReason} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-y-1 p-2.5">
        <span className="line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-neutral-500">{product.name}</span>
        <div className="mt-auto flex flex-row items-end justify-between gap-x-1">
          <span className="text-sm font-semibold tabular-nums text-neutral-500">
            {product.hasMultipleVariants && <span className="text-xs font-normal text-neutral-300">mulai </span>}
            Rp <NumberDisplay value={min} />
          </span>
          {singleVariant ? (
            <div className="flex flex-row items-center gap-x-1.5">
              <OutOfStockBadge status={singleVariant.stockStatus} />
              <StockHint available={singleVariant.currentStock ?? singleVariant.maxMakeable} />
            </div>
          ) : product.hasMultipleVariants ? (
            <span className="shrink-0 text-xs whitespace-nowrap text-neutral-300">{product.variants.length} varian</span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
