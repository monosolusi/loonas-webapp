"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useCreateProduct } from "@/features/product/presentations/hooks/use-create-product";
import { useUploadProductPhoto } from "@/features/product/presentations/hooks/use-upload-product-photo";
import { useProductFormState } from "@/features/product/presentations/hooks/use-product-form-state";
import { ProductFormLayout } from "@/app/(authenticated)/products/_components/product-form-layout";
import { ProductInfoCard } from "@/app/(authenticated)/products/_components/product-info-card";
import { ProductPhotoCard } from "@/app/(authenticated)/products/_components/product-photo-card";
import { ProductVariantCard } from "@/app/(authenticated)/products/_components/product-variant-card";
import { ProductStatusCard } from "@/app/(authenticated)/products/_components/product-status-card";
import { ProductCategoryCard } from "@/app/(authenticated)/products/_components/product-category-card";

export function CreateProductForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const { trigger: createProduct, isMutating: isCreating } = useCreateProduct();
  const { trigger: uploadPhoto } = useUploadProductPhoto();
  const form = useProductFormState();

  const [isUploading, setIsUploading] = useState(false);
  const isMutating = isCreating || isUploading;

  const handleSubmit = async () => {
    if (!form.isValid() || isMutating) return;

    const variantParams = form.hasVariants
      ? form.variants.map((v) => ({
          name: v.name.trim(),
          sku: v.sku.trim() || undefined,
          price: v.price,
        }))
      : [{ name: DEFAULT_VARIANT_NAME, price: form.singlePrice }];

    try {
      const product = await createProduct({
        name: form.name.trim(),
        sku: form.sku.trim(),
        status: form.status,
        categoryId: form.categoryId,
        variants: variantParams,
      });

      if (form.photos.length > 0) {
        setIsUploading(true);
        for (const file of form.photos) {
          await uploadPhoto({ productId: product.id, file });
        }
        setIsUploading(false);
      }

      await revalidateSWRKey(PRODUCT_SWR_KEYS.LIST_PRODUCTS);
      showToast("Produk berhasil ditambahkan");
      router.push(`/products/${product.id}`);
    } catch {
      setIsUploading(false);
      showToast("Gagal menambahkan produk", "error");
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader backHref="/products" title="Tambah Produk" />

      <ProductFormLayout
        left={
          <>
            <ProductInfoCard name={form.name} sku={form.sku} onNameChange={form.setName} onSkuChange={form.setSku} />
            <ProductPhotoCard newPhotos={form.photos} onNewPhotosChange={form.setPhotos} />
            <ProductVariantCard
              hasVariants={form.hasVariants}
              singlePrice={form.singlePrice}
              variants={form.variants}
              onHasVariantsChange={form.setHasVariants}
              onSinglePriceChange={form.setSinglePrice}
              onVariantsChange={form.setVariants}
            />
          </>
        }
        right={
          <>
            <ProductStatusCard status={form.status} onStatusChange={form.setStatus} />
            <ProductCategoryCard categoryId={form.categoryId} onCategoryChange={form.setCategoryId} />
            <PrimaryButton
              label="Simpan Produk"
              disabled={!form.isValid()}
              loading={isMutating}
              onClick={handleSubmit}
              className="w-full"
            />
          </>
        }
      />
    </div>
  );
}
