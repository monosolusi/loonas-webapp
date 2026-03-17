"use client";

import { useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { DangerButton } from "@/core/presentations/components/buttons/danger-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";
import { useListProductCategoriesPaginated } from "@/features/product/presentations/hooks/use-list-product-categories-paginated";
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
    limit: 10,
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

  const revalidate = () => revalidateSWRKey("list-product-categories", "list-product-categories-paginated");

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
    <div className="flex flex-row items-center justify-between">
      <div className="w-[280px]">
        <TextInput
          label=""
          placeholder="Cari kategori..."
          value={search}
          onChange={setSearch}
          leftIcon={<Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="" width={20} height={20} />}
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
      <div className="flex">
        <PrimaryButton
          label="Tambah Kategori"
          leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
          onClick={openCreate}
        />
      </div>
    </div>
  );

  const header = (
    <div className="grid grid-cols-[1fr_120px] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Nama Kategori</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Aksi</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader backHref="/settings" title="Kategori Produk" subtitle={meta ? `${meta.total} kategori` : "Memuat..."} />

      <InvoiceTableShell
        toolbar={toolbar}
        header={header}
        loading={loading}
        error={false}
        empty={categories.length === 0 && !loading}
        emptyMessage="Belum ada kategori. Tambahkan kategori pertama Anda."
      >
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
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={categories.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </InvoiceTableShell>

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
          <div className="-mx-4 flex flex-row justify-end gap-x-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:px-6">
            <SecondaryButton outlined label="Batal" onClick={() => setCreateDialogOpen(false)} />
            <PrimaryButton
              label="Simpan"
              disabled={!formName.trim()}
              loading={isCreating}
              onClick={handleCreate}
              className="w-auto px-6"
            />
          </div>
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
          <div className="-mx-4 flex flex-row justify-end gap-x-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:px-6">
            <SecondaryButton outlined label="Batal" onClick={() => setEditingCategory(null)} />
            <PrimaryButton
              label="Simpan"
              disabled={!formName.trim()}
              loading={isUpdating}
              onClick={handleUpdate}
              className="w-auto px-6"
            />
          </div>
        </div>
      </LoonasDialog>

      {/* Delete Dialog */}
      <LoonasDialog
        title="Hapus Kategori"
        width="sm"
        open={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
      >
        <div className="mt-2 flex flex-col gap-y-4">
          <div className="border-error-300/20 bg-error-300/5 rounded-lg border px-4 py-3">
            <p className="text-error-300 text-sm">
              Produk yang menggunakan kategori ini akan kehilangan referensi kategorinya.
            </p>
          </div>
          <p className="text-sm text-neutral-300">
            Apakah Anda yakin ingin menghapus kategori{" "}
            <span className="font-semibold text-neutral-500">{deletingCategory?.name}</span>?
          </p>
          <div className="-mx-4 flex flex-row justify-end gap-x-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:px-6">
            <SecondaryButton outlined label="Batal" onClick={() => setDeletingCategory(null)} />
            <DangerButton label="Hapus" loading={isDeleting} onClick={handleDelete} className="w-auto px-6" />
          </div>
        </div>
      </LoonasDialog>
    </div>
  );
}
