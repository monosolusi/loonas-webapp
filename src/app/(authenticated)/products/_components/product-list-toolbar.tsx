"use client";

import Image from "next/image";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { ProductType, ProductTypeLabel, ProductTypeType } from "@/features/product/domain/enums/product-type";
import { useListProductCategories } from "@/features/product/presentations/hooks/use-list-product-categories";
import { useProductList } from "@/app/(authenticated)/products/_providers/product-list-provider";
import { FilterDropdown, FilterPill } from "@/app/(authenticated)/products/_components/filter-dropdown";

const TYPE_OPTIONS = Object.values(ProductType).map((value) => ({
  label: ProductTypeLabel[value as ProductTypeType],
  value,
}));

export function ProductListToolbar() {
  const {
    search,
    selectedTypes,
    selectedCategories,
    setSearch,
    setSelectedTypes,
    setSelectedCategories,
    handleFilterChange,
  } = useProductList();

  const { categories } = useListProductCategories();
  const categoryOptions = categories.map((cat) => ({ label: cat.name, value: cat.id }));
  const hasActiveFilters = selectedTypes.length > 0 || selectedCategories.length > 0;

  const handleTypesChange = (values: string[]) => {
    setSelectedTypes(values);
    handleFilterChange();
  };

  const handleCategoriesChange = (values: string[]) => {
    setSelectedCategories(values);
    handleFilterChange();
  };

  const removeType = (value: string) => {
    setSelectedTypes(selectedTypes.filter((v) => v !== value));
    handleFilterChange();
  };

  const removeCategory = (id: string) => {
    setSelectedCategories(selectedCategories.filter((v) => v !== id));
    handleFilterChange();
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    handleFilterChange();
  };

  return (
    <div className="flex flex-col gap-y-3">
      <TableToolbar>
        <div className="flex flex-row items-center gap-x-2">
          <FilterDropdown
            label="Tipe"
            options={TYPE_OPTIONS}
            selected={selectedTypes}
            onChange={handleTypesChange}
            multiple
          />
          <FilterDropdown
            label="Kategori"
            options={categoryOptions}
            selected={selectedCategories}
            onChange={handleCategoriesChange}
            multiple
            searchable
            searchPlaceholder="Cari kategori..."
          />
        </div>
        <div className="flex flex-row items-center gap-x-3">
          <div className="w-[250px]">
            <TextInput
              label=""
              placeholder="Cari nama atau SKU..."
              value={search}
              onChange={setSearch}
              leftIcon={
                <Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="" width={20} height={20} />
              }
              rightIcon={
                search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="flex items-center justify-center text-neutral-200 hover:text-neutral-400"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                ) : undefined
              }
            />
          </div>
          <Link href="/products/create">
            <PrimaryButton
              label="Tambah Produk"
              leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            />
          </Link>
        </div>
      </TableToolbar>

      {hasActiveFilters && (
        <div className="flex flex-row flex-wrap items-center gap-2">
          {selectedTypes.map((value) => {
            const opt = TYPE_OPTIONS.find((o) => o.value === value);
            return opt ? (
              <FilterPill key={value} label={`Tipe: ${opt.label}`} onRemove={() => removeType(value)} />
            ) : null;
          })}
          {selectedCategories.map((id) => {
            const cat = categories.find((c) => c.id === id);
            return cat ? (
              <FilterPill key={id} label={`Kategori: ${cat.name}`} onRemove={() => removeCategory(id)} />
            ) : null;
          })}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-medium text-neutral-300 transition-colors hover:text-neutral-500"
          >
            Hapus semua
          </button>
        </div>
      )}
    </div>
  );
}
