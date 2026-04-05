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

        <div className="flex flex-row gap-x-6">
          <div className="flex min-w-0 flex-1 flex-col gap-y-6">
            <ProductCreateInfoCard />
            <ProductCreateVariantCard />
            <ProductCreateRecipeCard />
          </div>
          <div className="w-[280px] shrink-0">
            <div className="sticky top-8 flex flex-col gap-y-6">
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
