"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  resolveClosePeriodErrorMessage,
  isPeriodHasFailedPostingsError,
} from "@/features/accounting/presentations/helpers/close-period-error";
import { FIXED_COST_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/swr-keys";
import { FIXED_COST_ENTRY_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/fixed-cost-entry-swr-keys";
import { useListFixedCosts } from "@/features/fixed-cost/presentations/hooks/use-list-fixed-costs";
import { useListFixedCostEntriesByDate } from "@/features/fixed-cost/presentations/hooks/use-list-fixed-cost-entries-by-date";
import { useCreateFixedCostEntry } from "@/features/fixed-cost/presentations/hooks/use-create-fixed-cost-entry";
import { useUpdateFixedCostEntry } from "@/features/fixed-cost/presentations/hooks/use-update-fixed-cost-entry";
import { useDeleteFixedCostEntry } from "@/features/fixed-cost/presentations/hooks/use-delete-fixed-cost-entry";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { useListPeriods } from "@/features/accounting/presentations/hooks/use-list-periods";
import { useClosePeriod } from "@/features/accounting/presentations/hooks/use-close-period";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

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
  // Period status
  matchedPeriod: AccountingPeriodEntity | null;
  periodLoading: boolean;
  isClosed: boolean;
  isLocked: boolean;
  canClosePeriod: boolean;
  // Close dialog
  isCloseDialogOpen: boolean;
  openCloseDialog: () => void;
  dismissCloseDialog: () => void;
  closePeriodError: string | null;
  closePeriodFailureCount: number;
  isClosing: boolean;
  handleClosePeriod: (reason: string) => Promise<boolean>;
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

  // Period resolution
  const { periods, loading: periodLoading } = useListPeriods({ limit: 100 });
  const { trigger: triggerClose, isMutating: isClosing } = useClosePeriod();

  // Close dialog state
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [closePeriodError, setClosePeriodError] = useState<string | null>(null);
  const [closePeriodFailureCount, setClosePeriodFailureCount] = useState(0);

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

  // Period matching: match viewed year+month against period startDate (calendar year+month)
  const matchedPeriod = useMemo(
    () =>
      (periods ?? []).find((p) => {
        const dt = DateTime.fromISO(p.startDate);
        return dt.year === year && dt.month === month;
      }) ?? null,
    [periods, year, month],
  );

  const isClosed = matchedPeriod?.isClosed ?? false;
  const isLocked = matchedPeriod?.isLocked ?? false;
  const canClosePeriod = !!matchedPeriod && matchedPeriod.canClose && !matchedPeriod.isClosed;

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
    } catch (err) {
      if (err instanceof ServerError && err.code === ErrorCodes.PERIOD_CLOSED.code) {
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS);
        showToast(ErrorCodes.PERIOD_CLOSED.message, "error");
      } else {
        showToast("Gagal menyimpan biaya tetap", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  // Close dialog handlers
  const openCloseDialog = () => {
    setClosePeriodError(null);
    setClosePeriodFailureCount(0);
    setIsCloseDialogOpen(true);
  };

  const dismissCloseDialog = () => {
    setIsCloseDialogOpen(false);
    setClosePeriodError(null);
    setClosePeriodFailureCount(0);
  };

  const handleClosePeriod = async (reason: string): Promise<boolean> => {
    if (!matchedPeriod) return false;
    setClosePeriodError(null);
    const idempotencyKey = crypto.randomUUID();
    try {
      await triggerClose({ id: matchedPeriod.id, idempotencyKey, reason: reason || undefined });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS, FIXED_COST_ENTRY_SWR_KEYS.LIST_BY_DATE);
      setIsCloseDialogOpen(false);
      setClosePeriodFailureCount(0);
      showToast("Periode berhasil ditutup.", "success");
      return true;
    } catch (err) {
      const isFailedPostings = isPeriodHasFailedPostingsError(err);
      setClosePeriodFailureCount((c) => (isFailedPostings ? c + 1 : 0));

      if (err instanceof ServerError) {
        if (err.httpCode === 403) {
          showToast("Anda tidak memiliki akses untuk menutup periode ini.", "error");
        } else if (err.httpCode === 422) {
          setClosePeriodError(resolveClosePeriodErrorMessage(err));
        } else if (err.code === ErrorCodes.PERIOD_ALREADY_CLOSED.code || err.httpCode === 409) {
          showToast(ErrorCodes.PERIOD_ALREADY_CLOSED.message, "error");
        } else {
          showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
        }
      } else {
        showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
      }
      return false;
    }
  };

  return (
    <FixedCostEntriesContext.Provider
      value={{
        year,
        month,
        entries,
        total,
        hasDirty,
        loading,
        saving,
        hasNoMaster,
        masterCount: fixedCosts.length,
        setMonth,
        setAmount,
        save,
        matchedPeriod,
        periodLoading,
        isClosed,
        isLocked,
        canClosePeriod,
        isCloseDialogOpen,
        openCloseDialog,
        dismissCloseDialog,
        closePeriodError,
        closePeriodFailureCount,
        isClosing,
        handleClosePeriod,
      }}
    >
      {children}
    </FixedCostEntriesContext.Provider>
  );
}
