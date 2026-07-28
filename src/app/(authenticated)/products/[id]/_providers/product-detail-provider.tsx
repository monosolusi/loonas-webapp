"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
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
import {
  parseVariantPriceBelowTier,
  VariantPriceBelowTierRejection,
} from "@/features/product/presentations/helpers/price-tier-error";
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
  priceGuardRejection: VariantPriceBelowTierRejection | null;
  dismissPriceGuard: () => void;
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
  const [priceGuardRejection, setPriceGuardRejection] = useState<VariantPriceBelowTierRejection | null>(null);

  // Hydration
  const productVersion = product ? `${product.id}:${product.updatedAt}` : null;

  useEffect(() => {
    if (!product || productVersion === hydratedVersion) return;
    form.setName(product.name);
    form.setSku(product.sku);
    form.setType(product.type);
    form.setProductionMode(product.productionMode);
    form.setActive(product.metadata?.userActive ?? product.active);
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
    if (form.active !== (product.metadata?.userActive ?? product.active)) return true;
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
  }, [product, form.name, form.sku, form.type, form.productionMode, form.active, form.categoryId, form.photos, deletedPhotoIds, form.hasVariants, form.singlePrice, form.variants, hydratedVersion]);

  // Save orchestration
  const handleSave = async () => {
    if (isUpdating || !product) return;
    try {
      const updateParams: { id: string } & UpdateProductParams = {
        id,
        name: form.name.trim(),
        sku: form.sku.trim(),
        active: form.active,
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
    } catch (err) {
      // LNS-564: the base price was lowered below a tier this variant already has. Show
      // every offending tier, then re-hydrate so the on-screen price reverts to server
      // truth — the rejected value must not linger in the form as if it had been saved.
      const priceRejection = parseVariantPriceBelowTier(err);
      if (priceRejection) {
        setPriceGuardRejection(priceRejection);
        setHydratedVersion(null);
        try {
          await revalidateSWRKey(PRODUCT_SWR_KEYS.GET_PRODUCT, PRODUCT_SWR_KEYS.LIST_PRODUCTS);
        } catch {
          // The dialog already carries the explanation.
        }
        return;
      }

      const isNotFound = err instanceof ServerError && (err.code === ErrorCodes.NOT_FOUND.code || err.httpCode === 404);

      if (!isNotFound) {
        showToast("Gagal menyimpan perubahan", "error");
        return;
      }

      // LNS-489: a product or variant vanished mid-save. The backend deliberately does not
      // say which case it is — tell the user first, then refetch so server state is the answer.
      setHydratedVersion(null);
      showToast("Produk atau varian sudah tidak ada. Data dimuat ulang.", "error");

      // Best-effort: if the product itself is gone this revalidation 404s too (revalidateSWRKey
      // triggers a refetch, not a cache write, and rethrows on a failed fetch). It must never be
      // able to swallow the toast or the re-hydration reset above.
      try {
        await revalidateSWRKey(PRODUCT_SWR_KEYS.GET_PRODUCT, PRODUCT_SWR_KEYS.LIST_PRODUCTS);
      } catch {
        // Nothing to recover to — the user has already been told.
      }
    }
  };

  return (
    <ProductDetailContext.Provider
      value={{
        id,
        product,
        loading,
        form,
        hasChanges,
        isUpdating,
        deletedPhotoIds,
        setDeletedPhotoIds,
        handleSave,
        priceGuardRejection,
        dismissPriceGuard: () => setPriceGuardRejection(null),
      }}
    >
      {children}
    </ProductDetailContext.Provider>
  );
}
