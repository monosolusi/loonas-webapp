"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { UpdateProductParams } from "@/features/product/domain/repositories/product";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useGetProduct } from "@/features/product/presentations/hooks/use-get-product";
import { useUpdateProduct } from "@/features/product/presentations/hooks/use-update-product";
import { useUploadProductPhoto } from "@/features/product/presentations/hooks/use-upload-product-photo";
import { useDeleteProductPhoto } from "@/features/product/presentations/hooks/use-delete-product-photo";
import { useAddVariant } from "@/features/product/presentations/hooks/use-add-variant";
import { useUpdateVariant } from "@/features/product/presentations/hooks/use-update-variant";
import { useDeleteVariant } from "@/features/product/presentations/hooks/use-delete-variant";
import { useProductFormState } from "@/features/product/presentations/hooks/use-product-form-state";
import { syncVariants, isVariantChanged } from "@/app/(authenticated)/products/[id]/_utils/sync-variants";

type ProductDetailContextValue = {
  id: string;
  product: ProductEntity | null;
  loading: boolean;
  form: ReturnType<typeof useProductFormState>;
  hasChanges: boolean;
  isUpdating: boolean;
  deletedPhotoIds: string[];
  setDeletedPhotoIds: React.Dispatch<React.SetStateAction<string[]>>;
  handleSave: () => Promise<void>;
};

const ProductDetailContext = createContext<ProductDetailContextValue | null>(null);

export function useProductDetail() {
  const context = useContext(ProductDetailContext);
  if (!context) throw new Error("useProductDetail must be used within ProductDetailProvider");
  return context;
}

type ProductDetailProviderProps = {
  id: string;
  children: React.ReactNode;
};

export function ProductDetailProvider({ id, children }: ProductDetailProviderProps) {
  const { showToast } = useToast();

  // Data
  const { product, loading } = useGetProduct(id);
  const { trigger: updateProduct, isMutating: isUpdating } = useUpdateProduct();
  const { trigger: uploadPhoto } = useUploadProductPhoto();
  const { trigger: deletePhoto } = useDeleteProductPhoto();
  const { trigger: addVariant } = useAddVariant();
  const { trigger: updateVariant } = useUpdateVariant();
  const { trigger: deleteVariant } = useDeleteVariant();

  // Form state
  const form = useProductFormState();
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<string[]>([]);
  const [hydratedVersion, setHydratedVersion] = useState<string | null>(null);

  // Hydration
  const productVersion = product ? `${product.id}:${product.updatedAt}` : null;

  useEffect(() => {
    if (!product || productVersion === hydratedVersion) return;
    form.setName(product.name);
    form.setSku(product.sku);
    form.setType(product.type);
    form.setProductionMode(product.productionMode);
    form.setStatus(product.status);
    form.setCategoryId(product.category?.id);
    form.setPhotos([]);
    setDeletedPhotoIds([]);

    if (product.hasVariants) {
      form.setHasVariants(true);
      form.setVariants(
        product.variants.map((v) => ({ key: v.id, name: v.name, sku: v.sku ?? "", price: v.price })),
      );
    } else {
      form.setHasVariants(false);
      form.setSinglePrice(product.variants[0]?.price ?? 0);
    }
    setHydratedVersion(productVersion);
  }, [product, productVersion, hydratedVersion]);

  // Dirty tracking
  const hasChanges = useMemo(() => {
    if (!product || !hydratedVersion) return false;
    if (form.name !== product.name) return true;
    if (form.sku !== product.sku) return true;
    if (form.type !== product.type) return true;
    if (form.productionMode !== product.productionMode) return true;
    if (form.status !== product.status) return true;
    if (form.categoryId !== product.category?.id) return true;
    if (form.photos.length > 0) return true;
    if (deletedPhotoIds.length > 0) return true;
    if (form.hasVariants !== product.hasVariants) return true;
    if (!form.hasVariants && form.singlePrice !== (product.variants[0]?.price ?? 0)) return true;
    if (form.hasVariants) {
      if (form.variants.length !== product.variants.length) return true;
      const originalMap = new Map(product.variants.map((pv) => [pv.id, pv]));
      for (const v of form.variants) {
        const original = originalMap.get(v.key);
        if (!original || isVariantChanged(v, original)) return true;
      }
    }
    return false;
  }, [product, form.name, form.sku, form.type, form.productionMode, form.status, form.categoryId, form.photos, deletedPhotoIds, form.hasVariants, form.singlePrice, form.variants, hydratedVersion]);

  // Save orchestration
  const handleSave = async () => {
    if (isUpdating || !product) return;
    try {
      const updateParams: { id: string } & UpdateProductParams = {
        id,
        name: form.name.trim(),
        sku: form.sku.trim(),
        status: form.status,
        categoryId: form.categoryId ?? null,
      };

      const typeChanged = form.type !== product.type || form.productionMode !== product.productionMode;
      if (typeChanged) {
        updateParams.type = form.type;
        updateParams.productionMode = form.productionMode;
      }

      await updateProduct(updateParams);

      await Promise.all([
        (async () => {
          if (deletedPhotoIds.length > 0) {
            await Promise.all(deletedPhotoIds.map((photoId) => deletePhoto({ productId: id, photoId })));
            setDeletedPhotoIds([]);
          }
          if (form.photos.length > 0) {
            await Promise.all(form.photos.map((file) => uploadPhoto({ productId: id, file })));
            form.setPhotos([]);
          }
        })(),
        syncVariants({
          productId: id,
          hasVariants: form.hasVariants,
          variants: form.variants,
          singlePrice: form.singlePrice,
          originalVariants: product.variants,
          addVariant,
          updateVariant,
          deleteVariant,
        }),
      ]);

      await revalidateSWRKey(PRODUCT_SWR_KEYS.GET_PRODUCT, PRODUCT_SWR_KEYS.LIST_PRODUCTS);
      showToast("Perubahan berhasil disimpan");
    } catch {
      showToast("Gagal menyimpan perubahan", "error");
    }
  };

  return (
    <ProductDetailContext.Provider
      value={{ id, product, loading, form, hasChanges, isUpdating, deletedPhotoIds, setDeletedPhotoIds, handleSave }}
    >
      {children}
    </ProductDetailContext.Provider>
  );
}
