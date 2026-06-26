"use client";

import { useMemo } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { useProfitabilityDashboard } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";
import { ProfitabilityTableRow } from "@/app/(authenticated)/finance/profitability/_components/profitability-table-row";
import { ProfitabilitySummaryCard } from "@/app/(authenticated)/finance/profitability/_components/profitability-summary-card";

const COLUMNS = [
  { label: "PRODUK", align: "left" as const },
  { label: "HPP/UNIT", align: "right" as const },
  { label: "HARGA JUAL", align: "right" as const },
  { label: "REKOMENDASI HARGA", align: "right" as const },
  { label: "LABA KOTOR", align: "right" as const },
  { label: "MARGIN", align: "right" as const },
  { label: "STATUS", align: "center" as const },
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

  const totalVariants = useMemo(() => products.reduce((sum, product) => sum + product.variants.length, 0), [products]);

  const isEmpty = !loading && !error && products.length === 0 && search === "";
  const isFilteredEmpty = !loading && !error && variantPairs.length === 0 && search !== "";

  return (
    <div className="flex flex-col gap-y-6">
      <ProfitabilitySummaryCard total={totalVariants} profitable={null} atRisk={null} loading={loading} />

      <SectionCard title="Daftar Produk & Varian">
        <div className="flex flex-col gap-y-4">
          <TableToolbar>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Cari produk atau varian..."
            />
          </TableToolbar>

          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <TableContainer
              loading={loading}
              error={error}
              empty={isEmpty}
              emptyMessage="Belum ada produk."
              filteredEmpty={isFilteredEmpty}
              filteredEmptyMessage="Tidak ada produk yang cocok dengan pencarian."
            >
              <TableHeader columns={COLUMNS} className="[grid-template-columns:var(--grid-profitability-cols)]" />

              <div>
                {products.map((product) =>
                  product.variants.map((variant) => (
                    <ProfitabilityTableRow key={`${product.id}-${variant.id}`} product={product} variant={variant} />
                  )),
                )}
              </div>
            </TableContainer>
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

          {error && (
            <div className="flex justify-center">
              <SecondaryButton outlined onClick={onRetry} label="Coba Lagi" />
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
