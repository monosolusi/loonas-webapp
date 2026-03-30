"use client";

import { useEffect, useState } from "react";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import {
  RawMaterialUnit,
  RawMaterialUnitLabel,
  RawMaterialUnitType,
} from "@/features/raw-material/domain/enums/raw-material-unit";
import { RAW_MATERIAL_SWR_KEYS } from "@/features/raw-material/presentations/constants/swr-keys";
import { useUpdateRawMaterial } from "@/features/raw-material/presentations/hooks/use-update-raw-material";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";

const UNIT_OPTIONS = Object.values(RawMaterialUnit).map((value) => ({
  label: RawMaterialUnitLabel[value as RawMaterialUnitType],
  value,
}));

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
    <LoonasDialog title="Edit Bahan Baku" width="sm" open={!!editingItem} onClose={handleClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <TextInput label="Nama Bahan Baku" placeholder="Masukkan nama bahan baku" value={name} onChange={setName} required />
        <SelectInput label="Satuan" value={unit} options={UNIT_OPTIONS} onChange={setUnit} placeholder="Pilih satuan" required />
        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={handleClose} />
          <PrimaryButton label="Simpan" disabled={!name.trim() || !unit} loading={isMutating} onClick={handleUpdate} className="w-auto px-6" />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
