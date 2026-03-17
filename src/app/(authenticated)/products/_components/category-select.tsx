"use client";

import { useState } from "react";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useListProductCategories } from "@/features/product/presentations/hooks/use-list-product-categories";
import { useCreateProductCategory } from "@/features/product/presentations/hooks/use-create-product-category";

type CategorySelectProps = {
  value: string | undefined;
  onChange: (categoryId: string | undefined) => void;
};

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { categories, loading } = useListProductCategories();
  const { trigger: createCategory, isMutating } = useCreateProductCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = async () => {
    if (!newName.trim() || isMutating) return;
    try {
      const category = await createCategory({ name: newName.trim() });
      await revalidateSWRKey(PRODUCT_SWR_KEYS.LIST_PRODUCT_CATEGORIES);
      onChange(category.id);
      setNewName("");
      setDialogOpen(false);
    } catch {
      // Error captured by SWR
    }
  };

  if (loading) {
    return <div className="h-11 animate-pulse rounded-lg bg-neutral-100" />;
  }

  return (
    <>
      <div className="flex flex-col gap-y-3">
        <SelectInput
          noLabel
          value={value ?? ""}
          onChange={(val) => onChange(val || undefined)}
          placeholder="Tanpa kategori"
          options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
        />
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="self-start text-sm font-medium text-primary-300 transition-colors hover:text-primary-300/80"
        >
          + Buat kategori baru
        </button>
      </div>

      <LoonasDialog title="Buat Kategori Baru" width="sm" open={dialogOpen} onClose={() => { setDialogOpen(false); setNewName(""); }}>
        <div className="mt-2 flex flex-col gap-y-4">
          <TextInput
            label="Nama Kategori"
            placeholder="Masukkan nama kategori"
            value={newName}
            onChange={setNewName}
            required
          />
          <div className="-mx-4 flex flex-row justify-end gap-x-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:px-6">
            <SecondaryButton outlined label="Batal" onClick={() => { setDialogOpen(false); setNewName(""); }} />
            <PrimaryButton
              label="Simpan"
              disabled={!newName.trim()}
              loading={isMutating}
              onClick={handleCreate}
              className="w-auto px-6"
            />
          </div>
        </div>
      </LoonasDialog>
    </>
  );
}
