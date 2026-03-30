"use client";

import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductPhotoCard } from "@/app/(authenticated)/products/_components/product-photo-card";
import { useProductCreate } from "@/app/(authenticated)/products/create/_providers/product-create-provider";

export function ProductCreatePhotoCard() {
  const { form } = useProductCreate();

  if (form.type === ProductType.SERVICE) return null;

  return <ProductPhotoCard newPhotos={form.photos} onNewPhotosChange={form.setPhotos} />;
}
