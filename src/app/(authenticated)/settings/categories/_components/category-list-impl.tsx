"use client";

import { useState } from "react";
import Image from "next/image";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import { ActionMenu } from "@/core/presentations/components/action-menu";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useListProductCategoriesPaginated } from "@/features/product/presentations/hooks/use-list-product-categories-paginated";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { useCreateProductCategory } from "@/features/product/presentations/hooks/use-create-product-category";
import { useUpdateProductCategory } from "@/features/product/presentations/hooks/use-update-product-category";
import { useDeleteProductCategory } from "@/features/product/presentations/hooks/use-delete-product-category";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";

export function CategoryListImpl() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;
  const { categories, meta, loading } = useListProductCategoriesPaginated({
    page,
    limit: DEFAULT_PAGE_SIZE,
    search: searchQuery,
  });

  const { trigger: createCategory, isMutating: isCreating } = useCreateProductCategory();
  const { trigger: updateCategory, isMutating: isUpdating } = useUpdateProductCategory();
  const { trigger: deleteCategory, isMutating: isDeleting } = useDeleteProductCategory();
  const { showToast } = useToast();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategoryEntity | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ProductCategoryEntity | null>(null);
  const [formName, setFormName] = useState("");

  const revalidate = () =>
    revalidateSWRKey(PRODUCT_SWR_KEYS.LIST_PRODUCT_CATEGORIES, PRODUCT_SWR_KEYS.LIST_PRODUCT_CATEGORIES_PAGINATED);

  const handleCreate = async () => {
    if (!formName.trim() || isCreating) return;
    try {
      await createCategory({ name: formName.trim() });
      await revalidate();
      showToast("Kategori berhasil dibuat", "success");
      setFormName("");
      setCreateDialogOpen(false);
    } catch {
      showToast("Gagal membuat kategori", "error");
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formName.trim() || isUpdating) return;
    try {
      await updateCategory({ id: editingCategory.id, name: formName.trim() });
      await revalidate();
      showToast("Kategori berhasil diubah", "success");
      setFormName("");
      setEditingCategory(null);
    } catch {
      showToast("Gagal mengubah kategori", "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory || isDeleting) return;
    try {
      await deleteCategory({ id: deletingCategory.id });
      await revalidate();
      showToast("Kategori berhasil dihapus", "success");
      setDeletingCategory(null);
    } catch {
      showToast("Gagal menghapus kategori", "error");
    }
  };

  const openEdit = (category: ProductCategoryEntity) => {
    setFormName(category.name);
    setEditingCategory(category);
  };

  const openCreate = () => {
    setFormName("");
    setCreateDialogOpen(true);
  };

  const toolbar = (
    <TableToolbar>
      <TableSearch value={search} onChange={setSearch} placeholder="Cari kategori..." />
    </TableToolbar>
  );

  const createButton = (
    <PrimaryButton
      label="Tambah Kategori"
      leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
      onClick={openCreate}
      className="w-full sm:w-auto"
    />
  );

  const header = (
    <TableHeader
      columns={[
        { label: "Nama Kategori" },
        { label: "Aksi", align: "right" },
      ]}
      className="grid-cols-[1fr_120px]"
      hideOnMobile
    />
  );

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader
        backHref="/settings"
        title="Kategori Produk"
        subtitle={meta ? `${meta.total} kategori` : "Memuat..."}
        action={createButton}
      />

      {toolbar}

      <TableContainer
        loading={loading}
        error={false}
        empty={categories.length === 0 && !loading}
        emptyMessage="Belum ada kategori. Tambahkan kategori pertama Anda."
      >
        {header}

        {/* Desktop: grid rows (lg and up) */}
        <div className="hidden lg:block">
          {categories.map((category) => (
            <div
              key={category.id}
              className="grid grid-cols-[1fr_120px] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0"
            >
              <span className="text-sm font-medium text-neutral-500">{category.name}</span>
              <div className="flex flex-row items-center justify-end gap-x-2">
                <button
                  type="button"
                  onClick={() => openEdit(category)}
                  className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-50 hover:text-neutral-400"
                >
                  <Image src="/assets/images/edit-icon-neutral-400-w16-h16.svg" alt="edit" width={16} height={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingCategory(category)}
                  className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Image src="/assets/images/trash-icon-neutral-400-w16-h16.svg" alt="delete" width={16} height={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: stacked cards (below lg) */}
        <div className="lg:hidden">
          {categories.map((category) => (
            <MobileListCard
              key={category.id}
              title={category.name}
              chevron={false}
              trailingBottom={
                <ActionMenu
                  options={[
                    { label: "Ubah", onClick: () => openEdit(category) },
                    { label: "Hapus", onClick: () => setDeletingCategory(category), variant: "danger" },
                  ]}
                />
              }
            />
          ))}
        </div>
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={categories.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </TableContainer>

      {/* Create Dialog */}
      <LoonasDialog
        title="Tambah Kategori"
        width="sm"
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      >
        <div className="mt-2 flex flex-col gap-y-4">
          <TextInput
            label="Nama Kategori"
            placeholder="Masukkan nama kategori"
            value={formName}
            onChange={setFormName}
            required
          />
          <DialogFooter>
            <SecondaryButton outlined label="Batal" onClick={() => setCreateDialogOpen(false)} />
            <PrimaryButton
              label="Simpan"
              disabled={!formName.trim()}
              loading={isCreating}
              onClick={handleCreate}
              className="px-6"
            />
          </DialogFooter>
        </div>
      </LoonasDialog>

      {/* Edit Dialog */}
      <LoonasDialog title="Edit Kategori" width="sm" open={!!editingCategory} onClose={() => setEditingCategory(null)}>
        <div className="mt-2 flex flex-col gap-y-4">
          <TextInput
            label="Nama Kategori"
            placeholder="Masukkan nama kategori"
            value={formName}
            onChange={setFormName}
            required
          />
          <DialogFooter>
            <SecondaryButton outlined label="Batal" onClick={() => setEditingCategory(null)} />
            <PrimaryButton
              label="Simpan"
              disabled={!formName.trim()}
              loading={isUpdating}
              onClick={handleUpdate}
              className="px-6"
            />
          </DialogFooter>
        </div>
      </LoonasDialog>

      {/* Delete Dialog */}
      <ConfirmationDialog
        open={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Hapus Kategori"
        warning="Produk yang menggunakan kategori ini akan kehilangan referensi kategorinya."
        description={
          <p>
            Apakah Anda yakin ingin menghapus kategori{" "}
            <span className="font-semibold text-neutral-500">{deletingCategory?.name}</span>?
          </p>
        }
        confirmLabel="Hapus"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
