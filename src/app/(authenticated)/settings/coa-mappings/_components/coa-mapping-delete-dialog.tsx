"use client";

import { useState } from "react";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useCoaMappings } from "@/app/(authenticated)/settings/coa-mappings/_providers/coa-mappings-provider";

export function CoaMappingDeleteDialog() {
  const { deletingMapping, setDeletingMapping, handleDelete } = useCoaMappings();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!deletingMapping || deleting) return;
    setDeleting(true);
    try {
      await handleDelete(deletingMapping.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ConfirmationDialog
      open={!!deletingMapping}
      onClose={() => setDeletingMapping(null)}
      title="Hapus Pemetaan Akun"
      description="Apakah Anda yakin ingin menghapus pemetaan akun ini? Transaksi akan menggunakan pemetaan default sistem."
      confirmLabel="Hapus"
      confirmVariant="danger"
      loading={deleting}
      onConfirm={handleConfirm}
    />
  );
}
