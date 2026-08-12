"use client";

import { useState } from "react";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { RAW_MATERIAL_SWR_KEYS } from "@/features/raw-material/presentations/constants/swr-keys";
import { RawMaterialUnitCombobox } from "@/features/raw-material/presentations/components/raw-material-unit-combobox";
import { useListRawMaterials } from "@/features/raw-material/presentations/hooks/use-list-raw-materials";
import { useCreateRawMaterial } from "@/features/raw-material/presentations/hooks/use-create-raw-material";

export type RawMaterialOption = SearchComboboxOption & {
  unit: string;
};

type RawMaterialComboboxProps = {
  value: RawMaterialOption | null;
  onChange: (value: RawMaterialOption | null) => void;
  excludeIds?: string[];
};

export function RawMaterialCombobox({ value, onChange, excludeIds = [] }: RawMaterialComboboxProps) {
  const { showToast } = useToast();
  const { rawMaterials } = useListRawMaterials({ limit: 100 });
  const { trigger: createRawMaterial, isMutating: isCreating } = useCreateRawMaterial();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formUnit, setFormUnit] = useState("");

  const options: RawMaterialOption[] = rawMaterials
    .filter((rm) => !excludeIds.includes(rm.id))
    .map((rm) => ({ id: rm.id, label: rm.name, unit: rm.unit }));

  const handleCreateNew = async () => {
    if (!formName.trim() || !formUnit || isCreating) return;
    try {
      const created = await createRawMaterial({ name: formName.trim(), unit: formUnit });
      await revalidateSWRKey(RAW_MATERIAL_SWR_KEYS.LIST_RAW_MATERIALS);
      onChange({ id: created.id, label: created.name, unit: created.unit });
      showToast("Bahan baku berhasil ditambahkan", "success");
      setFormName("");
      setFormUnit("");
      setCreateDialogOpen(false);
    } catch {
      showToast("Gagal menambahkan bahan baku", "error");
    }
  };

  return (
    <>
      <SearchCombobox
        noLabel
        options={options}
        value={value}
        onChange={onChange}
        placeholder="Cari bahan baku..."
        onCreateNew={() => setCreateDialogOpen(true)}
        createNewLabel="+ Buat bahan baku baru"
      />

      <LoonasDialog
        title="Buat Bahan Baku Baru"
        width="sm"
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setFormName("");
          setFormUnit("");
        }}
      >
        <div className="mt-2 flex flex-col gap-y-4">
          <TextInput
            label="Nama Bahan Baku"
            placeholder="Masukkan nama bahan baku"
            value={formName}
            onChange={setFormName}
            required
          />
          <RawMaterialUnitCombobox value={formUnit} onChange={setFormUnit} />
          <DialogFooter>
            <SecondaryButton
              outlined
              label="Batal"
              onClick={() => {
                setCreateDialogOpen(false);
                setFormName("");
                setFormUnit("");
              }}
            />
            <PrimaryButton
              label="Simpan"
              disabled={!formName.trim() || !formUnit}
              loading={isCreating}
              onClick={handleCreateNew}
              className="px-6"
            />
          </DialogFooter>
        </div>
      </LoonasDialog>
    </>
  );
}
