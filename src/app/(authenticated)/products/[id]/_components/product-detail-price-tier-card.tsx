"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { PriceTierVariantRow } from "@/app/(authenticated)/products/_components/price-tier-variant-row";
import { usePriceTier } from "@/app/(authenticated)/products/[id]/_providers/price-tier-provider";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailPriceTierCard() {
  const { product } = useProductDetail();
  const { hydratedVariants, canCopyToAll, expandedVariantId, setExpandedVariantId, openEditor, openCopy } =
    usePriceTier();

  // Nothing hydrated means this read path does not carry schedules at all — which says
  // nothing about whether these variants have tiers. Render nothing rather than an
  // empty state that would claim they have none.
  if (hydratedVariants.length === 0) return null;

  return (
    <SectionCard
      title="Harga Grosir"
      iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg"
      headerAction={
        canCopyToAll ? (
          <SecondaryButton outlined label="Salin ke Semua" onClick={openCopy} className="h-11 w-auto px-4" />
        ) : undefined
      }
    >
      <div className="flex flex-col rounded-lg border border-neutral-100">
        {hydratedVariants.map((variant, index) => (
          <PriceTierVariantRow
            key={variant.id}
            variantName={variant.name === DEFAULT_VARIANT_NAME ? (product?.name ?? variant.name) : variant.name}
            basePrice={variant.price}
            schedule={variant.priceTierSchedule!}
            expanded={expandedVariantId === variant.id}
            isLast={index === hydratedVariants.length - 1}
            onToggleExpand={() => setExpandedVariantId(expandedVariantId === variant.id ? null : variant.id)}
            onEdit={() =>
              openEditor({
                variantId: variant.id,
                variantName: variant.name === DEFAULT_VARIANT_NAME ? (product?.name ?? variant.name) : variant.name,
                basePrice: variant.price,
              })
            }
          />
        ))}
      </div>
    </SectionCard>
  );
}
