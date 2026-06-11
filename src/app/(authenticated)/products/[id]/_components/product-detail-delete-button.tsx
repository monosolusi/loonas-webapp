"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useDeleteProduct } from "@/features/product/presentations/hooks/use-delete-product";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailDeleteButton() {
  const router = useRouter();
  const { showToast } = useToast();
  const { trigger, isMutating } = useDeleteProduct();
  const { id, product } = useProductDetail();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (isMutating) return;
    try {
      await trigger({ id });
      await revalidateSWRKey(PRODUCT_SWR_KEYS.LIST_PRODUCTS);
      showToast("Produk berhasil dihapus");
      router.push("/products");
    } catch {
      showToast("Gagal menghapus produk", "error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="self-center text-sm text-neutral-200 transition-colors hover:text-error-300"
      >
        Hapus produk ini
      </button>

      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Hapus Produk"
        warning="Tindakan ini tidak dapat dibatalkan. Produk beserta semua data varian akan dihapus secara permanen."
        description={
          <p>
            Apakah Anda yakin ingin menghapus produk{" "}
            <span className="font-semibold text-neutral-500">{product?.name}</span> (SKU: {product?.sku})?
          </p>
        }
        confirmLabel="Hapus Produk"
        loading={isMutating}
        onConfirm={handleDelete}
      />
    </>
  );
}
