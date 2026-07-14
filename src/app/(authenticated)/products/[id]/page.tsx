"use client";

import { use } from "react";
import { ProductDetailProvider, useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";
import { ProductDetailSkeleton } from "@/app/(authenticated)/products/[id]/_components/product-detail-skeleton";
import { ProductDetailHeader } from "@/app/(authenticated)/products/[id]/_components/product-detail-header";
import { ProductDetailInfoCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-info-card";
import { ProductDetailVariantCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-variant-card";
import { ProductDetailRecipeCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-recipe-card";
import { ProductDetailStatusCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-status-card";
import { ProductDetailCategoryCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-category-card";
import { ProductDetailSaveButton } from "@/app/(authenticated)/products/[id]/_components/product-detail-save-button";
import { ProductDetailDeleteButton } from "@/app/(authenticated)/products/[id]/_components/product-detail-delete-button";
import { ProductDetailRecipeWarning } from "@/app/(authenticated)/products/[id]/_components/product-detail-recipe-warning";
import { ProductDetailStockCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-stock-card";
import { ProductDetailMovementCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-movement-card";
import { ProductDetailProductionCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-production-card";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

function ProductDetailContent() {
  const { loading, product } = useProductDetail();

  if (loading || !product) return <ProductDetailSkeleton />;

  return (
    <div className="flex flex-col gap-y-6">
      <ProductDetailHeader />
      <ProductDetailRecipeWarning />
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-x-6">
        <div className="flex min-w-0 flex-col gap-y-6 lg:flex-1">
          <ProductDetailInfoCard />
          <ProductDetailVariantCard />
          <ProductDetailRecipeCard />
          <ProductDetailStockCard />
          <ProductDetailMovementCard />
          <ProductDetailProductionCard />
        </div>
        <div className="lg:w-[280px] lg:shrink-0">
          <div className="flex flex-col gap-y-6 lg:sticky lg:top-8">
            <ProductDetailStatusCard />
            <ProductDetailCategoryCard />
            <ProductDetailSaveButton />
            <ProductDetailDeleteButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage(props: ProductDetailPageProps) {
  const { id } = use(props.params);

  return (
    <ProductDetailProvider id={id}>
      <ProductDetailContent />
    </ProductDetailProvider>
  );
}
