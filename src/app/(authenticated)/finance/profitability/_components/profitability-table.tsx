"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useProfitabilityDashboard } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";
import { ProfitabilityTableRow } from "@/app/(authenticated)/finance/profitability/_components/profitability-table-row";

const COLUMNS = [
  { label: "Produk", align: "left" as const },
  { label: "HPP / Harga Jual", align: "center" as const },
  { label: "Rekomendasi Harga", align: "right" as const },
  { label: "Laba Kotor", align: "center" as const },
  { label: "Status", align: "left" as const },
];

export function ProfitabilityTable() {
  const { products, meta, loading, error, page, search, setPage, onRetry } = useProfitabilityDashboard();

  const isEmpty = !loading && !error && products.length === 0 && search === "";
  const isFilteredEmpty = !loading && !error && products.length === 0 && search !== "";

  return (
    <div className="flex flex-col gap-y-4">
      <TableContainer
        loading={loading}
        error={error}
        empty={isEmpty}
        emptyMessage="Belum ada produk."
        filteredEmpty={isFilteredEmpty}
        filteredEmptyMessage="Tidak ada produk yang cocok dengan pencarian."
      >
        <div className="overflow-x-auto">
          <div className="min-w-[940px]">
            <TableHeader columns={COLUMNS} className="[grid-template-columns:var(--grid-profitability-cols)]" />

            <div>
              {products.map((product) =>
                product.variants.map((variant) => (
                  <ProfitabilityTableRow key={`${product.id}-${variant.id}`} product={product} variant={variant} />
                )),
              )}
            </div>
          </div>
        </div>

        {meta && meta.totalPages > 1 && (
          <TablePagination
            displayedCount={products.length}
            meta={meta}
            currentPage={page}
            onPageChange={setPage}
            countLabel="produk"
          />
        )}
      </TableContainer>

      {error && (
        <div className="flex justify-center">
          <SecondaryButton outlined onClick={onRetry} label="Coba Lagi" />
        </div>
      )}
    </div>
  );
}
