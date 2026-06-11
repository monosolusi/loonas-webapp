"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import {
  RawMaterialUnit,
  RawMaterialUnitLabel,
  RawMaterialUnitType,
} from "@/features/raw-material/domain/enums/raw-material-unit";

const UNIT_OPTIONS = Object.values(RawMaterialUnit).map((value) => ({
  label: RawMaterialUnitLabel[value as RawMaterialUnitType],
  value,
}));

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
        <SelectInput label="Satuan" value={unit} options={UNIT_OPTIONS} onChange={onUnitChange} placeholder="Pilih satuan" required />
        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={onClose} />
          <PrimaryButton label="Simpan" disabled={!name.trim() || !unit} loading={loading} onClick={onSubmit} className="w-auto px-6" />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
