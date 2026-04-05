"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { RAW_MATERIAL_SWR_KEYS } from "@/features/raw-material/presentations/constants/swr-keys";
import { useUpdateRawMaterial } from "@/features/raw-material/presentations/hooks/use-update-raw-material";
import { RawMaterialEditFormDialog } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-edit-form-dialog";

type RawMaterialDetailEditDialogProps = {
  item: RawMaterialEntity | null;
  onClose: () => void;
};

export function RawMaterialDetailEditDialog({ item, onClose }: RawMaterialDetailEditDialogProps) {
  const { showToast } = useToast();
  const { trigger, isMutating } = useUpdateRawMaterial();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setUnit(item.unit);
    }
  }, [item]);

  const handleClose = () => {
    setName("");
    setUnit("");
    onClose();
  };

  const handleUpdate = async () => {
    if (!item || !name.trim() || !unit || isMutating) return;
    try {
      await trigger({ id: item.id, name: name.trim(), unit });
      await revalidateSWRKey(RAW_MATERIAL_SWR_KEYS.GET_RAW_MATERIAL, RAW_MATERIAL_SWR_KEYS.LIST_RAW_MATERIALS);
      showToast("Bahan baku berhasil diubah", "success");
      handleClose();
    } catch {
      showToast("Gagal mengubah bahan baku", "error");
    }
  };

  return (
    <RawMaterialEditFormDialog
      open={!!item}
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
