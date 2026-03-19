"use client";

import { useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";
import {
  RawMaterialUnit,
  RawMaterialUnitLabel,
  RawMaterialUnitType
} from "@/features/raw-material/domain/enums/raw-material-unit";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { RAW_MATERIAL_SWR_KEYS } from "@/features/raw-material/presentations/constants/swr-keys";
import { useListRawMaterials } from "@/features/raw-material/presentations/hooks/use-list-raw-materials";
import { useCreateRawMaterial } from "@/features/raw-material/presentations/hooks/use-create-raw-material";
import { useUpdateRawMaterial } from "@/features/raw-material/presentations/hooks/use-update-raw-material";
import { useDeleteRawMaterial } from "@/features/raw-material/presentations/hooks/use-delete-raw-material";

const UNIT_OPTIONS = Object.values(RawMaterialUnit).map((value) => ({
  label: RawMaterialUnitLabel[value as RawMaterialUnitType],
  value,
}));

export function RawMaterialListImpl() {
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const { rawMaterials, meta, loading } = useListRawMaterials({ page, limit: 10, search: searchQuery });
  const { trigger: createRawMaterial, isMutating: isCreating } = useCreateRawMaterial();
  const { trigger: updateRawMaterial, isMutating: isUpdating } = useUpdateRawMaterial();
  const { trigger: deleteRawMaterial, isMutating: isDeleting } = useDeleteRawMaterial();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RawMaterialEntity | null>(null);
  const [deletingItem, setDeletingItem] = useState<RawMaterialEntity | null>(null);
  const [formName, setFormName] = useState("");
  const [formUnit, setFormUnit] = useState("");

  const revalidate = () => revalidateSWRKey(RAW_MATERIAL_SWR_KEYS.LIST_RAW_MATERIALS);

  const handleCreate = async () => {
    if (!formName.trim() || !formUnit || isCreating) return;
    try {
      await createRawMaterial({ name: formName.trim(), unit: formUnit });
      await revalidate();
      showToast("Bahan baku berhasil ditambahkan", "success");
      setFormName("");
      setFormUnit("");
      setCreateDialogOpen(false);
    } catch {
      showToast("Gagal menambahkan bahan baku", "error");
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !formName.trim() || !formUnit || isUpdating) return;
    try {
      await updateRawMaterial({ id: editingItem.id, name: formName.trim(), unit: formUnit });
      await revalidate();
      showToast("Bahan baku berhasil diubah", "success");
      setFormName("");
      setFormUnit("");
      setEditingItem(null);
    } catch {
      showToast("Gagal mengubah bahan baku", "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem || isDeleting) return;
    try {
      await deleteRawMaterial({ id: deletingItem.id });
      await revalidate();
      showToast("Bahan baku berhasil dihapus", "success");
      setDeletingItem(null);
    } catch {
      showToast("Gagal menghapus bahan baku. Pastikan bahan baku tidak digunakan dalam resep.", "error");
    }
  };

  const openCreate = () => {
    setFormName("");
    setFormUnit("");
    setCreateDialogOpen(true);
  };

  const openEdit = (item: RawMaterialEntity) => {
    setFormName(item.name);
    setFormUnit(item.unit);
    setEditingItem(item);
  };

  const toolbar = (
    <div className="flex flex-row items-center justify-between">
      <div className="w-[280px]">
        <TextInput
          label=""
          placeholder="Cari bahan baku..."
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
          label="Tambah Bahan Baku"
          leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
          onClick={openCreate}
        />
      </div>
    </div>
  );

  const header = (
    <div className="grid grid-cols-[3fr_1fr_120px] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Nama</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Satuan</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Aksi</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader
        backHref="/settings"
        title="Bahan Baku"
        subtitle={meta ? `${meta.total} bahan baku` : "Memuat..."}
      />

      <InvoiceTableShell
        toolbar={toolbar}
        header={header}
        loading={loading}
        error={false}
        empty={rawMaterials.length === 0 && !loading}
        emptyMessage="Belum ada bahan baku. Tambahkan bahan baku pertama Anda."
      >
        {rawMaterials.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[3fr_1fr_120px] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0"
          >
            <span className="text-sm font-medium text-neutral-500">{item.name}</span>
            <span className="text-sm text-neutral-400">
              {RawMaterialUnitLabel[item.unit as RawMaterialUnitType] ?? item.unit}
            </span>
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
          <TablePagination displayedCount={rawMaterials.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </InvoiceTableShell>

      {/* Create Dialog */}
      <LoonasDialog
        title="Tambah Bahan Baku"
        width="sm"
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      >
        <div className="mt-2 flex flex-col gap-y-4">
          <TextInput
            label="Nama Bahan Baku"
            placeholder="Masukkan nama bahan baku"
            value={formName}
            onChange={setFormName}
            required
          />
          <SelectInput
            label="Satuan"
            value={formUnit}
            options={UNIT_OPTIONS}
            onChange={setFormUnit}
            placeholder="Pilih satuan"
            required
          />
          <DialogFooter>
            <SecondaryButton outlined label="Batal" onClick={() => setCreateDialogOpen(false)} />
            <PrimaryButton
              label="Simpan"
              disabled={!formName.trim() || !formUnit}
              loading={isCreating}
              onClick={handleCreate}
              className="w-auto px-6"
            />
          </DialogFooter>
        </div>
      </LoonasDialog>

      {/* Edit Dialog */}
      <LoonasDialog title="Edit Bahan Baku" width="sm" open={!!editingItem} onClose={() => setEditingItem(null)}>
        <div className="mt-2 flex flex-col gap-y-4">
          <TextInput
            label="Nama Bahan Baku"
            placeholder="Masukkan nama bahan baku"
            value={formName}
            onChange={setFormName}
            required
          />
          <SelectInput
            label="Satuan"
            value={formUnit}
            options={UNIT_OPTIONS}
            onChange={setFormUnit}
            placeholder="Pilih satuan"
            required
          />
          <DialogFooter>
            <SecondaryButton outlined label="Batal" onClick={() => setEditingItem(null)} />
            <PrimaryButton
              label="Simpan"
              disabled={!formName.trim() || !formUnit}
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
        title="Hapus Bahan Baku"
        warning="Bahan baku yang digunakan dalam resep produk tidak dapat dihapus."
        description={
          <p>
            Apakah Anda yakin ingin menghapus bahan baku{" "}
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
