"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";
import { RawMaterialMasterRow } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-master-row";
import { RawMaterialEditDialog } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-edit-dialog";
import { RawMaterialDeleteDialog } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-delete-dialog";

export function RawMaterialMasterTable() {
  const { rawMaterials, meta, loading, page, setPage } = useRawMaterialMaster();

  return (
    <>
      <TableContainer
        loading={loading}
        empty={rawMaterials.length === 0 && !loading}
        emptyMessage="Belum ada bahan baku. Tambahkan bahan baku pertama Anda."
      >
        <TableHeader
          gridCols="grid-cols-[3fr_1fr_120px]"
          columns={[{ label: "Nama" }, { label: "Satuan" }, { label: "Aksi", align: "right" }]}
        />
        {rawMaterials.map((item) => (
          <RawMaterialMasterRow key={item.id} item={item} />
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={rawMaterials.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </TableContainer>

      <RawMaterialEditDialog />
      <RawMaterialDeleteDialog />
    </>
  );
}
