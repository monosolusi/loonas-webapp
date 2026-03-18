"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { ProductStatus } from "@/features/product/domain/enums/product-status";
import { ProductType, ProductTypeLabel, ProductTypeType } from "@/features/product/domain/enums/product-type";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useListProducts } from "@/features/product/presentations/hooks/use-list-products";
import { useUpdateProduct } from "@/features/product/presentations/hooks/use-update-product";
import { useListProductCategories } from "@/features/product/presentations/hooks/use-list-product-categories";
import { ProductTable, ProductTableRow } from "@/app/(authenticated)/products/_components/product-table";
import { FilterDropdown, FilterPill } from "@/app/(authenticated)/products/_components/filter-dropdown";

const TYPE_OPTIONS = Object.values(ProductType).map((value) => ({
  label: ProductTypeLabel[value as ProductTypeType],
  value,
}));

const STATUS_OPTIONS = [
  { label: "Aktif", value: ProductStatus.ACTIVE },
  { label: "Nonaktif", value: ProductStatus.INACTIVE },
];

export function ProductListImpl() {
  const [page, setPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const { trigger: updateProduct } = useUpdateProduct();
  const { showToast } = useToast();

  const handleToggleStatus = async (productId: string, newStatus: string) => {
    try {
      await updateProduct({ id: productId, status: newStatus });
      await revalidateSWRKey(PRODUCT_SWR_KEYS.LIST_PRODUCTS);
      showToast(newStatus === ProductStatus.ACTIVE ? "Produk diaktifkan" : "Produk dinonaktifkan", "success");
    } catch (err) {
      showToast("Gagal mengubah status produk", "error");
      throw err;
    }
  };

  const { products, meta, loading, error } = useListProducts({
    page,
    limit: 10,
    type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
    categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    status: selectedStatuses.length === 1 ? selectedStatuses[0] : undefined,
    search: searchQuery,
  });
  const { categories } = useListProductCategories();

  const categoryOptions = categories.map((cat) => ({ label: cat.name, value: cat.id }));

  const hasActiveFilters = selectedTypes.length > 0 || selectedCategories.length > 0 || selectedStatuses.length > 0;

  const handleFilterChange = () => setPage(1);

  const handleTypesChange = (values: string[]) => {
    setSelectedTypes(values);
    handleFilterChange();
  };

  const handleCategoriesChange = (values: string[]) => {
    setSelectedCategories(values);
    handleFilterChange();
  };

  const handleStatusesChange = (values: string[]) => {
    setSelectedStatuses(values);
    handleFilterChange();
  };

  const removeType = (value: string) => {
    setSelectedTypes((prev) => prev.filter((v) => v !== value));
    handleFilterChange();
  };

  const removeCategory = (id: string) => {
    setSelectedCategories((prev) => prev.filter((v) => v !== id));
    handleFilterChange();
  };

  const removeStatus = (value: string) => {
    setSelectedStatuses((prev) => prev.filter((v) => v !== value));
    handleFilterChange();
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedStatuses([]);
    handleFilterChange();
  };

  const toolbar = (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-x-2">
          <FilterDropdown
            label="Tipe"
            options={TYPE_OPTIONS}
            selected={selectedTypes}
            onChange={handleTypesChange}
            multiple
          />
          <FilterDropdown
            label="Status"
            options={STATUS_OPTIONS}
            selected={selectedStatuses}
            onChange={handleStatusesChange}
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
      </div>

      {hasActiveFilters && (
        <div className="flex flex-row flex-wrap items-center gap-2">
          {selectedTypes.map((value) => {
            const opt = TYPE_OPTIONS.find((o) => o.value === value);
            return opt ? (
              <FilterPill key={value} label={`Tipe: ${opt.label}`} onRemove={() => removeType(value)} />
            ) : null;
          })}
          {selectedStatuses.map((value) => {
            const opt = STATUS_OPTIONS.find((o) => o.value === value);
            return opt ? (
              <FilterPill key={value} label={`Status: ${opt.label}`} onRemove={() => removeStatus(value)} />
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

  const header = (
    <div className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.7fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Produk</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">SKU</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tipe</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Kategori</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Status</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Harga</span>
    </div>
  );

  const rows: ProductTableRow[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    type: product.type,
    productionMode: product.productionMode,
    category: product.category?.name ?? null,
    status: product.status,
    displayPrice: product.displayPrice,
    variantCount: product.variants.length,
    primaryPhotoUrl: product.primaryPhoto?.publicUrl ?? null,
  }));

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Produk</h1>
        <p className="leading-6 text-neutral-300">{meta ? `${meta.total} produk` : "Memuat..."}</p>
      </div>

      <InvoiceTableShell
        toolbar={toolbar}
        header={header}
        loading={loading}
        error={!!error}
        empty={products.length === 0 && !loading}
        emptyMessage="Belum ada produk. Tambahkan produk pertama Anda."
      >
        {meta && (
          <ProductTable
            rows={rows}
            meta={meta}
            currentPage={page}
            onPageChange={setPage}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </InvoiceTableShell>
    </div>
  );
}
