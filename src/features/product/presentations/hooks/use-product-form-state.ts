"use client";

import { useState } from "react";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";

function createEmptyVariantRow(): VariantFormRow {
  return { key: crypto.randomUUID(), name: "", sku: "", price: 0 };
}

export function useProductFormState() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [type, setType] = useState<string>(ProductType.TRADING);
  const [productionMode, setProductionMode] = useState<string | null>(null);
  const [active, setActive] = useState(true);
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
    setType(ProductType.TRADING);
    setProductionMode(null);
    setActive(true);
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
    type,
    setType,
    productionMode,
    setProductionMode,
    active,
    setActive,
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
