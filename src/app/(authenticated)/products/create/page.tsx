"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { ProductCreateProvider } from "@/app/(authenticated)/products/create/_providers/product-create-provider";
import { ProductCreateInfoCard } from "@/app/(authenticated)/products/create/_components/product-create-info-card";
import { ProductCreateVariantCard } from "@/app/(authenticated)/products/create/_components/product-create-variant-card";
import { ProductCreateRecipeCard } from "@/app/(authenticated)/products/create/_components/product-create-recipe-card";
import { ProductCreateStatusCard } from "@/app/(authenticated)/products/create/_components/product-create-status-card";
import { ProductCreateCategoryCard } from "@/app/(authenticated)/products/create/_components/product-create-category-card";
import { ProductCreateSaveButton } from "@/app/(authenticated)/products/create/_components/product-create-save-button";

export default function CreateProductPage() {
  return (
    <ProductCreateProvider>
      <div className="flex flex-col gap-y-6">
        <DetailPageHeader backHref="/products" title="Tambah Produk" />

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-x-6">
          <div className="flex min-w-0 flex-col gap-y-6 lg:flex-1">
            <ProductCreateInfoCard />
            <ProductCreateVariantCard />
            <ProductCreateRecipeCard />
          </div>
          <div className="lg:w-[280px] lg:shrink-0">
            <div className="flex flex-col gap-y-6 lg:sticky lg:top-8">
              <ProductCreateStatusCard />
              <ProductCreateCategoryCard />
              <ProductCreateSaveButton />
            </div>
          </div>
        </div>
      </div>
    </ProductCreateProvider>
  );
}
