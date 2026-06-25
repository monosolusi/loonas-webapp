"use client";

import clsx from "clsx";
import { useMemo } from "react";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { useProfitabilityDashboard } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";
import { ProfitabilityTableRow } from "@/app/(authenticated)/finance/profitability/_components/profitability-table-row";

const COLUMNS = [
  { label: "PRODUK", align: "left" as const },
  { label: "HPP/UNIT", align: "right" as const },
  { label: "HARGA JUAL", align: "right" as const },
  { label: "REKOMENDASI HARGA", align: "right" as const },
  { label: "LABA KOTOR", align: "right" as const },
  { label: "MARGIN", align: "right" as const },
  { label: "STATUS", align: "left" as const },
];

export function ProfitabilityTable() {
  const { products, meta, loading, error, page, search, setPage, setSearch, onRetry } = useProfitabilityDashboard();

  const variantPairs = useMemo(() => {
    const pairs: { productId: string; variantId: string; productName: string; variantName: string }[] = [];
    for (const product of products) {
      for (const variant of product.variants) {
        pairs.push({
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantName: variant.name,
        });
      }
    }
    return pairs;
  }, [products]);

  const isEmpty = !loading && !error && products.length === 0 && search === "";
  const isFilteredEmpty = !loading && !error && variantPairs.length === 0 && search !== "";

  return (
    <div className="flex flex-col gap-y-4">
      <TableToolbar>
        <TableSearch
          value={search}
          onChange={setSearch}
          placeholder="Cari produk atau varian..."
        />
      </TableToolbar>

      <div className="overflow-x-auto">
        <TableContainer
          loading={loading}
          error={error}
          empty={isEmpty}
          emptyMessage="Belum ada produk."
          filteredEmpty={isFilteredEmpty}
          filteredEmptyMessage="Tidak ada produk yang cocok dengan pencarian."
        >
          <div className="grid border-b border-neutral-100 bg-neutral-50 px-6 py-3 [grid-template-columns:var(--grid-profitability-cols)]">
            {COLUMNS.map((col) => (
              <span
                key={col.label}
                className={clsx(
                  "text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase",
                  col.align === "right" && "text-right",
                )}
              >
                {col.label}
              </span>
            ))}
          </div>

          <div>
            {products.map((product) =>
              product.variants.map((variant) => (
                <ProfitabilityTableRow key={`${product.id}-${variant.id}`} product={product} variant={variant} />
              )),
            )}
          </div>

          {meta && (
            <TablePagination
              displayedCount={variantPairs.length}
              meta={{ page: meta.page, limit: meta.limit, total: meta.total, totalPages: meta.totalPages }}
              currentPage={page}
              onPageChange={setPage}
              countLabel="varian"
            />
          )}
        </TableContainer>
      </div>

      {error && (
        <div className="flex justify-center">
          <SecondaryButton outlined onClick={onRetry} label="Coba Lagi" />
        </div>
      )}
    </div>
  );
}
