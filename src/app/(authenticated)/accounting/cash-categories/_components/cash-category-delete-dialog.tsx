"use client";

import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useLatchedValue } from "@/core/presentations/hooks/use-latched-value";
import { useCashCategoriesProvider } from "@/app/(authenticated)/accounting/cash-categories/_providers/cash-categories-provider";

export function CashCategoryDeleteDialog() {
  const { deletingCategory, closeDelete, submitDelete, isDeleting, deleteError } = useCashCategoriesProvider();

  // `ConfirmationDialog` wraps `LoonasDialog`, whose panel stays mounted through the 200ms
  // `data-leave` fade while the provider has already nulled `deletingCategory` — latch it so the
  // bolded name doesn't blank into "menghapus kategori ?" mid-fade.
  const category = useLatchedValue(deletingCategory);

  return (
    <ConfirmationDialog
      open={!!deletingCategory}
      onClose={closeDelete}
      title="Hapus Kategori Kas"
      // Referenced-ness is server-authoritative (no `is_referenced` on the list resource), so the
      // 409 copy lands here reactively and the dialog stays open.
      warning={deleteError?.message}
      description={
        <p>
          Apakah Anda yakin ingin menghapus kategori{" "}
          <span className="font-semibold text-neutral-500">{category?.name}</span>?
        </p>
      }
      confirmLabel="Hapus"
      loading={isDeleting}
      onConfirm={() => void submitDelete()}
    />
  );
}
