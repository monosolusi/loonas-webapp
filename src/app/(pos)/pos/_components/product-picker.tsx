"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Spinner } from "@/core/presentations/components/spinner";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { useListProductsForSale } from "@/features/product/presentations/hooks/use-list-products-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { matchBySku, SkuMatch } from "@/features/product/domain/helpers/match-by-sku";
import { CategoryChips } from "@/app/(pos)/pos/_components/category-chips";
import { ProductPickerBody } from "@/app/(pos)/pos/_components/product-picker-body";
import { PickerRow } from "@/app/(pos)/pos/_components/product-picker-body-list";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";
import { RowAction, resolveRowAction } from "@/app/(pos)/pos/_utils/resolve-row-action";
import { classifyCommit, KeystrokeSample } from "@/app/(pos)/pos/_utils/scan-detector";

const PAGE_SIZE = 50;

/** An Enter commit still waiting for the flushed query to settle before it can be resolved. */
type PendingCommit = { term: string; isScan: boolean };

export function ProductPicker() {
  const { search, setSearch, selectedCategoryId, drilldownProduct, enterDrilldown, exitDrilldown, addItem } = usePos();
  const { showToast } = useToast();

  const debouncedSearch = useDebounce(search, 250);
  const isDrilldown = drilldownProduct !== null;

  // The term actually sent to /products/for-sale. Normally the debounced value, so typing
  // doesn't fire a request per keystroke. An Enter commit flushes this to the live `search`
  // immediately (see `commit()` below) — a barcode scanner's near-instant Enter must never
  // resolve against a result set that still reflects a stale, previous term.
  const [flushedTerm, setFlushedTerm] = useState<string | null>(null);
  const queryTerm = flushedTerm ?? debouncedSearch;

  const productsState = useListProductsForSale({
    search: !isDrilldown ? queryTerm || undefined : undefined,
    categoryIds: !isDrilldown && selectedCategoryId ? [selectedCategoryId] : undefined,
    limit: PAGE_SIZE,
  });

  // Drilldown filtering is a pure local array filter — no network round trip — so it reads the
  // live `search` directly instead of the debounced value, which means it has no staleness
  // window to begin with. Matches SKU too (not just name), consistent with the "nama / SKU /
  // scan" placeholder below.
  const filteredVariants = useMemo<VariantForSaleEntity[]>(() => {
    if (!drilldownProduct) return [];
    const q = search.trim().toLowerCase();
    if (!q) return drilldownProduct.variants;
    return drilldownProduct.variants.filter(
      (v) => v.name.toLowerCase().includes(q) || (v.sku !== null && v.sku.toLowerCase().includes(q)),
    );
  }, [drilldownProduct, search]);

  const visibleRows = useMemo<PickerRow[]>(() => {
    if (isDrilldown) return filteredVariants.map((v) => ({ kind: "variant", variant: v }));
    if (productsState.status !== "loaded") return [];
    return productsState.products.map((p) => ({ kind: "product", product: p }));
  }, [isDrilldown, filteredVariants, productsState]);

  // Identity of the current result set (which rows, not merely how many) plus which mode it
  // belongs to — two different result sets of the same size (e.g. two different searches that
  // both return 20 items) must still be treated as different sets.
  const rowsSignature = useMemo(() => {
    const prefix = isDrilldown ? "d" : "l";
    const ids = visibleRows.map((row) => (row.kind === "product" ? `p:${row.product.id}` : `v:${row.variant.id}`));
    return `${prefix}:${ids.join("|")}`;
  }, [isDrilldown, visibleRows]);

  const [highlight, setHighlight] = useState(0);
  // Reset the highlight synchronously, during render, whenever the result-set identity changes
  // — not in a `useEffect`. An effect-based reset would still leave the OLD `highlight` value
  // in scope for any effect that runs in the same commit before the reset lands (in particular
  // the pending-commit resolver below), reintroducing exactly the "acts on a stale index" defect
  // class this component exists to fix. This is React's documented pattern for adjusting state
  // when a derived value changes: calling `set...` during render immediately re-renders with the
  // corrected value before any effects run.
  const [settledRowsSignature, setSettledRowsSignature] = useState(rowsSignature);
  if (rowsSignature !== settledRowsSignature) {
    setSettledRowsSignature(rowsSignature);
    setHighlight(0);
  }

  // Auto-focus the search only where a physical keyboard is expected (desktop),
  // so mobile doesn't pop the on-screen keyboard on load and cover the catalog.
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    searchRef.current?.querySelector("input")?.focus();
  }, [isDrilldown]);

  // A commit still waiting for `queryTerm`'s result set to settle before it can be resolved.
  const [pendingCommit, setPendingCommit] = useState<PendingCommit | null>(null);

  // Scanner-vs-human classification buffer for the keystrokes building up the CURRENT typed
  // value. Character keydowns only — Enter/Escape/Backspace are handled separately in
  // `onKeyDown` below.
  const keystrokesRef = useRef<KeystrokeSample[]>([]);

  // Abort any in-flight commit resolution the moment the field changes to a different term (the
  // user kept typing past a commit), and reset the scan-timing buffer whenever the field empties
  // (covers the commit-success clear, Escape-clear, and drilldown enter/exit, which all clear
  // `search`).
  useEffect(() => {
    setFlushedTerm(null);
    setPendingCommit((prev) => (prev && prev.term !== search.trim() ? null : prev));
    if (search === "") keystrokesRef.current = [];
  }, [search]);

  // A commit resolved against the previous (non-)drilldown context is meaningless once that
  // context changes.
  useEffect(() => {
    setPendingCommit(null);
  }, [isDrilldown]);

  // Carries out a decision made by `resolveRowAction` — the decision itself lives in that pure
  // module so the keyboard/click path and the scan path cannot drift apart.
  const applyRowAction = (result: RowAction) => {
    if (result.action === "noop") return;
    if (result.action === "drilldown") {
      enterDrilldown(result.product);
      setSearch("");
      return;
    }
    addItem(result.product, result.variant);
    setSearch("");
  };

  const activate = (idx: number) => {
    const row = visibleRows[idx];
    if (!row) return;
    if (row.kind === "variant") {
      if (!drilldownProduct) return;
      applyRowAction(resolveRowAction({ kind: "variant", product: drilldownProduct, variant: row.variant }));
      return;
    }
    applyRowAction(resolveRowAction({ kind: "product", product: row.product }));
  };

  // Maps a resolved SKU match to a cart/navigation action. The domain helper (`matchBySku`)
  // deliberately knows nothing about carts or drilldown — this is where that mapping lives. The
  // variant/product arms delegate to the same `resolveRowAction` rule a row click uses, so an
  // unavailable variant is refused identically either way; only the `ambiguous` / `none` arms
  // below are scan-specific.
  const resolveSkuMatch = (match: SkuMatch, opts: { isScan: boolean; term: string; onFallback: () => void }) => {
    if (match.kind === "variant") {
      applyRowAction(resolveRowAction({ kind: "variant", product: match.product, variant: match.variant }));
      return;
    }
    if (match.kind === "product") {
      applyRowAction(resolveRowAction({ kind: "product", product: match.product }));
      return;
    }
    if (match.kind === "ambiguous") {
      // More than one product — or more than one variant of one product — carries this code.
      // The committed term keeps those candidates visible (it is how they were found), so
      // leaving the list up lets the cashier pick the right one instead of us silently guessing.
      return;
    }
    // match.kind === "none"
    if (opts.isScan) {
      showToast({
        title: `SKU "${opts.term}" tidak ditemukan`,
        description: "Cari produk secara manual, atau ulangi scan.",
        type: "error",
      });
      return;
    }
    opts.onFallback();
  };

  // Resolves a commit once the async product list settles to exactly the term that was
  // committed. Never fires for drilldown, which resolves synchronously inside `commit()` below
  // — a pure local filter has nothing to "settle".
  useEffect(() => {
    if (!pendingCommit || isDrilldown) return;
    if (queryTerm !== pendingCommit.term) return;
    if (productsState.status === "loading") return;
    if (productsState.status === "error") {
      setPendingCommit(null);
      return;
    }
    const match = matchBySku(productsState.products, pendingCommit.term);
    resolveSkuMatch(match, {
      isScan: pendingCommit.isScan,
      term: pendingCommit.term,
      onFallback: () => activate(highlight),
    });
    setPendingCommit(null);
  }, [pendingCommit, queryTerm, productsState.status, productsState.products, isDrilldown, highlight]);

  const commit = (isScan: boolean) => {
    const term = search.trim();

    if (isDrilldown && drilldownProduct) {
      if (!term) {
        activate(highlight);
        return;
      }
      const match = matchBySku([drilldownProduct], term);
      resolveSkuMatch(match, { isScan, term, onFallback: () => activate(highlight) });
      return;
    }

    if (!term) {
      activate(highlight);
      return;
    }

    // Flush the debounce and wait for the pending-commit effect above to see a settled result
    // set for exactly this term before resolving.
    setFlushedTerm(term);
    setPendingCommit({ term, isScan });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(visibleRows.length - 1, 0)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const isScan =
        classifyCommit([...keystrokesRef.current, { isEnter: true, timeStamp: e.timeStamp }]) === "scanner";
      keystrokesRef.current = [];
      commit(isScan);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      keystrokesRef.current = [];
      if (search) setSearch("");
      else if (isDrilldown) exitDrilldown();
      return;
    }
    if (e.key.length === 1) {
      // Single printable character — the only kind of keystroke a scanner emits.
      keystrokesRef.current.push({ isEnter: false, timeStamp: e.timeStamp });
    } else if (e.key === "Backspace" || e.key === "Delete") {
      // A real scan never edits mid-burst — a human doing so breaks the timing signal anyway.
      keystrokesRef.current = [];
    }
  };

  const isLoading = !isDrilldown && productsState.status === "loading";
  const isResolvingCommit = pendingCommit !== null;

  // A click that lands while a commit is still resolving would add its row directly AND leave the
  // pending resolver to add again a moment later — two cart lines from one intent. That window is
  // reachable in practice: re-scanning the same SKU for a second unit can hit the SWR cache, so
  // the rows are painted and clickable in the same render that queued the commit. Gated here, at
  // the pointer entry point only — the resolver's own human-typing fallback calls `activate`
  // directly and must still work while a commit is in flight. The input itself stays enabled so a
  // scanner firing the next code doesn't lose its keystrokes.
  const onRowActivate = (idx: number) => {
    if (isResolvingCommit) return;
    activate(idx);
  };
  const error = !isDrilldown && productsState.status === "error" ? productsState.error : null;

  return (
    <div className="flex h-full flex-col border-neutral-200 bg-white lg:rounded-lg lg:border">
      <div ref={searchRef} className="flex flex-col gap-y-3 border-b border-b-neutral-100 px-4 pt-4 pb-3">
        <TextInput
          key={isDrilldown ? "drilldown" : "main"}
          label=""
          placeholder="Cari produk · ketik nama / SKU / scan…"
          value={search}
          onChange={setSearch}
          onKeyDown={onKeyDown}
          aria-busy={isResolvingCommit}
          leftIcon={<MagnifyingGlassIcon className="size-5 text-neutral-300" />}
          rightIcon={isResolvingCommit ? <Spinner className="text-neutral-300" /> : undefined}
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
          onActivate={onRowActivate}
        />
      </div>

      <div className="hidden border-t border-t-neutral-100 px-4 py-2 text-xs text-neutral-300 lg:block">
        ↑↓ pilih · ⏎ tambah · pindai → sesuai SKU · esc {isDrilldown ? "kembali" : "batal"}
      </div>
    </div>
  );
}
