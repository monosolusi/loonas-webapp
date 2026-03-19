"use client";

import { useState } from "react";
import Image from "next/image";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { RawMaterialCombobox, RawMaterialOption } from "@/app/(authenticated)/products/_components/raw-material-combobox";
import {
  RawMaterialUnitLabel,
  RawMaterialUnitType,
} from "@/features/raw-material/domain/enums/raw-material-unit";

export type RecipeRow = {
  key: string;
  rawMaterial: RawMaterialOption | null;
  quantity: number;
};

type RecipeEditDialogProps = {
  open: boolean;
  onClose: () => void;
  variantName: string;
  initialItems: RecipeRow[];
  onSave: (items: RecipeRow[]) => Promise<void>;
};

function createEmptyRow(): RecipeRow {
  return { key: crypto.randomUUID(), rawMaterial: null, quantity: 0 };
}

export function RecipeEditDialog({ open, onClose, variantName, initialItems, onSave }: RecipeEditDialogProps) {
  const [items, setItems] = useState<RecipeRow[]>(() =>
    initialItems.length > 0 ? initialItems : [createEmptyRow()],
  );

  const updateItem = (key: string, updates: Partial<RecipeRow>) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...updates } : item)));
  };

  const removeItem = (key: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.key !== key);
      return filtered.length > 0 ? filtered : [createEmptyRow()];
    });
  };

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyRow()]);
  };

  const selectedIds = items.filter((item) => item.rawMaterial).map((item) => item.rawMaterial!.id);

  const isValid = items.some((item) => item.rawMaterial && item.quantity > 0);

  const handleSave = async () => {
    const validItems = items.filter((item) => item.rawMaterial && item.quantity > 0);
    if (validItems.length === 0) return;
    await onSave(validItems);
    onClose();
  };

  const handleClose = () => {
    setItems(initialItems.length > 0 ? initialItems : [createEmptyRow()]);
    onClose();
  };

  return (
    <LoonasDialog title={`Resep — ${variantName}`} width="lg" open={open} onClose={handleClose}>
      <div className="mt-4 flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          {items.map((item) => (
            <div key={item.key} className="flex flex-row items-center gap-x-3">
              <div className="flex-[3]">
                <RawMaterialCombobox
                  value={item.rawMaterial}
                  onChange={(val) => updateItem(item.key, { rawMaterial: val })}
                  excludeIds={selectedIds.filter((id) => id !== item.rawMaterial?.id)}
                />
              </div>
              <div className="flex-[1]">
                <CurrencyInput
                  label=""
                  leftIcon={null}
                  placeholder="0"
                  value={item.quantity}
                  onChange={(val) => updateItem(item.key, { quantity: val })}
                  required={false}
                />
              </div>
              <span className="w-12 shrink-0 text-sm text-neutral-300">
                {item.rawMaterial
                  ? (RawMaterialUnitLabel[item.rawMaterial.unit as RawMaterialUnitType]?.split(" ")[0]?.toLowerCase() ??
                    item.rawMaterial.unit)
                  : ""}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.key)}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Image src="/assets/images/trash-icon-neutral-400-w16-h16.svg" alt="hapus" width={16} height={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="self-start text-sm font-medium text-primary-300 transition-colors hover:text-primary-300/80"
        >
          + Tambah Bahan
        </button>

        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={handleClose} />
          <PrimaryButton label="Simpan Resep" disabled={!isValid} onClick={handleSave} className="w-auto px-6" />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
