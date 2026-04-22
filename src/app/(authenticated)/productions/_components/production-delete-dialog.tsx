"use client";

import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useDeleteProductionRecord } from "@/features/production/presentations/hooks/use-delete-production-record";
import { PRODUCTION_SWR_KEYS } from "@/features/production/presentations/constants/swr-keys";
import { useProductionList } from "@/app/(authenticated)/productions/_providers/production-list-provider";

export function ProductionDeleteDialog() {
  const { deletingItem, setDeletingItem } = useProductionList();
  const { trigger: deleteRecord } = useDeleteProductionRecord();
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!deletingItem || !deletingItem.variant.productId) return;
    try {
      await deleteRecord({
        productId: deletingItem.variant.productId,
        variantId: deletingItem.variant.id,
        id: deletingItem.id,
      });
      await revalidateSWRKey(PRODUCTION_SWR_KEYS.LIST_PRODUCTION_RECORDS);
      showToast("Catatan produksi berhasil dihapus");
      setDeletingItem(null);
    } catch {
      showToast("Gagal menghapus catatan produksi", "error");
    }
  };

  return (
    <ConfirmationDialog
      open={!!deletingItem}
      onClose={() => setDeletingItem(null)}
      title="Hapus Catatan Produksi"
      description={
        deletingItem ? (
          <>
            Apakah Anda yakin ingin menghapus catatan produksi{" "}
            <span className="font-semibold">{deletingItem.productName}</span> ({deletingItem.quantity} unit)?
          </>
        ) : (
          ""
        )
      }
      warning="Stok bahan baku akan dikembalikan dan stok produk jadi akan dikurangi."
      confirmLabel="Hapus"
      confirmVariant="danger"
      onConfirm={handleDelete}
    />
  );
}
