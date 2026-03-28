"use client";

import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductPhotoCard, productPhotosToExisting } from "@/app/(authenticated)/products/_components/product-photo-card";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailPhotoCard() {
  const { product, form, deletedPhotoIds, setDeletedPhotoIds } = useProductDetail();

  if (form.type === ProductType.SERVICE || !product) return null;

  return (
    <ProductPhotoCard
      existingPhotos={productPhotosToExisting(product.photos).filter((p) => !deletedPhotoIds.includes(p.id))}
      newPhotos={form.photos}
      onNewPhotosChange={form.setPhotos}
      onDeleteExisting={(photoId) => setDeletedPhotoIds((prev) => [...prev, photoId])}
    />
  );
}
