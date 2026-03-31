"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { PaginationMeta } from "@/core/resources/paginated";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingEntityTypeEntity } from "@/features/accounting/domain/entities/coa-mapping-entity-type";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { useListCoaMappingEntityType } from "@/features/accounting/presentations/hooks/use-list-coa-mapping-entity-type";
import { useListCoaMapping } from "@/features/accounting/presentations/hooks/use-list-coa-mapping";
import { useListLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-ledger-accounts";
import { useCreateCoaMapping } from "@/features/accounting/presentations/hooks/use-create-coa-mapping";
import { useUpdateCoaMapping } from "@/features/accounting/presentations/hooks/use-update-coa-mapping";
import { useDeleteCoaMapping } from "@/features/accounting/presentations/hooks/use-delete-coa-mapping";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

type GroupedMappings = Record<string, CoaMappingEntity[]>;

type CoaMappingsContextValue = {
  entityTypes: CoaMappingEntityTypeEntity[];
  groupedMappings: GroupedMappings;
  meta: PaginationMeta | null;
  accounts: LedgerAccountEntity[];
  loading: boolean;
  editingMapping: CoaMappingEntity | null;
  deletingMapping: CoaMappingEntity | null;
  setEditingMapping: (mapping: CoaMappingEntity | null) => void;
  setDeletingMapping: (mapping: CoaMappingEntity | null) => void;
  handleCreate: (entityType: string, debitAccountId: string, creditAccountId: string) => Promise<void>;
  handleUpdate: (id: string, debitAccountId: string, creditAccountId: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
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
  const { showToast } = useToast();
  const [editingMapping, setEditingMapping] = useState<CoaMappingEntity | null>(null);
  const [deletingMapping, setDeletingMapping] = useState<CoaMappingEntity | null>(null);

  const { entityTypes, loading: loadingEntityTypes } = useListCoaMappingEntityType();
  const { mappings, meta, loading: loadingMappings } = useListCoaMapping({ limit: 100 });
  const { accounts, loading: loadingAccounts } = useListLedgerAccounts({ limit: 100 });

  const { trigger: createMapping } = useCreateCoaMapping();
  const { trigger: updateMapping } = useUpdateCoaMapping();
  const { trigger: deleteMapping } = useDeleteCoaMapping();

  const loading = loadingEntityTypes || loadingMappings || loadingAccounts;

  const groupedMappings = useMemo(() => {
    if (!mappings) return {};
    return mappings.reduce<GroupedMappings>((acc, mapping) => {
      const key = mapping.entityType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(mapping);
      return acc;
    }, {});
  }, [mappings]);

  const handleCreate = async (entityType: string, debitAccountId: string, creditAccountId: string) => {
    try {
      await createMapping({ entityType, debitAccountId, creditAccountId });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_COA_MAPPINGS);
      showToast("Pemetaan akun berhasil ditambahkan", "success");
    } catch {
      showToast("Gagal menambahkan pemetaan akun", "error");
    }
  };

  const handleUpdate = async (id: string, debitAccountId: string, creditAccountId: string) => {
    try {
      await updateMapping({ id, debitAccountId, creditAccountId });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_COA_MAPPINGS);
      showToast("Pemetaan akun berhasil diubah", "success");
      setEditingMapping(null);
    } catch {
      showToast("Gagal mengubah pemetaan akun", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMapping({ id });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_COA_MAPPINGS);
      showToast("Pemetaan akun berhasil dihapus", "success");
      setDeletingMapping(null);
    } catch {
      showToast("Gagal menghapus pemetaan akun", "error");
    }
  };

  return (
    <CoaMappingsContext.Provider
      value={{
        entityTypes: entityTypes ?? [],
        groupedMappings,
        meta,
        accounts,
        loading,
        editingMapping,
        deletingMapping,
        setEditingMapping,
        setDeletingMapping,
        handleCreate,
        handleUpdate,
        handleDelete,
      }}
    >
      {children}
    </CoaMappingsContext.Provider>
  );
}
