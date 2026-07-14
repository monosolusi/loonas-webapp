"use client";

import { ServerError } from "@/core/resources/server-error";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useDeleteCoaMapping } from "@/features/accounting/presentations/hooks/use-delete-coa-mapping";
import { useCoaMappings } from "@/app/(authenticated)/chart-of-accounts/mappings/_providers/coa-mappings-provider";

export function CoaMappingDeleteDialog() {
  const { showToast } = useToast();
  const { deletingItem, setDeletingItem, entityTypes } = useCoaMappings();
  const { trigger, isMutating } = useDeleteCoaMapping();

  const entityTypeLabel =
    deletingItem && entityTypes.find((t) => t.type === deletingItem.entityType)?.label;

  const handleDelete = async () => {
    if (!deletingItem || isMutating) return;
    try {
      await trigger({ id: deletingItem.id });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_COA_MAPPINGS);
      showToast("Pemetaan berhasil dihapus", "success");
      setDeletingItem(null);
    } catch (err) {
      const message = err instanceof ServerError ? err.message : "Gagal menghapus pemetaan";
      showToast(message, "error");
    }
  };

  return (
    <ConfirmationDialog
      open={!!deletingItem}
      onClose={() => setDeletingItem(null)}
      title="Hapus Pemetaan Akun"
      description={
        <p>
          Apakah Anda yakin ingin menghapus pemetaan{" "}
          <span className="font-semibold text-neutral-500">{entityTypeLabel ?? deletingItem?.entityType}</span>? Aksi ini
          tidak bisa dibatalkan.
        </p>
      }
      confirmLabel="Hapus"
      loading={isMutating}
      onConfirm={handleDelete}
    />
  );
}
