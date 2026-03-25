"use client";

import { createContext, useContext, useState } from "react";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { PaginationMeta } from "@/core/resources/paginated";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { useListRawMaterials } from "@/features/raw-material/presentations/hooks/use-list-raw-materials";

type RawMaterialMasterContextValue = {
  rawMaterials: RawMaterialEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  search: string;
  page: number;
  editingItem: RawMaterialEntity | null;
  deletingItem: RawMaterialEntity | null;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  setEditingItem: (item: RawMaterialEntity | null) => void;
  setDeletingItem: (item: RawMaterialEntity | null) => void;
};

const RawMaterialMasterContext = createContext<RawMaterialMasterContextValue | null>(null);

export function useRawMaterialMaster() {
  const context = useContext(RawMaterialMasterContext);
  if (!context) throw new Error("useRawMaterialMaster must be used within RawMaterialMasterProvider");
  return context;
}

type RawMaterialMasterProviderProps = {
  children: React.ReactNode;
};

export function RawMaterialMasterProvider({ children }: RawMaterialMasterProviderProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<RawMaterialEntity | null>(null);
  const [deletingItem, setDeletingItem] = useState<RawMaterialEntity | null>(null);

  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const { rawMaterials, meta, loading } = useListRawMaterials({ page, limit: 10, search: searchQuery });

  return (
    <RawMaterialMasterContext.Provider
      value={{
        rawMaterials,
        meta,
        loading,
        search,
        page,
        editingItem,
        deletingItem,
        setSearch,
        setPage,
        setEditingItem,
        setDeletingItem,
      }}
    >
      {children}
    </RawMaterialMasterContext.Provider>
  );
}
