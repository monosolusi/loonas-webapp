"use client";

import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { FilterPill } from "@/core/presentations/components/filter-pill";
import { ProductType, ProductTypeLabel, ProductTypeType } from "@/features/product/domain/enums/product-type";
import { useListProductCategories } from "@/features/product/presentations/hooks/use-list-product-categories";
import { useProductList } from "@/app/(authenticated)/products/_providers/product-list-provider";
import { FilterDropdown } from "@/app/(authenticated)/products/_components/filter-dropdown";

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
        <div className="flex flex-row flex-wrap items-center gap-2">
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
        <TableSearch value={search} onChange={setSearch} placeholder="Cari nama atau SKU..." />
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
