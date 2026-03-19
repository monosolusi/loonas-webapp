"use client";

import { useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/16/solid";
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
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { FIXED_COST_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/swr-keys";
import { useListFixedCosts } from "@/features/fixed-cost/presentations/hooks/use-list-fixed-costs";
import { useCreateFixedCost } from "@/features/fixed-cost/presentations/hooks/use-create-fixed-cost";
import { useUpdateFixedCost } from "@/features/fixed-cost/presentations/hooks/use-update-fixed-cost";
import { useDeleteFixedCost } from "@/features/fixed-cost/presentations/hooks/use-delete-fixed-cost";

export function FixedCostMasterListImpl() {
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const { fixedCosts, meta, loading } = useListFixedCosts({ page, limit: 10, search: searchQuery });
  const { trigger: createFixedCost, isMutating: isCreating } = useCreateFixedCost();
  const { trigger: updateFixedCost, isMutating: isUpdating } = useUpdateFixedCost();
  const { trigger: deleteFixedCost, isMutating: isDeleting } = useDeleteFixedCost();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FixedCostEntity | null>(null);
  const [deletingItem, setDeletingItem] = useState<FixedCostEntity | null>(null);
  const [formName, setFormName] = useState("");

  const revalidate = () => revalidateSWRKey(FIXED_COST_SWR_KEYS.LIST_FIXED_COSTS);

  const handleCreate = async () => {
    if (!formName.trim() || isCreating) return;
    try {
      await createFixedCost({ name: formName.trim() });
      await revalidate();
      showToast("Biaya tetap berhasil ditambahkan", "success");
      setFormName("");
      setCreateDialogOpen(false);
    } catch {
      showToast("Gagal menambahkan biaya tetap", "error");
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !formName.trim() || isUpdating) return;
    try {
      await updateFixedCost({ id: editingItem.id, name: formName.trim() });
      await revalidate();
      showToast("Biaya tetap berhasil diubah", "success");
      setFormName("");
      setEditingItem(null);
    } catch {
      showToast("Gagal mengubah biaya tetap", "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem || isDeleting) return;
    try {
      await deleteFixedCost({ id: deletingItem.id });
      await revalidate();
      showToast("Biaya tetap berhasil dihapus", "success");
      setDeletingItem(null);
    } catch {
      showToast("Gagal menghapus biaya tetap. Pastikan tidak ada entries yang terkait.", "error");
    }
  };

  const openCreate = () => {
    setFormName("");
    setCreateDialogOpen(true);
  };

  const openEdit = (item: FixedCostEntity) => {
    setFormName(item.name);
    setEditingItem(item);
  };

  const toolbar = (
    <div className="flex flex-row items-center justify-between">
      <div className="w-[280px]">
        <TextInput
          label=""
          placeholder="Cari biaya tetap..."
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
          label="Tambah Biaya Tetap"
          leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
          onClick={openCreate}
        />
      </div>
    </div>
  );

  const header = (
    <div className="grid grid-cols-[1fr_120px] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Nama Biaya</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Aksi</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader
        backHref="/settings"
        title="Biaya Tetap"
        subtitle={meta ? `${meta.total} biaya tetap` : "Memuat..."}
      />

      <InvoiceTableShell
        toolbar={toolbar}
        header={header}
        loading={loading}
        error={false}
        empty={fixedCosts.length === 0 && !loading}
        emptyMessage="Belum ada biaya tetap. Tambahkan jenis biaya pertama Anda."
      >
        {fixedCosts.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_120px] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0"
          >
            <span className="text-sm font-medium text-neutral-500">{item.name}</span>
            <div className="flex flex-row items-center justify-end gap-x-2">
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-50 hover:text-neutral-400"
              >
                <Image src="/assets/images/edit-icon-neutral-400-w16-h16.svg" alt="edit" width={16} height={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeletingItem(item)}
                className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Image src="/assets/images/trash-icon-neutral-400-w16-h16.svg" alt="delete" width={16} height={16} />
              </button>
            </div>
          </div>
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={fixedCosts.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </InvoiceTableShell>

      {/* Create Dialog */}
      <LoonasDialog
        title="Tambah Biaya Tetap"
        width="sm"
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      >
        <div className="mt-2 flex flex-col gap-y-4">
          <TextInput
            label="Nama Biaya"
            placeholder="Contoh: Sewa Tempat, Gaji Karyawan"
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
              className="w-auto px-6"
            />
          </DialogFooter>
        </div>
      </LoonasDialog>

      {/* Edit Dialog */}
      <LoonasDialog title="Edit Biaya Tetap" width="sm" open={!!editingItem} onClose={() => setEditingItem(null)}>
        <div className="mt-2 flex flex-col gap-y-4">
          <TextInput
            label="Nama Biaya"
            placeholder="Contoh: Sewa Tempat, Gaji Karyawan"
            value={formName}
            onChange={setFormName}
            required
          />
          <DialogFooter>
            <SecondaryButton outlined label="Batal" onClick={() => setEditingItem(null)} />
            <PrimaryButton
              label="Simpan"
              disabled={!formName.trim()}
              loading={isUpdating}
              onClick={handleUpdate}
              className="w-auto px-6"
            />
          </DialogFooter>
        </div>
      </LoonasDialog>

      {/* Delete Dialog */}
      <ConfirmationDialog
        open={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title="Hapus Biaya Tetap"
        warning="Biaya tetap yang masih memiliki entries tidak dapat dihapus."
        description={
          <p>
            Apakah Anda yakin ingin menghapus biaya tetap{" "}
            <span className="font-semibold text-neutral-500">{deletingItem?.name}</span>?
          </p>
        }
        confirmLabel="Hapus"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
