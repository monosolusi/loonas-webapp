"use client";

import { useState } from "react";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { FIXED_COST_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/swr-keys";
import { useCreateFixedCost } from "@/features/fixed-cost/presentations/hooks/use-create-fixed-cost";
import { FixedCostCategory } from "@/features/fixed-cost/domain/enums/fixed-cost-category";
import { FixedCostCategoryRadio } from "@/app/(authenticated)/settings/fixed-costs/_components/fixed-cost-category-radio";

type FixedCostCreateDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function FixedCostCreateDialog({ open, onClose }: FixedCostCreateDialogProps) {
  const { showToast } = useToast();
  const { trigger, isMutating } = useCreateFixedCost();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FixedCostCategory>("general");

  const handleClose = () => {
    setName("");
    setCategory("general");
    onClose();
  };

  const handleCreate = async () => {
    if (!name.trim() || isMutating) return;
    try {
      await trigger({ name: name.trim(), category });
      await revalidateSWRKey(FIXED_COST_SWR_KEYS.LIST_FIXED_COSTS);
      showToast("Biaya tetap berhasil ditambahkan", "success");
      handleClose();
    } catch {
      showToast("Gagal menambahkan biaya tetap", "error");
    }
  };

  return (
    <LoonasDialog title="Tambah Biaya Tetap" width="sm" open={open} onClose={handleClose}>
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
            onClick={handleCreate}
            className="w-auto px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
