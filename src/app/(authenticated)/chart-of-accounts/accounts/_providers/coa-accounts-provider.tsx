"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { useListLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-ledger-accounts";

type CoaAccountsContextValue = {
  // Filtered accounts for display (tenant-only when showSeeded=false)
  accounts: LedgerAccountEntity[];
  // All loaded accounts (used for parent name resolution)
  allAccounts: LedgerAccountEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ServerError | null;
  page: number;
  setPage: (page: number) => void;
  search: string;
  setSearch: (search: string) => void;
  showSeeded: boolean;
  setShowSeeded: (show: boolean) => void;
  creatingOpen: boolean;
  setCreatingOpen: (open: boolean) => void;
  editingItem: LedgerAccountEntity | null;
  setEditingItem: (item: LedgerAccountEntity | null) => void;
  deletingItem: LedgerAccountEntity | null;
  setDeletingItem: (item: LedgerAccountEntity | null) => void;
};

const CoaAccountsContext = createContext<CoaAccountsContextValue | null>(null);

export function useCoaAccounts() {
  const context = useContext(CoaAccountsContext);
  if (!context) throw new Error("useCoaAccounts must be used within CoaAccountsProvider");
  return context;
}

type CoaAccountsProviderProps = {
  children: React.ReactNode;
};

export function CoaAccountsProvider({ children }: CoaAccountsProviderProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showSeeded, setShowSeeded] = useState(true);
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LedgerAccountEntity | null>(null);
  const [deletingItem, setDeletingItem] = useState<LedgerAccountEntity | null>(null);

  const { accounts: rawAccounts, meta, loading, error } = useListLedgerAccounts({
    page,
    limit: 100,
    search: search.trim() || undefined,
  });

  // Tenant-only filter: exclude system accounts when toggle is off
  const accounts = useMemo<LedgerAccountEntity[]>(() => {
    if (showSeeded) return rawAccounts ?? [];
    return (rawAccounts ?? []).filter((a) => !a.isSystem);
  }, [rawAccounts, showSeeded]);

  return (
    <CoaAccountsContext.Provider
      value={{
        accounts,
        allAccounts: rawAccounts ?? [],
        meta,
        loading,
        error,
        page,
        setPage,
        search,
        setSearch,
        showSeeded,
        setShowSeeded,
        creatingOpen,
        setCreatingOpen,
        editingItem,
        setEditingItem,
        deletingItem,
        setDeletingItem,
      }}
    >
      {children}
    </CoaAccountsContext.Provider>
  );
}
