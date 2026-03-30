"use client";

import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { FIXED_COST_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/swr-keys";
import { useDeleteFixedCost } from "@/features/fixed-cost/presentations/hooks/use-delete-fixed-cost";
import { useFixedCostMaster } from "@/app/(authenticated)/settings/fixed-costs/_providers/fixed-cost-master-provider";

export function FixedCostDeleteDialog() {
  const { showToast } = useToast();
  const { trigger, isMutating } = useDeleteFixedCost();
  const { deletingItem, setDeletingItem } = useFixedCostMaster();

  const handleDelete = async () => {
    if (!deletingItem || isMutating) return;
    try {
      await trigger({ id: deletingItem.id });
      await revalidateSWRKey(FIXED_COST_SWR_KEYS.LIST_FIXED_COSTS);
      showToast("Biaya tetap berhasil dihapus", "success");
      setDeletingItem(null);
    } catch {
      showToast("Gagal menghapus biaya tetap. Pastikan tidak ada entries yang terkait.", "error");
    }
  };

  return (
    <ConfirmationDialog
      open={!!deletingItem}
      onClose={() => setDeletingItem(null)}
      title="Hapus Biaya Tetap"
      warning="Biaya tetap yang masih memiliki entries tidak dapat dihapus."
      description={
        <p>
          Apakah Anda yakin ingin menghapus biaya tetap{" "}
          <span className="font-semibold text-neutral-500">{deletingItem?.name}</span>?
        </p>
      }
      confirmLabel="Hapus"
      loading={isMutating}
      onConfirm={handleDelete}
    />
  );
}
