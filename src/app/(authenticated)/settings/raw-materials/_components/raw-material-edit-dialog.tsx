"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { RAW_MATERIAL_SWR_KEYS } from "@/features/raw-material/presentations/constants/swr-keys";
import { useUpdateRawMaterial } from "@/features/raw-material/presentations/hooks/use-update-raw-material";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";
import { RawMaterialEditFormDialog } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-edit-form-dialog";

export function RawMaterialEditDialog() {
  const { showToast } = useToast();
  const { trigger, isMutating } = useUpdateRawMaterial();
  const { editingItem, setEditingItem } = useRawMaterialMaster();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setUnit(editingItem.unit);
    }
  }, [editingItem]);

  const handleClose = () => {
    setName("");
    setUnit("");
    setEditingItem(null);
  };

  const handleUpdate = async () => {
    if (!editingItem || !name.trim() || !unit || isMutating) return;
    try {
      await trigger({ id: editingItem.id, name: name.trim(), unit });
      await revalidateSWRKey(RAW_MATERIAL_SWR_KEYS.LIST_RAW_MATERIALS);
      showToast("Bahan baku berhasil diubah", "success");
      handleClose();
    } catch {
      showToast("Gagal mengubah bahan baku", "error");
    }
  };

  return (
    <RawMaterialEditFormDialog
      open={!!editingItem}
      name={name}
      unit={unit}
      loading={isMutating}
      onNameChange={setName}
      onUnitChange={setUnit}
      onSubmit={handleUpdate}
      onClose={handleClose}
    />
  );
}
