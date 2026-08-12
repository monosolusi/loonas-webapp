"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { RawMaterialUnitCombobox } from "@/features/raw-material/presentations/components/raw-material-unit-combobox";

type RawMaterialEditFormDialogProps = {
  open: boolean;
  name: string;
  unit: string;
  loading: boolean;
  onNameChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function RawMaterialEditFormDialog({
  open,
  name,
  unit,
  loading,
  onNameChange,
  onUnitChange,
  onSubmit,
  onClose,
}: RawMaterialEditFormDialogProps) {
  return (
    <LoonasDialog title="Edit Bahan Baku" width="sm" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <TextInput label="Nama Bahan Baku" placeholder="Masukkan nama bahan baku" value={name} onChange={onNameChange} required />
        <RawMaterialUnitCombobox value={unit} onChange={onUnitChange} />
        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={onClose} />
          <PrimaryButton label="Simpan" disabled={!name.trim() || !unit} loading={loading} onClick={onSubmit} className="px-6" />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
