"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { useCreateProduct } from "@/features/product/presentations/hooks/use-create-product";
import { useUploadProductPhoto } from "@/features/product/presentations/hooks/use-upload-product-photo";
import { ProductFormLayout } from "@/app/(authenticated)/products/_components/product-form-layout";
import { ProductInfoCard } from "@/app/(authenticated)/products/_components/product-info-card";
import { ProductPhotoCard } from "@/app/(authenticated)/products/_components/product-photo-card";
import { ProductVariantCard } from "@/app/(authenticated)/products/_components/product-variant-card";
import { ProductStatusCard } from "@/app/(authenticated)/products/_components/product-status-card";
import { ProductCategoryCard } from "@/app/(authenticated)/products/_components/product-category-card";
import { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";

export function CreateProductForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const { trigger: createProduct, isMutating: isCreating } = useCreateProduct();
  const { trigger: uploadPhoto } = useUploadProductPhoto();

  const [isUploading, setIsUploading] = useState(false);
  const isMutating = isCreating || isUploading;

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState("active");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [photos, setPhotos] = useState<File[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [singlePrice, setSinglePrice] = useState(0);
  const [variants, setVariants] = useState<VariantFormRow[]>([
    { key: crypto.randomUUID(), name: "", sku: "", price: 0 },
  ]);

  const isValid = () => {
    if (!name.trim() || !sku.trim()) return false;
    if (hasVariants) {
      return variants.every((v) => v.name.trim() && v.price > 0);
    }
    return singlePrice > 0;
  };

  const handleSubmit = async () => {
    if (!isValid() || isMutating) return;

    const variantParams = hasVariants
      ? variants.map((v) => ({
          name: v.name.trim(),
          sku: v.sku.trim() || undefined,
          price: v.price,
        }))
      : [{ name: "Default", price: singlePrice }];

    try {
      const product = await createProduct({
        name: name.trim(),
        sku: sku.trim(),
        status,
        categoryId,
        variants: variantParams,
      });

      if (photos.length > 0) {
        setIsUploading(true);
        for (const file of photos) {
          await uploadPhoto({ productId: product.id, file });
        }
        setIsUploading(false);
      }

      await revalidateSWRKey("list-products");
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
            <ProductInfoCard name={name} sku={sku} onNameChange={setName} onSkuChange={setSku} />
            <ProductPhotoCard newPhotos={photos} onNewPhotosChange={setPhotos} />
            <ProductVariantCard
              hasVariants={hasVariants}
              singlePrice={singlePrice}
              variants={variants}
              onHasVariantsChange={setHasVariants}
              onSinglePriceChange={setSinglePrice}
              onVariantsChange={setVariants}
            />
          </>
        }
        right={
          <>
            <ProductStatusCard status={status} onStatusChange={setStatus} />
            <ProductCategoryCard categoryId={categoryId} onCategoryChange={setCategoryId} />
            <PrimaryButton
              label="Simpan Produk"
              disabled={!isValid()}
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
