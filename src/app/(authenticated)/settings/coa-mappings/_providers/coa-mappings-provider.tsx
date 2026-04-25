"use client";

import { createContext, useContext, useState } from "react";
import { PaginationMeta } from "@/core/resources/paginated";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingEntityTypeEntity } from "@/features/accounting/domain/entities/coa-mapping-entity-type";
import { useListCoaMappingEntityType } from "@/features/accounting/presentations/hooks/use-list-coa-mapping-entity-type";
import { useListCoaMapping } from "@/features/accounting/presentations/hooks/use-list-coa-mapping";

type CoaMappingsContextValue = {
  entityTypes: CoaMappingEntityTypeEntity[];
  mappings: CoaMappingEntity[] | null;
  meta: PaginationMeta | null;
  loading: boolean;
  creatingOpen: boolean;
  editingItem: CoaMappingEntity | null;
  deletingItem: CoaMappingEntity | null;
  setCreatingOpen: (open: boolean) => void;
  setEditingItem: (item: CoaMappingEntity | null) => void;
  setDeletingItem: (item: CoaMappingEntity | null) => void;
};

const CoaMappingsContext = createContext<CoaMappingsContextValue | null>(null);

export function useCoaMappings() {
  const context = useContext(CoaMappingsContext);
  if (!context) throw new Error("useCoaMappings must be used within CoaMappingsProvider");
  return context;
}

type CoaMappingsProviderProps = {
  children: React.ReactNode;
};

export function CoaMappingsProvider({ children }: CoaMappingsProviderProps) {
  const { entityTypes, loading: loadingEntityTypes } = useListCoaMappingEntityType();
  const { mappings, meta, loading: loadingMappings } = useListCoaMapping({ limit: 100 });

  const [creatingOpen, setCreatingOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CoaMappingEntity | null>(null);
  const [deletingItem, setDeletingItem] = useState<CoaMappingEntity | null>(null);

  const loading = loadingEntityTypes || loadingMappings;

  return (
    <CoaMappingsContext.Provider
      value={{
        entityTypes: entityTypes ?? [],
        mappings,
        meta,
        loading,
        creatingOpen,
        editingItem,
        deletingItem,
        setCreatingOpen,
        setEditingItem,
        setDeletingItem,
      }}
    >
      {children}
    </CoaMappingsContext.Provider>
  );
}
