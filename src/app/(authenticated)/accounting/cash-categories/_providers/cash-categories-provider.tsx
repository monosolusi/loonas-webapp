"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginationMeta } from "@/core/resources/paginated";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { useListCashCategories } from "@/features/accounting/presentations/hooks/use-list-cash-category";
import { useUpdateCashCategory } from "@/features/accounting/presentations/hooks/use-update-cash-category";
import { useDeleteCashCategory } from "@/features/accounting/presentations/hooks/use-delete-cash-category";
import { filterCashCategories } from "@/app/(authenticated)/accounting/cash-categories/_utils/filter-cash-categories";

type CashCategoriesContextValue = {
  direction: CashEntryDirection | undefined;
  onDirectionChange: (direction: CashEntryDirection | undefined) => void;
  search: string;
  onSearchChange: (value: string) => void;
  /** Unfiltered count from the server — the header subtitle (search filters client-side only). */
  meta: PaginationMeta | null;
  /** The direction-filtered list after client-side search. */
  filteredCategories: CashCategoryEntity[];
  shellState: ReportShellState;
  isLoadingPage: boolean;
  pageError: ServerError | null;
  onRetry: () => void;
  editingCategory: CashCategoryEntity | null;
  openEdit: (category: CashCategoryEntity) => void;
  closeEdit: () => void;
  deletingCategory: CashCategoryEntity | null;
  openDelete: (category: CashCategoryEntity) => void;
  closeDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
  /** Server copy for a failed update — rendered inside the edit dialog, which stays open. */
  editError: ServerError | null;
  /** Server copy for a failed delete — rendered in the delete dialog's warning slot. */
  deleteError: ServerError | null;
  submitEdit: (args: { name: string; accountId: string | null }) => void;
  submitDelete: () => void;
};

const CashCategoriesContext = createContext<CashCategoriesContextValue | null>(null);

export function useCashCategoriesProvider(): CashCategoriesContextValue {
  const ctx = useContext(CashCategoriesContext);
  if (!ctx) throw new Error("useCashCategoriesProvider must be used within CashCategoriesProvider");
  return ctx;
}

type CashCategoriesProviderProps = {
  children: React.ReactNode;
};

/**
 * Mirrors `cash-entries-filters.ts::parseDirectionParam`: any value other than the two live
 * enum members resolves to `undefined` ("Semua") and never throws on a malformed URL. Kept
 * local rather than imported from the sibling page's `_utils` — a page-level util module is
 * not shared surface.
 */
function parseDirectionParam(raw: string | null): CashEntryDirection | undefined {
  if (raw === CashEntryDirection.In) return CashEntryDirection.In;
  if (raw === CashEntryDirection.Out) return CashEntryDirection.Out;
  return undefined;
}

function asServerError(err: unknown): ServerError {
  return err instanceof ServerError ? err : new ServerError(ErrorCodes.UNKNOWN);
}

export function CashCategoriesProvider({ children }: CashCategoriesProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { trigger: updateCategory, isMutating: isUpdating } = useUpdateCashCategory();
  const { trigger: deleteCategory, isMutating: isDeleting } = useDeleteCashCategory();

  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState<CashCategoryEntity | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CashCategoryEntity | null>(null);
  const [editError, setEditError] = useState<ServerError | null>(null);
  const [deleteError, setDeleteError] = useState<ServerError | null>(null);

  // `direction` derives straight from the URL param — pure and cheap, and no local mirror means
  // back/forward navigation can never lag a commit behind the address bar.
  const directionParam = searchParams.get("direction");
  const direction = useMemo(() => parseDirectionParam(directionParam), [directionParam]);

  const hookResult = useListCashCategories({ direction });

  const onDirectionChange = useCallback(
    (next: CashEntryDirection | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("direction", next);
      else params.delete("direction");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const onRetry = useCallback(() => {
    // A bound SWR `mutate()` refetches and rethrows on failure; swallowing keeps the error UI
    // (SWR leaves `error` populated) instead of rejecting unhandled out of this onClick.
    void hookResult.refresh?.()?.catch(() => {});
  }, [hookResult.refresh]);

  const categories = hookResult.categories ?? [];
  const filteredCategories = useMemo(() => filterCashCategories(categories, search), [categories, search]);
  const meta = hookResult.meta ?? null;

  const hasData = hookResult.categories !== null;

  const shellState = useMemo((): ReportShellState => {
    if (hookResult.error && !hasData) return "error";
    if (hasData) return filteredCategories.length === 0 ? "empty" : "success";
    return "loading";
  }, [hookResult.error, hasData, filteredCategories.length]);

  // A failed refetch under keepPreviousData must surface above the state switch, never silently
  // render stale rows — non-null only alongside "empty"/"success", never "error".
  const pageError = hasData && hookResult.error ? hookResult.error : null;
  const isLoadingPage = hookResult.isLoadingPage;

  const openEdit = useCallback((category: CashCategoryEntity) => {
    setEditError(null);
    setEditingCategory(category);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingCategory(null);
    setEditError(null);
  }, []);

  const openDelete = useCallback((category: CashCategoryEntity) => {
    setDeleteError(null);
    setDeletingCategory(category);
  }, []);

  const closeDelete = useCallback(() => {
    setDeletingCategory(null);
    setDeleteError(null);
  }, []);

  // Both submit handlers catch everything and turn it into dialog state — an async handler that
  // throws becomes an unhandled rejection the user never sees.
  const submitEdit = useCallback(
    async ({ name, accountId }: { name: string; accountId: string | null }) => {
      if (!editingCategory || !name.trim() || isUpdating) return;
      setEditError(null);
      try {
        // `accountId: null` means the picker was left untouched — omit the key so the server
        // keeps the current account (partial update: absent = unchanged).
        await updateCategory({ id: editingCategory.id, name: name.trim(), accountId: accountId ?? undefined });
        showToast("Kategori kas berhasil diubah", "success");
        setEditingCategory(null);
      } catch (err) {
        setEditError(asServerError(err));
      }
    },
    [editingCategory, isUpdating, updateCategory, showToast],
  );

  const submitDelete = useCallback(async () => {
    if (!deletingCategory || isDeleting) return;
    setDeleteError(null);
    try {
      await deleteCategory({ id: deletingCategory.id });
      showToast("Kategori kas berhasil dihapus", "success");
      setDeletingCategory(null);
    } catch (err) {
      // A 409 CASH_CATEGORY_REFERENCED keeps the dialog open and shows the server copy in its
      // warning slot — the list itself cannot know referenced-ness up front.
      setDeleteError(asServerError(err));
    }
  }, [deletingCategory, isDeleting, deleteCategory, showToast]);

  return (
    <CashCategoriesContext.Provider
      value={{
        direction,
        onDirectionChange,
        search,
        onSearchChange,
        meta,
        filteredCategories,
        shellState,
        isLoadingPage,
        pageError,
        onRetry,
        editingCategory,
        openEdit,
        closeEdit,
        deletingCategory,
        openDelete,
        closeDelete,
        isUpdating,
        isDeleting,
        editError,
        deleteError,
        submitEdit,
        submitDelete,
      }}
    >
      {children}
    </CashCategoriesContext.Provider>
  );
}
