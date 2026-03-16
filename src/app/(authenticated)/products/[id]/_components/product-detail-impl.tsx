"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { DangerButton } from "@/core/presentations/components/buttons/danger-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { useGetProduct } from "@/features/product/presentations/hooks/use-get-product";
import { useUpdateProduct } from "@/features/product/presentations/hooks/use-update-product";
import { useDeleteProduct } from "@/features/product/presentations/hooks/use-delete-product";
import { ProductFormLayout } from "@/app/(authenticated)/products/_components/product-form-layout";
import { ProductInfoCard } from "@/app/(authenticated)/products/_components/product-info-card";
import { ProductPhotoCard } from "@/app/(authenticated)/products/_components/product-photo-card";
import { ProductVariantCard } from "@/app/(authenticated)/products/_components/product-variant-card";
import { ProductStatusCard } from "@/app/(authenticated)/products/_components/product-status-card";
import { ProductCategoryCard } from "@/app/(authenticated)/products/_components/product-category-card";
import { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";

type ProductDetailImplProps = {
  id: string;
};

export function ProductDetailImpl({ id }: ProductDetailImplProps) {
  const router = useRouter();
  const { product, loading } = useGetProduct(id);
  const { trigger: updateProduct, isMutating: isUpdating } = useUpdateProduct();
  const { trigger: deleteProduct, isMutating: isDeleting } = useDeleteProduct();
  const { mutate } = useSWRConfig();

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!product || initialized) return;
    setName(product.name);
    setSku(product.sku);
    setStatus(product.status);
    setCategoryId(product.category?.id);

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
    setInitialized(true);
  }, [product, initialized]);

  const hasChanges = useMemo(() => {
    if (!product || !initialized) return false;
    if (name !== product.name) return true;
    if (sku !== product.sku) return true;
    if (status !== product.status) return true;
    if (categoryId !== product.category?.id) return true;
    return false;
  }, [product, name, sku, status, categoryId, initialized]);

  const handleSave = async () => {
    if (isUpdating) return;
    try {
      await updateProduct({
        id,
        name: name.trim(),
        sku: sku.trim(),
        status,
        categoryId: categoryId ?? null,
      });
      await mutate((key: unknown) => Array.isArray(key) && key[0] === "get-product");
      await mutate((key: unknown) => Array.isArray(key) && key[0] === "list-products");
    } catch {
      // Error captured by SWR
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      await deleteProduct({ id });
      await mutate((key: unknown) => Array.isArray(key) && key[0] === "list-products");
      router.push("/products");
    } catch {
      // Error captured by SWR
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
            <ProductPhotoCard photos={photos} onPhotosChange={setPhotos} />
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
          <div className="-mx-4 flex flex-row justify-end gap-x-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:px-6">
            <SecondaryButton outlined label="Batal" onClick={() => setDeleteDialogOpen(false)} />
            <DangerButton label="Hapus Produk" loading={isDeleting} onClick={handleDelete} className="w-auto px-6" />
          </div>
        </div>
      </LoonasDialog>
    </div>
  );
}
