"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { useListProductsForSale } from "@/features/product/presentations/hooks/use-list-products-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { CategoryChips } from "@/app/(pos)/pos/_components/category-chips";
import { ProductPickerBody } from "@/app/(pos)/pos/_components/product-picker-body";
import { PickerRow } from "@/app/(pos)/pos/_components/product-picker-body-list";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

const PAGE_SIZE = 50;

export function ProductPicker() {
  const { search, setSearch, selectedCategoryId, drilldownProduct, enterDrilldown, exitDrilldown, addItem } = usePos();

  const debouncedSearch = useDebounce(search, 250);
  const isDrilldown = drilldownProduct !== null;

  const productsState = useListProductsForSale({
    search: !isDrilldown ? debouncedSearch || undefined : undefined,
    categoryIds: !isDrilldown && selectedCategoryId ? [selectedCategoryId] : undefined,
    limit: PAGE_SIZE,
  });

  const filteredVariants = useMemo<VariantForSaleEntity[]>(() => {
    if (!drilldownProduct) return [];
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return drilldownProduct.variants;
    return drilldownProduct.variants.filter((v) => v.name.toLowerCase().includes(q));
  }, [drilldownProduct, debouncedSearch]);

  const visibleRows = useMemo<PickerRow[]>(() => {
    if (isDrilldown) return filteredVariants.map((v) => ({ kind: "variant", variant: v }));
    if (productsState.status !== "loaded") return [];
    return productsState.products.map((p) => ({ kind: "product", product: p }));
  }, [isDrilldown, filteredVariants, productsState]);

  const [highlight, setHighlight] = useState(0);
  useEffect(() => {
    setHighlight(0);
  }, [visibleRows.length, isDrilldown]);

  const activate = (idx: number) => {
    const row = visibleRows[idx];
    if (!row) return;
    if (row.kind === "variant" && drilldownProduct) {
      if (!row.variant.isAvailable) return;
      addItem(drilldownProduct, row.variant);
      return;
    }
    if (row.kind === "product") {
      const product = row.product;
      if (!product.hasAvailableVariant) return;
      if (product.variants.length === 1) {
        addItem(product, product.variants[0]);
      } else if (product.variants.length > 1) {
        enterDrilldown(product);
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(visibleRows.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      activate(highlight);
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (search) setSearch("");
      else if (isDrilldown) exitDrilldown();
    }
  };

  const isLoading = !isDrilldown && productsState.status === "loading";
  const error = !isDrilldown && productsState.status === "error" ? productsState.error : null;

  return (
    <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white">
      <div className="flex flex-col gap-y-3 border-b border-b-neutral-100 px-4 pt-4 pb-3">
        <TextInput
          key={isDrilldown ? "drilldown" : "main"}
          label=""
          placeholder="Cari produk · ketik nama / SKU / scan…"
          value={search}
          onChange={setSearch}
          onKeyDown={onKeyDown}
          autoFocus
          leftIcon={<MagnifyingGlassIcon className="size-5 text-neutral-300" />}
        />
        {isDrilldown && drilldownProduct && (
          <button
            type="button"
            onClick={exitDrilldown}
            className="flex flex-row items-center gap-x-2 self-start text-sm leading-5 text-primary-300 hover:underline"
          >
            <ChevronLeftIcon className="size-4" />
            <span>Semua produk · {drilldownProduct.name}</span>
          </button>
        )}
        {!isDrilldown && <CategoryChips />}
      </div>

      <div className="flex-1 overflow-y-auto">
        <ProductPickerBody
          error={error}
          loading={isLoading}
          isDrilldown={isDrilldown}
          rows={visibleRows}
          highlight={highlight}
          onActivate={activate}
        />
      </div>

      <div className="border-t border-t-neutral-100 px-4 py-2 text-xs text-neutral-300">
        ↑↓ pilih · ⏎ tambah · esc {isDrilldown ? "kembali" : "batal"}
      </div>
    </div>
  );
}
