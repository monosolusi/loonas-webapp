"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { DangerButton } from "@/core/presentations/components/buttons/danger-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { ProductStatus } from "@/features/product/domain/enums/product-status";
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


  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState<string>(ProductStatus.ACTIVE);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [photos, setPhotos] = useState<File[]>([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<string[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [singlePrice, setSinglePrice] = useState(0);
  const [variants, setVariants] = useState<VariantFormRow[]>([
    { key: crypto.randomUUID(), name: "", sku: "", price: 0 },
  ]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hydratedVersion, setHydratedVersion] = useState<string | null>(null);

  const productVersion = product ? `${product.id}:${product.updatedAt}` : null;

  useEffect(() => {
    if (!product || productVersion === hydratedVersion) return;
    setName(product.name);
    setSku(product.sku);
    setStatus(product.status);
    setCategoryId(product.category?.id);
    setPhotos([]);
    setDeletedPhotoIds([]);

    if (product.hasVariants) {
      setHasVariants(true);
      setVariants(
        product.variants.map((v) => ({
          key: v.id,
          name: v.name,
          sku: v.sku ?? "",
          price: v.price,
        })),
      );
    } else {
      setHasVariants(false);
      setSinglePrice(product.variants[0]?.price ?? 0);
    }
    setHydratedVersion(productVersion);
  }, [product, productVersion, hydratedVersion]);

  const hasChanges = useMemo(() => {
    if (!product || !hydratedVersion) return false;
    if (name !== product.name) return true;
    if (sku !== product.sku) return true;
    if (status !== product.status) return true;
    if (categoryId !== product.category?.id) return true;
    if (photos.length > 0) return true;
    if (deletedPhotoIds.length > 0) return true;
    if (hasVariants !== product.hasVariants) return true;

    if (!hasVariants) {
      if (singlePrice !== (product.variants[0]?.price ?? 0)) return true;
    }

    if (hasVariants) {
      if (variants.length !== product.variants.length) return true;
      const originalMap = new Map(product.variants.map((pv) => [pv.id, pv]));
      for (const v of variants) {
        const original = originalMap.get(v.key);
        if (!original || isVariantChanged(v, original)) return true;
      }
    }

    return false;
  }, [product, name, sku, status, categoryId, photos, deletedPhotoIds, hasVariants, singlePrice, variants, hydratedVersion]);

  const refreshProduct = () => revalidateSWRKey(PRODUCT_SWR_KEYS.GET_PRODUCT, PRODUCT_SWR_KEYS.LIST_PRODUCTS);

  const handleSave = async () => {
    if (isUpdating || !product) return;
    try {
      await updateProduct({
        id,
        name: name.trim(),
        sku: sku.trim(),
        status,
        categoryId: categoryId ?? null,
      });

      // Sync photos and variants in parallel
      await Promise.all([
        // Photos: delete then upload
        (async () => {
          if (deletedPhotoIds.length > 0) {
            await Promise.all(deletedPhotoIds.map((photoId) => deletePhoto({ productId: id, photoId })));
            setDeletedPhotoIds([]);
          }
          if (photos.length > 0) {
            await Promise.all(photos.map((file) => uploadPhoto({ productId: id, file })));
            setPhotos([]);
          }
        })(),
        // Variants: delete → update → add
        (async () => {
          const currentVariants = hasVariants
            ? variants
            : [{ key: "default", name: DEFAULT_VARIANT_NAME, sku: "", price: singlePrice }];

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
            <ProductInfoCard name={name} sku={sku} onNameChange={setName} onSkuChange={setSku} />
            <ProductPhotoCard
              existingPhotos={productPhotosToExisting(product.photos).filter((p) => !deletedPhotoIds.includes(p.id))}
              newPhotos={photos}
              onNewPhotosChange={setPhotos}
              onDeleteExisting={handleDeletePhoto}
            />
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

      <LoonasDialog title="Hapus Produk" width="sm" open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <div className="mt-2 flex flex-col gap-y-4">
          <div className="rounded-lg border border-error-300/20 bg-error-300/5 px-4 py-3">
            <p className="text-sm text-error-300">
              Tindakan ini tidak dapat dibatalkan. Produk beserta semua data varian akan dihapus secara permanen.
            </p>
          </div>
          <p className="text-sm text-neutral-300">
            Apakah Anda yakin ingin menghapus produk <span className="font-semibold text-neutral-500">{product.name}</span> (SKU: {product.sku})?
          </p>
          <DialogFooter>
            <SecondaryButton outlined label="Batal" onClick={() => setDeleteDialogOpen(false)} />
            <DangerButton label="Hapus Produk" loading={isDeleting} onClick={handleDelete} className="w-auto px-6" />
          </DialogFooter>
        </div>
      </LoonasDialog>
    </div>
  );
}
