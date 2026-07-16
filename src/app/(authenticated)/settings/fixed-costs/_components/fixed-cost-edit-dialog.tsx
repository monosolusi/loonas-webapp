"use client";

import { useEffect, useState } from "react";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { FIXED_COST_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/swr-keys";
import { useUpdateFixedCost } from "@/features/fixed-cost/presentations/hooks/use-update-fixed-cost";
import { FixedCostCategory } from "@/features/fixed-cost/domain/enums/fixed-cost-category";
import { useFixedCostMaster } from "@/app/(authenticated)/settings/fixed-costs/_providers/fixed-cost-master-provider";
import { FixedCostCategoryRadio } from "@/app/(authenticated)/settings/fixed-costs/_components/fixed-cost-category-radio";

export function FixedCostEditDialog() {
  const { showToast } = useToast();
  const { trigger, isMutating } = useUpdateFixedCost();
  const { editingItem, setEditingItem } = useFixedCostMaster();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FixedCostCategory>("general");

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
    }
  }, [editingItem]);

  const handleClose = () => {
    setName("");
    setCategory("general");
    setEditingItem(null);
  };

  const handleUpdate = async () => {
    if (!editingItem || !name.trim() || isMutating) return;
    try {
      await trigger({ id: editingItem.id, name: name.trim(), category });
      await revalidateSWRKey(FIXED_COST_SWR_KEYS.LIST_FIXED_COSTS);
      showToast("Biaya tetap berhasil diubah", "success");
      handleClose();
    } catch {
      showToast("Gagal mengubah biaya tetap", "error");
    }
  };

  return (
    <LoonasDialog title="Edit Biaya Tetap" width="md" open={!!editingItem} onClose={handleClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <TextInput
          label="Nama Biaya"
          placeholder="Contoh: Sewa Tempat, Gaji Karyawan"
          value={name}
          onChange={setName}
          required
        />
        <FixedCostCategoryRadio value={category} onChange={setCategory} />
        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={handleClose} />
          <PrimaryButton
            label="Simpan"
            disabled={!name.trim()}
            loading={isMutating}
            onClick={handleUpdate}
            className="w-auto px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
