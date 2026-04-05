"use client";

import { createContext, useContext, useState } from "react";
import { PaginationMeta } from "@/core/resources/paginated";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";
import { useListPurchases } from "@/features/purchasing/presentations/hooks/use-list-purchases";

type PurchaseListContextValue = {
  purchases: PurchaseEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  page: number;
  deletingItem: PurchaseEntity | null;
  setPage: (page: number) => void;
  setDeletingItem: (item: PurchaseEntity | null) => void;
};

const PurchaseListContext = createContext<PurchaseListContextValue | null>(null);

export function usePurchaseList() {
  const context = useContext(PurchaseListContext);
  if (!context) throw new Error("usePurchaseList must be used within PurchaseListProvider");
  return context;
}

type PurchaseListProviderProps = {
  children: React.ReactNode;
};

export function PurchaseListProvider({ children }: PurchaseListProviderProps) {
  const [page, setPage] = useState(1);
  const [deletingItem, setDeletingItem] = useState<PurchaseEntity | null>(null);

  const result = useListPurchases({ page, limit: 10 });

  const purchases = result.purchases ?? [];
  const meta = result.meta ?? null;

  return (
    <PurchaseListContext.Provider
      value={{
        purchases,
        meta,
        loading: result.loading,
        page,
        deletingItem,
        setPage,
        setDeletingItem,
      }}
    >
      {children}
    </PurchaseListContext.Provider>
  );
}
