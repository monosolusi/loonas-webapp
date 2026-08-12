"use client";

import { useMemo, useState } from "react";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { TabFilter } from "@/core/presentations/components/tab-filter";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { StockAdjustmentDialog } from "@/features/inventory/presentations/components/stock-adjustment-dialog";
import { STOCK_ITEM_ROW_GRID } from "@/features/inventory/presentations/components/stock-item-table-row";
import { StockAdjustmentItemRow } from "@/app/(authenticated)/inventory/stock-adjustment/_components/stock-adjustment-item-row";

const INVENTORY_ADJUSTMENT_FEATURE = "inventory_adjustment";

// Server-side `type` filter. `undefined` omits it entirely.
const TYPE_FILTERS = [
  { label: "Semua", value: undefined },
  { label: "Bahan Baku", value: StockItemType.RAW_MATERIAL },
  { label: "Produk Jadi", value: StockItemType.FINISHED_GOODS },
] as const;

const TYPE_TABS = TYPE_FILTERS.map((filter) => filter.label);

export function StockAdjustmentListImpl() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeIndex, setTypeIndex] = useState(0);
  const [adjustingItem, setAdjustingItem] = useState<StockItemEntity | null>(null);

  const { account } = useGetCurrentAccount();
  const canAdjust = account?.hasFeature(INVENTORY_ADJUSTMENT_FEATURE) ?? false;

  const { stockItems, meta, loading, error } = useListStockItems({
    type: TYPE_FILTERS[typeIndex].value,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  // GET /inventory/stock-items has no server search — only `type`, `page` and
  // `limit`. The type tabs are therefore server-side, while search filters the
  // loaded page client-side by item name, variant name, or SKU.
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
        <ListPageHeader title="Penyesuaian Stok" subtitle={subtitle} />

        <TableToolbar>
          <div className="flex flex-row flex-wrap items-center gap-3">
            <TabFilter
              tabs={TYPE_TABS}
              selectedIndex={typeIndex}
              onChange={(index) => {
                setTypeIndex(index);
                setPage(1);
              }}
            />
          </div>
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
          empty={(stockItems?.length ?? 0) === 0 && !loading}
          emptyMessage="Belum ada item stok."
          filteredEmpty={isFilteredEmpty}
        >
          {header}
          {filteredItems.map((item) => (
            <StockAdjustmentItemRow key={item.id} stockItem={item} canAdjust={canAdjust} onAdjust={setAdjustingItem} />
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
      {canAdjust && <StockAdjustmentDialog stockItem={adjustingItem} onClose={() => setAdjustingItem(null)} />}
    </>
  );
}
