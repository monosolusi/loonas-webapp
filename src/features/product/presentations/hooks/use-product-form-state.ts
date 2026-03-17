"use client";

import { useState } from "react";
import { ProductStatus } from "@/features/product/domain/enums/product-status";
import { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";

function createEmptyVariantRow(): VariantFormRow {
  return { key: crypto.randomUUID(), name: "", sku: "", price: 0 };
}

export function useProductFormState() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState<string>(ProductStatus.ACTIVE);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [photos, setPhotos] = useState<File[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [singlePrice, setSinglePrice] = useState(0);
  const [variants, setVariants] = useState<VariantFormRow[]>([createEmptyVariantRow()]);

  const isValid = () => {
    if (!name.trim() || !sku.trim()) return false;
    if (hasVariants) {
      return variants.every((v) => v.name.trim() && v.price > 0);
    }
    return singlePrice > 0;
  };

  const resetForm = () => {
    setName("");
    setSku("");
    setStatus(ProductStatus.ACTIVE);
    setCategoryId(undefined);
    setPhotos([]);
    setHasVariants(false);
    setSinglePrice(0);
    setVariants([createEmptyVariantRow()]);
  };

  return {
    name,
    setName,
    sku,
    setSku,
    status,
    setStatus,
    categoryId,
    setCategoryId,
    photos,
    setPhotos,
    hasVariants,
    setHasVariants,
    singlePrice,
    setSinglePrice,
    variants,
    setVariants,
    isValid,
    resetForm,
  };
}
