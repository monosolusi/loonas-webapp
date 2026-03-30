"use client";

import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";

type RecipeApplyAllDialogProps = {
  open: boolean;
  variantNames: string[];
  onClose: () => void;
  onConfirm: () => void;
};

export function RecipeApplyAllDialog({ open, variantNames, onClose, onConfirm }: RecipeApplyAllDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      title="Apply Resep untuk Semua Varian"
      warning="Resep dari varian pertama akan digunakan untuk semua varian. Resep varian lain akan ditimpa saat disimpan."
      description={
        <p>
          Resep yang disimpan akan diterapkan ke semua varian:{" "}
          <span className="font-semibold">{variantNames.join(", ")}</span>
        </p>
      }
      confirmLabel="Terapkan"
      onConfirm={onConfirm}
    />
  );
}
