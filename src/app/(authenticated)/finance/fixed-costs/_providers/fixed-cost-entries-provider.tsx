"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { FIXED_COST_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/swr-keys";
import { FIXED_COST_ENTRY_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/fixed-cost-entry-swr-keys";
import { useListFixedCosts } from "@/features/fixed-cost/presentations/hooks/use-list-fixed-costs";
import { useListFixedCostEntriesByDate } from "@/features/fixed-cost/presentations/hooks/use-list-fixed-cost-entries-by-date";
import { useCreateFixedCostEntry } from "@/features/fixed-cost/presentations/hooks/use-create-fixed-cost-entry";
import { useUpdateFixedCostEntry } from "@/features/fixed-cost/presentations/hooks/use-update-fixed-cost-entry";
import { useDeleteFixedCostEntry } from "@/features/fixed-cost/presentations/hooks/use-delete-fixed-cost-entry";

export type DisplayEntry = {
  fixedCostId: string;
  fixedCostName: string;
  entryId: string | null;
  amount: number;
  dirty: boolean;
};

type FixedCostEntriesContextValue = {
  year: number;
  month: number;
  entries: DisplayEntry[];
  total: number;
  hasDirty: boolean;
  loading: boolean;
  saving: boolean;
  hasNoMaster: boolean;
  masterCount: number;
  setMonth: (year: number, month: number) => void;
  setAmount: (fixedCostId: string, amount: number) => void;
  save: () => Promise<void>;
};

const FixedCostEntriesContext = createContext<FixedCostEntriesContextValue | null>(null);

export function useFixedCostEntries() {
  const context = useContext(FixedCostEntriesContext);
  if (!context) throw new Error("useFixedCostEntries must be used within FixedCostEntriesProvider");
  return context;
}

type FixedCostEntriesProviderProps = {
  children: React.ReactNode;
};

export function FixedCostEntriesProvider({ children }: FixedCostEntriesProviderProps) {
  // Hooks
  const { showToast } = useToast();
  const [year, setYear] = useState(DateTime.now().year);
  const [month, setMonthState] = useState(DateTime.now().month);
  const [dirtyAmounts, setDirtyAmounts] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const { fixedCosts, loading: loadingMaster } = useListFixedCosts({ limit: 100 });
  const { trigger: createEntry } = useCreateFixedCostEntry();
  const { trigger: updateEntry } = useUpdateFixedCostEntry();
  const { trigger: deleteEntryTrigger } = useDeleteFixedCostEntry();

  // Derived
  const { startDate, endDate } = useMemo(() => {
    const start = DateTime.local(year, month, 1);
    const end = start.endOf("month");
    return {
      startDate: start.toFormat("yyyy-MM-dd"),
      endDate: end.toFormat("yyyy-MM-dd"),
    };
  }, [year, month]);

  const { entries: fetchedEntries, loading: loadingEntries } = useListFixedCostEntriesByDate({ startDate, endDate });

  const entries: DisplayEntry[] = useMemo(() => {
    return fixedCosts.map((cost) => {
      const fetchedEntry = fetchedEntries.find((e) => e.fixedCost?.id === cost.id);
      const isDirty = cost.id in dirtyAmounts;
      return {
        fixedCostId: cost.id,
        fixedCostName: cost.name,
        entryId: fetchedEntry?.id ?? null,
        amount: isDirty ? dirtyAmounts[cost.id] : (fetchedEntry?.amount ?? 0),
        dirty: isDirty,
      };
    });
  }, [fixedCosts, fetchedEntries, dirtyAmounts]);

  const loading = loadingMaster || loadingEntries;
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const hasDirty = entries.some((e) => e.dirty);
  const hasNoMaster = !loadingMaster && fixedCosts.length === 0;

  // Actions
  const setMonth = (y: number, m: number) => {
    setDirtyAmounts({});
    setYear(y);
    setMonthState(m as typeof month);
  };

  const setAmount = (fixedCostId: string, amount: number) => {
    setDirtyAmounts((prev) => ({ ...prev, [fixedCostId]: amount }));
  };

  const save = async () => {
    const entriesToSave = entries.filter((e) => e.dirty);
    if (entriesToSave.length === 0) return;

    setSaving(true);

    try {
      for (const entry of entriesToSave) {
        if (entry.entryId && entry.amount > 0) {
          await updateEntry({ fixedCostId: entry.fixedCostId, entryId: entry.entryId, amount: entry.amount });
        } else if (entry.entryId && entry.amount === 0) {
          await deleteEntryTrigger({ fixedCostId: entry.fixedCostId, entryId: entry.entryId });
        } else if (!entry.entryId && entry.amount > 0) {
          await createEntry({ fixedCostId: entry.fixedCostId, amount: entry.amount, startDate, endDate });
        }
      }
      setDirtyAmounts({});
      await revalidateSWRKey(FIXED_COST_SWR_KEYS.LIST_FIXED_COSTS, FIXED_COST_ENTRY_SWR_KEYS.LIST_BY_DATE);
      showToast("Biaya tetap berhasil disimpan", "success");
    } catch {
      showToast("Gagal menyimpan biaya tetap", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FixedCostEntriesContext.Provider
      value={{ year, month, entries, total, hasDirty, loading, saving, hasNoMaster, masterCount: fixedCosts.length, setMonth, setAmount, save }}
    >
      {children}
    </FixedCostEntriesContext.Provider>
  );
}
