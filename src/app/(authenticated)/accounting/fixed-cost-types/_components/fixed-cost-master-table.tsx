"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { useFixedCostMaster } from "@/app/(authenticated)/accounting/fixed-cost-types/_providers/fixed-cost-master-provider";
import { FixedCostMasterRow } from "@/app/(authenticated)/accounting/fixed-cost-types/_components/fixed-cost-master-row";
import { FixedCostMasterCard } from "@/app/(authenticated)/accounting/fixed-cost-types/_components/fixed-cost-master-card";
import { FixedCostEditDialog } from "@/app/(authenticated)/accounting/fixed-cost-types/_components/fixed-cost-edit-dialog";
import { FixedCostDeleteDialog } from "@/app/(authenticated)/accounting/fixed-cost-types/_components/fixed-cost-delete-dialog";

export function FixedCostMasterTable() {
  const { fixedCosts, meta, loading, page, setPage } = useFixedCostMaster();

  return (
    <>
      <TableContainer
        loading={loading}
        empty={fixedCosts.length === 0 && !loading}
        emptyMessage="Belum ada biaya tetap. Tambahkan jenis biaya pertama Anda."
      >
        <TableHeader
          className="grid-cols-[1fr_120px]"
          columns={[{ label: "Nama Biaya" }, { label: "Aksi", align: "right" }]}
          hideOnMobile
        />

        {/* Desktop: grid rows (lg and up) */}
        <div className="hidden lg:block">
          {fixedCosts.map((item) => (
            <FixedCostMasterRow key={item.id} item={item} />
          ))}
        </div>

        {/* Mobile: stacked cards (below lg) */}
        <div className="lg:hidden">
          {fixedCosts.map((item) => (
            <FixedCostMasterCard key={item.id} item={item} />
          ))}
        </div>
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={fixedCosts.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </TableContainer>

      <FixedCostEditDialog />
      <FixedCostDeleteDialog />
    </>
  );
}
