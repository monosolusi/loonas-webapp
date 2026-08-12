"use client";

import { useMemo, useState } from "react";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { useListNegativeStockItems } from "@/features/inventory/presentations/hooks/use-list-negative-stock-items";
import { StockAdjustmentDialog } from "@/features/inventory/presentations/components/stock-adjustment-dialog";
import { STOCK_ITEM_ROW_GRID } from "@/features/inventory/presentations/components/stock-item-table-row";
import { StockItemActionRow } from "@/features/inventory/presentations/components/stock-item-action-row";
import { INVENTORY_ADJUSTMENT_FEATURE } from "@/features/inventory/presentations/constants/feature-flags";

export function NegativeStockListImpl() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [adjustingItem, setAdjustingItem] = useState<StockItemEntity | null>(null);

  const { account } = useGetCurrentAccount();
  const canAdjust = account?.hasFeature(INVENTORY_ADJUSTMENT_FEATURE) ?? false;

  const { stockItems, meta, loading, error } = useListNegativeStockItems({ page, limit: DEFAULT_PAGE_SIZE });

  // The negative-stock endpoint has no server search — filter the loaded page
  // client-side by item name, variant name, or SKU.
  const filteredItems = useMemo(() => {
    if (!stockItems) return [];
    const query = search.trim().toLowerCase();
    if (!query) return stockItems;
    return stockItems.filter((item) => {
      return (
        item.itemName.toLowerCase().includes(query) ||
        (item.variantName?.toLowerCase().includes(query) ?? false) ||
        (item.sku?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [stockItems, search]);

  const isFilteredEmpty = !loading && !error && (stockItems?.length ?? 0) > 0 && filteredItems.length === 0;
  const isEmpty = (stockItems?.length ?? 0) === 0 && !loading;

  const subtitle = loading ? "Memuat..." : error ? "" : meta ? `${meta.total} item` : "";

  const header = (
    <TableHeader
      columns={[
        { label: "Item" },
        { label: "Tipe" },
        { label: "SKU" },
        { label: "Stok Terkini", align: "right" },
        { label: "Stok Min.", align: "right" },
        { label: "Aksi" },
      ]}
      className={STOCK_ITEM_ROW_GRID}
      hideOnMobile
    />
  );

  return (
    <>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <ListPageHeader title="Stok Negatif" subtitle={subtitle} />
          {/* Deictic copy ("berikut" = the rows below) — only true once rows are actually
              rendered. Gate on filteredItems, not isEmpty, so it never shows during loading,
              on error, on a filtered-empty result, or as a flash frame on confirmed-empty. */}
          {filteredItems.length > 0 && (
            <p className="text-sm leading-5 text-neutral-300">
              Item berikut tercatat minus — pilih aksi pada baris untuk memulihkan saldo.
            </p>
          )}
        </div>

        <TableToolbar>
          <div />
          <TableSearch
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Cari item, varian, atau SKU..."
          />
        </TableToolbar>

        <TableContainer
          loading={loading}
          error={!!error}
          empty={isEmpty}
          emptyMessage="Belum ada stok negatif."
          filteredEmpty={isFilteredEmpty}
        >
          {header}
          {filteredItems.map((item) => (
            <StockItemActionRow key={item.id} stockItem={item} canAdjust={canAdjust} onAdjust={setAdjustingItem} />
          ))}
          {meta && meta.totalPages > 1 && (
            <TablePagination
              displayedCount={filteredItems.length}
              meta={meta}
              currentPage={page}
              onPageChange={setPage}
              countLabel="item"
            />
          )}
        </TableContainer>
      </div>
      {/* Every item on this list is negative, so this always lands on the
          blocked dialog — that is intended: explain the block, don't hide the
          action that would otherwise trigger it. */}
      {canAdjust && <StockAdjustmentDialog stockItem={adjustingItem} onClose={() => setAdjustingItem(null)} />}
    </>
  );
}
