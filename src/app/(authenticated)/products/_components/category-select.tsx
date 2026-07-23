"use client";

import { useState } from "react";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { SearchCombobox } from "@/core/presentations/components/search-combobox";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
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

  const options = categories.map((cat) => ({ id: cat.id, label: cat.name }));
  const selected = options.find((opt) => opt.id === value) ?? null;

  return (
    <>
      <SearchCombobox
        noLabel
        options={options}
        value={selected}
        onChange={(opt) => onChange(opt?.id ?? undefined)}
        placeholder="Tanpa kategori"
        emptyMessage="Belum ada kategori"
        onCreateNew={() => setDialogOpen(true)}
        createNewLabel="+ Buat kategori baru"
      />

      <LoonasDialog title="Buat Kategori Baru" width="sm" open={dialogOpen} onClose={() => { setDialogOpen(false); setNewName(""); }}>
        <div className="mt-2 flex flex-col gap-y-4">
          <TextInput
            label="Nama Kategori"
            placeholder="Masukkan nama kategori"
            value={newName}
            onChange={setNewName}
            required
          />
          <DialogFooter>
            <SecondaryButton outlined label="Batal" onClick={() => { setDialogOpen(false); setNewName(""); }} />
            <PrimaryButton
              label="Simpan"
              disabled={!newName.trim()}
              loading={isMutating}
              onClick={handleCreate}
              className="w-auto px-6"
            />
          </DialogFooter>
        </div>
      </LoonasDialog>
    </>
  );
}
