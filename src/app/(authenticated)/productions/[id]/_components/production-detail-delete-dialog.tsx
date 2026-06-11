"use client";

import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useDeleteProductionRecord } from "@/features/production/presentations/hooks/use-delete-production-record";
import { PRODUCTION_SWR_KEYS } from "@/features/production/presentations/constants/swr-keys";
import { useProductionDetail } from "@/app/(authenticated)/productions/[id]/_providers/production-detail-provider";

type ProductionDetailDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ProductionDetailDeleteDialog({ open, onClose }: ProductionDetailDeleteDialogProps) {
  const router = useRouter();
  const { record } = useProductionDetail();
  const { trigger: deleteRecord } = useDeleteProductionRecord();
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!record.variant.productId) return;
    try {
      await deleteRecord({
        productId: record.variant.productId,
        variantId: record.variant.id,
        id: record.id,
      });
      await revalidateSWRKey(PRODUCTION_SWR_KEYS.LIST_PRODUCTION_RECORDS);
      showToast("Catatan produksi berhasil dihapus");
      router.push("/productions");
    } catch {
      showToast("Gagal menghapus catatan produksi", "error");
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      title="Hapus Catatan Produksi"
      description="Apakah Anda yakin ingin menghapus catatan produksi ini?"
      warning="Stok bahan baku akan dikembalikan dan stok produk jadi akan dikurangi."
      confirmLabel="Hapus"
      confirmVariant="danger"
      onConfirm={handleDelete}
    />
  );
}
