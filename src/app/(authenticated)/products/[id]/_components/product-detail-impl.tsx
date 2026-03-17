"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useGetProduct } from "@/features/product/presentations/hooks/use-get-product";
import { useUpdateProduct } from "@/features/product/presentations/hooks/use-update-product";
import { useDeleteProduct } from "@/features/product/presentations/hooks/use-delete-product";
import { useUploadProductPhoto } from "@/features/product/presentations/hooks/use-upload-product-photo";
import { useDeleteProductPhoto } from "@/features/product/presentations/hooks/use-delete-product-photo";
import { useAddVariant } from "@/features/product/presentations/hooks/use-add-variant";
import { useUpdateVariant } from "@/features/product/presentations/hooks/use-update-variant";
import { useDeleteVariant } from "@/features/product/presentations/hooks/use-delete-variant";
import { useProductFormState } from "@/features/product/presentations/hooks/use-product-form-state";
import { ProductFormLayout } from "@/app/(authenticated)/products/_components/product-form-layout";
import { ProductInfoCard } from "@/app/(authenticated)/products/_components/product-info-card";
import { ProductPhotoCard, productPhotosToExisting } from "@/app/(authenticated)/products/_components/product-photo-card";
import { ProductVariantCard } from "@/app/(authenticated)/products/_components/product-variant-card";
import { ProductStatusCard } from "@/app/(authenticated)/products/_components/product-status-card";
import { ProductCategoryCard } from "@/app/(authenticated)/products/_components/product-category-card";
import { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";
import { ProductVariantEntity } from "@/features/product/domain/entities/product-variant";

type ProductDetailImplProps = {
  id: string;
};

function isVariantChanged(local: VariantFormRow, original: ProductVariantEntity): boolean {
  return local.name !== original.name || local.sku !== (original.sku ?? "") || local.price !== original.price;
}

export function ProductDetailImpl({ id }: ProductDetailImplProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { product, loading } = useGetProduct(id);
  const { trigger: updateProduct, isMutating: isUpdating } = useUpdateProduct();
  const { trigger: deleteProduct, isMutating: isDeleting } = useDeleteProduct();
  const { trigger: uploadPhoto } = useUploadProductPhoto();
  const { trigger: deletePhoto } = useDeleteProductPhoto();
  const { trigger: addVariant } = useAddVariant();
  const { trigger: updateVariant } = useUpdateVariant();
  const { trigger: deleteVariant } = useDeleteVariant();


  const form = useProductFormState();
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hydratedVersion, setHydratedVersion] = useState<string | null>(null);

  const productVersion = product ? `${product.id}:${product.updatedAt}` : null;

  useEffect(() => {
    if (!product || productVersion === hydratedVersion) return;
    form.setName(product.name);
    form.setSku(product.sku);
    form.setStatus(product.status);
    form.setCategoryId(product.category?.id);
    form.setPhotos([]);
    setDeletedPhotoIds([]);

    if (product.hasVariants) {
      form.setHasVariants(true);
      form.setVariants(
        product.variants.map((v) => ({
          key: v.id,
          name: v.name,
          sku: v.sku ?? "",
          price: v.price,
        })),
      );
    } else {
      form.setHasVariants(false);
      form.setSinglePrice(product.variants[0]?.price ?? 0);
    }
    setHydratedVersion(productVersion);
  }, [product, productVersion, hydratedVersion]);

  const hasChanges = useMemo(() => {
    if (!product || !hydratedVersion) return false;
    if (form.name !== product.name) return true;
    if (form.sku !== product.sku) return true;
    if (form.status !== product.status) return true;
    if (form.categoryId !== product.category?.id) return true;
    if (form.photos.length > 0) return true;
    if (deletedPhotoIds.length > 0) return true;
    if (form.hasVariants !== product.hasVariants) return true;

    if (!form.hasVariants) {
      if (form.singlePrice !== (product.variants[0]?.price ?? 0)) return true;
    }

    if (form.hasVariants) {
      if (form.variants.length !== product.variants.length) return true;
      const originalMap = new Map(product.variants.map((pv) => [pv.id, pv]));
      for (const v of form.variants) {
        const original = originalMap.get(v.key);
        if (!original || isVariantChanged(v, original)) return true;
      }
    }

    return false;
  }, [product, form.name, form.sku, form.status, form.categoryId, form.photos, deletedPhotoIds, form.hasVariants, form.singlePrice, form.variants, hydratedVersion]);

  const refreshProduct = () => revalidateSWRKey(PRODUCT_SWR_KEYS.GET_PRODUCT, PRODUCT_SWR_KEYS.LIST_PRODUCTS);

  const handleSave = async () => {
    if (isUpdating || !product) return;
    try {
      await updateProduct({
        id,
        name: form.name.trim(),
        sku: form.sku.trim(),
        status: form.status,
        categoryId: form.categoryId ?? null,
      });

      // Sync photos and variants in parallel
      await Promise.all([
        // Photos: delete then upload
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
        // Variants: delete → update → add
        (async () => {
          const currentVariants = form.hasVariants
            ? form.variants
            : [{ key: "default", name: DEFAULT_VARIANT_NAME, sku: "", price: form.singlePrice }];

          const originalIds = new Set(product.variants.map((v) => v.id));
          const currentKeys = new Set(currentVariants.map((v) => v.key));

          await Promise.all(
            product.variants
              .filter((v) => !currentKeys.has(v.id))
              .map((v) => deleteVariant({ productId: id, variantId: v.id })),
          );

          await Promise.all(
            currentVariants
              .filter((v) => originalIds.has(v.key))
              .filter((v) => {
                const original = product.variants.find((pv) => pv.id === v.key);
                return original && isVariantChanged(v, original);
              })
              .map((v) =>
                updateVariant({
                  productId: id,
                  variantId: v.key,
                  name: v.name.trim(),
                  sku: v.sku.trim() || undefined,
                  price: v.price,
                }),
              ),
          );

          await Promise.all(
            currentVariants
              .filter((v) => !originalIds.has(v.key))
              .map((v) =>
                addVariant({
                  productId: id,
                  name: v.name.trim(),
                  sku: v.sku.trim() || undefined,
                  price: v.price,
                }),
              ),
          );
        })(),
      ]);

      await refreshProduct();
      showToast("Perubahan berhasil disimpan");
    } catch {
      showToast("Gagal menyimpan perubahan", "error");
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    setDeletedPhotoIds((prev) => [...prev, photoId]);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      await deleteProduct({ id });
      await revalidateSWRKey(PRODUCT_SWR_KEYS.LIST_PRODUCTS);
      showToast("Produk berhasil dihapus");
      router.push("/products");
    } catch {
      showToast("Gagal menghapus produk", "error");
    }
  };

  if (loading || !product) {
    return (
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-row items-center gap-x-4">
          <div className="size-9 animate-pulse rounded-lg bg-neutral-100" />
          <div className="flex flex-col gap-y-1">
            <div className="h-5 w-40 animate-pulse rounded bg-neutral-100" />
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
        <div className="flex flex-row gap-x-6">
          <div className="flex-1">
            <div className="h-64 animate-pulse rounded-lg bg-neutral-100" />
          </div>
          <div className="w-[280px]">
            <div className="h-40 animate-pulse rounded-lg bg-neutral-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader backHref="/products" title={product.name} subtitle={`SKU: ${product.sku}`} />

      <ProductFormLayout
        left={
          <>
            <ProductInfoCard name={form.name} sku={form.sku} onNameChange={form.setName} onSkuChange={form.setSku} />
            <ProductPhotoCard
              existingPhotos={productPhotosToExisting(product.photos).filter((p) => !deletedPhotoIds.includes(p.id))}
              newPhotos={form.photos}
              onNewPhotosChange={form.setPhotos}
              onDeleteExisting={handleDeletePhoto}
            />
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
              label="Simpan Perubahan"
              disabled={!hasChanges}
              loading={isUpdating}
              onClick={handleSave}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              className="self-center text-sm text-neutral-200 transition-colors hover:text-error-300"
            >
              Hapus produk ini
            </button>
          </>
        }
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Hapus Produk"
        warning="Tindakan ini tidak dapat dibatalkan. Produk beserta semua data varian akan dihapus secara permanen."
        description={
          <p>
            Apakah Anda yakin ingin menghapus produk <span className="font-semibold text-neutral-500">{product.name}</span> (SKU: {product.sku})?
          </p>
        }
        confirmLabel="Hapus Produk"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
