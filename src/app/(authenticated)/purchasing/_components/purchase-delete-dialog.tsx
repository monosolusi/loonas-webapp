"use client";

import { DateTime } from "luxon";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useDeletePurchase } from "@/features/purchasing/presentations/hooks/use-delete-purchase";
import { PURCHASE_SWR_KEYS } from "@/features/purchasing/presentations/constants/swr-keys";
import { usePurchaseList } from "@/app/(authenticated)/purchasing/_providers/purchase-list-provider";

export function PurchaseDeleteDialog() {
  const { deletingItem, setDeletingItem } = usePurchaseList();
  const { trigger: deletePurchase } = useDeletePurchase();
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deletePurchase({ id: deletingItem.id });
      await revalidateSWRKey(PURCHASE_SWR_KEYS.LIST_PURCHASES);
      showToast("Pembelian berhasil dihapus");
      setDeletingItem(null);
    } catch {
      showToast("Gagal menghapus pembelian", "error");
    }
  };

  return (
    <ConfirmationDialog
      open={!!deletingItem}
      onClose={() => setDeletingItem(null)}
      title="Hapus Pembelian"
      description={
        deletingItem ? (
          <>
            Apakah Anda yakin ingin menghapus pembelian tanggal{" "}
            <span className="font-semibold">
              {DateTime.fromISO(deletingItem.date).toFormat("dd MMM yyyy")}
            </span>
            ?
          </>
        ) : (
          ""
        )
      }
      warning="Stok yang sudah bertambah akan dikurangi kembali dan jurnal akan di-reverse."
      confirmLabel="Hapus"
      confirmVariant="danger"
      onConfirm={handleDelete}
    />
  );
}
