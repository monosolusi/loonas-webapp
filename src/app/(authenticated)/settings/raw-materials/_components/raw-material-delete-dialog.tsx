"use client";

import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { RAW_MATERIAL_SWR_KEYS } from "@/features/raw-material/presentations/constants/swr-keys";
import { useDeleteRawMaterial } from "@/features/raw-material/presentations/hooks/use-delete-raw-material";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";

export function RawMaterialDeleteDialog() {
  const { showToast } = useToast();
  const { trigger, isMutating } = useDeleteRawMaterial();
  const { deletingItem, setDeletingItem } = useRawMaterialMaster();

  const handleDelete = async () => {
    if (!deletingItem || isMutating) return;
    try {
      await trigger({ id: deletingItem.id });
      await revalidateSWRKey(RAW_MATERIAL_SWR_KEYS.LIST_RAW_MATERIALS);
      showToast("Bahan baku berhasil dihapus", "success");
      setDeletingItem(null);
    } catch {
      showToast("Gagal menghapus bahan baku. Pastikan bahan baku tidak digunakan dalam resep.", "error");
    }
  };

  return (
    <ConfirmationDialog
      open={!!deletingItem}
      onClose={() => setDeletingItem(null)}
      title="Hapus Bahan Baku"
      warning="Bahan baku yang digunakan dalam resep produk tidak dapat dihapus."
      description={
        <p>
          Apakah Anda yakin ingin menghapus bahan baku{" "}
          <span className="font-semibold text-neutral-500">{deletingItem?.name}</span>?
        </p>
      }
      confirmLabel="Hapus"
      loading={isMutating}
      onConfirm={handleDelete}
    />
  );
}
