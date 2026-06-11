"use client";

import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useDeletePurchase } from "@/features/purchasing/presentations/hooks/use-delete-purchase";
import { PURCHASE_SWR_KEYS } from "@/features/purchasing/presentations/constants/swr-keys";
import { usePurchaseDetail } from "@/app/(authenticated)/purchasing/[id]/_providers/purchase-detail-provider";

type PurchaseDetailDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function PurchaseDetailDeleteDialog({ open, onClose }: PurchaseDetailDeleteDialogProps) {
  const router = useRouter();
  const { purchase } = usePurchaseDetail();
  const { trigger: deletePurchase } = useDeletePurchase();
  const { showToast } = useToast();

  const handleDelete = async () => {
    try {
      await deletePurchase({ id: purchase.id });
      await revalidateSWRKey(PURCHASE_SWR_KEYS.LIST_PURCHASES);
      showToast("Pembelian berhasil dihapus");
      router.push("/purchasing");
    } catch {
      showToast("Gagal menghapus pembelian", "error");
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      title="Hapus Pembelian"
      description="Apakah Anda yakin ingin menghapus pembelian ini?"
      warning="Stok yang sudah bertambah akan dikurangi kembali dan jurnal akan di-reverse."
      confirmLabel="Hapus"
      confirmVariant="danger"
      onConfirm={handleDelete}
    />
  );
}
