"use client";

import { ReactNode } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { DangerButton } from "@/core/presentations/components/buttons/danger-button";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type ConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  warning?: string;
  cancelLabel?: string;
  confirmLabel: string;
  confirmVariant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  open,
  onClose,
  title,
  description,
  warning,
  cancelLabel = "Batal",
  confirmLabel,
  confirmVariant = "danger",
  loading,
  onConfirm,
}: ConfirmationDialogProps) {
  const ActionButton = confirmVariant === "danger" ? DangerButton : PrimaryButton;

  return (
    <LoonasDialog title={title} width="sm" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        {warning && (
          <div className="rounded-lg border border-error-300/20 bg-error-300/5 px-4 py-3">
            <p className="text-sm text-error-300">{warning}</p>
          </div>
        )}
        <div className="text-sm text-neutral-300">{description}</div>
        <DialogFooter>
          <SecondaryButton outlined label={cancelLabel} onClick={onClose} />
          <ActionButton label={confirmLabel} loading={loading} onClick={onConfirm} className="px-6" />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
