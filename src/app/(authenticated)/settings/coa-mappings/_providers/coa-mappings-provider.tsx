"use client";

import { createContext, useContext } from "react";
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

  const loading = loadingEntityTypes || loadingMappings;

  return (
    <CoaMappingsContext.Provider
      value={{
        entityTypes: entityTypes ?? [],
        mappings,
        meta,
        loading,
      }}
    >
      {children}
    </CoaMappingsContext.Provider>
  );
}
