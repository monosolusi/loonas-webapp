"use client";

import { use } from "react";
import { ProductDetailProvider, useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";
import { ProductDetailSkeleton } from "@/app/(authenticated)/products/[id]/_components/product-detail-skeleton";
import { ProductDetailHeader } from "@/app/(authenticated)/products/[id]/_components/product-detail-header";
import { ProductDetailInfoCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-info-card";
import { ProductDetailPhotoCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-photo-card";
import { ProductDetailVariantCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-variant-card";
import { ProductDetailRecipeCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-recipe-card";
import { ProductDetailStatusCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-status-card";
import { ProductDetailCategoryCard } from "@/app/(authenticated)/products/[id]/_components/product-detail-category-card";
import { ProductDetailSaveButton } from "@/app/(authenticated)/products/[id]/_components/product-detail-save-button";
import { ProductDetailDeleteButton } from "@/app/(authenticated)/products/[id]/_components/product-detail-delete-button";
import { ProductDetailRecipeWarning } from "@/app/(authenticated)/products/[id]/_components/product-detail-recipe-warning";

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
      <div className="flex flex-row gap-x-6">
        <div className="flex min-w-0 flex-1 flex-col gap-y-6">
          <ProductDetailInfoCard />
          <ProductDetailPhotoCard />
          <ProductDetailVariantCard />
          <ProductDetailRecipeCard />
        </div>
        <div className="w-[280px] shrink-0">
          <div className="sticky top-8 flex flex-col gap-y-6">
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
