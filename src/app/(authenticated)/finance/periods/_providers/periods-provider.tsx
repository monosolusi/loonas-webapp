"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { PaginationMeta } from "@/core/resources/paginated";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { useListPeriods } from "@/features/accounting/presentations/hooks/use-list-periods";
import { useClosePeriod } from "@/features/accounting/presentations/hooks/use-close-period";
import { useReopenPeriod } from "@/features/accounting/presentations/hooks/use-reopen-period";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

type PeriodStatusFilter = "open" | "closed" | undefined;

type PeriodsContextValue = {
  periods: AccountingPeriodEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  listError: ServerError | null;
  statusFilter: PeriodStatusFilter;
  page: number;
  setStatusFilter: (status: PeriodStatusFilter) => void;
  setPage: (page: number) => void;
  // Close dialog
  closingPeriod: AccountingPeriodEntity | null;
  openCloseDialog: (period: AccountingPeriodEntity) => void;
  dismissCloseDialog: () => void;
  closePeriodError: string | null;
  isClosing: boolean;
  handleClosePeriod: (reason: string) => Promise<boolean>;
  // Reopen dialog
  reopeningPeriod: AccountingPeriodEntity | null;
  openReopenDialog: (period: AccountingPeriodEntity) => void;
  dismissReopenDialog: () => void;
  reopenPeriodError: string | null;
  isReopening: boolean;
  handleReopenPeriod: (reason: string) => Promise<boolean>;
};

const PeriodsContext = createContext<PeriodsContextValue | null>(null);

export function usePeriods() {
  const context = useContext(PeriodsContext);
  if (!context) throw new Error("usePeriods must be used within PeriodsProvider");
  return context;
}

type PeriodsProviderProps = {
  children: React.ReactNode;
};

export function PeriodsProvider({ children }: PeriodsProviderProps) {
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<PeriodStatusFilter>(undefined);
  const [page, setPage] = useState(1);

  const { periods, meta, loading, error: listError } = useListPeriods({ page, limit: 25, status: statusFilter });

  const { trigger: triggerClose, isMutating: isClosing } = useClosePeriod();
  const { trigger: triggerReopen, isMutating: isReopening } = useReopenPeriod();

  // Close dialog state
  const [closingPeriod, setClosingPeriod] = useState<AccountingPeriodEntity | null>(null);
  const [closePeriodError, setClosePeriodError] = useState<string | null>(null);

  // Reopen dialog state
  const [reopeningPeriod, setReopeningPeriod] = useState<AccountingPeriodEntity | null>(null);
  const [reopenPeriodError, setReopenPeriodError] = useState<string | null>(null);

  const openCloseDialog = useCallback((period: AccountingPeriodEntity) => {
    setClosePeriodError(null);
    setClosingPeriod(period);
  }, []);

  const dismissCloseDialog = useCallback(() => {
    setClosingPeriod(null);
    setClosePeriodError(null);
  }, []);

  const openReopenDialog = useCallback((period: AccountingPeriodEntity) => {
    setReopenPeriodError(null);
    setReopeningPeriod(period);
  }, []);

  const dismissReopenDialog = useCallback(() => {
    setReopeningPeriod(null);
    setReopenPeriodError(null);
  }, []);

  const handleClosePeriod = useCallback(
    async (reason: string): Promise<boolean> => {
      if (!closingPeriod) return false;
      setClosePeriodError(null);
      const idempotencyKey = crypto.randomUUID();
      try {
        await triggerClose({ id: closingPeriod.id, idempotencyKey, reason: reason || undefined });
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS);
        setClosingPeriod(null);
        showToast("Periode berhasil ditutup.", "success");
        return true;
      } catch (err) {
        if (err instanceof ServerError) {
          if (err.httpCode === 403) {
            showToast("Anda tidak memiliki akses untuk menutup periode ini.", "error");
          } else if (
            err.code === ErrorCodes.PERIOD_ALREADY_CLOSED.code ||
            err.code === ErrorCodes.PERIOD_CLOSED.code ||
            err.httpCode === 409
          ) {
            showToast(ErrorCodes.PERIOD_ALREADY_CLOSED.message, "error");
          } else if (err.httpCode === 422) {
            // AC-5: inline warning inside the dialog — set error message, do NOT close dialog
            setClosePeriodError(ErrorCodes.PERIOD_NOT_DRAINED.message);
          } else {
            showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
          }
        } else {
          showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
        }
        return false;
      }
    },
    [closingPeriod, triggerClose, showToast],
  );

  const handleReopenPeriod = useCallback(
    async (reason: string): Promise<boolean> => {
      if (!reopeningPeriod) return false;
      setReopenPeriodError(null);
      const idempotencyKey = crypto.randomUUID();
      try {
        await triggerReopen({ id: reopeningPeriod.id, reason, idempotencyKey });
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS);
        setReopeningPeriod(null);
        showToast("Periode berhasil dibuka kembali.", "success");
        return true;
      } catch (err) {
        if (err instanceof ServerError) {
          if (err.httpCode === 403) {
            showToast("Hanya admin yang dapat membuka kembali periode.", "error");
          } else if (
            err.code === ErrorCodes.PERIOD_NOT_CLOSED.code ||
            err.httpCode === 409
          ) {
            showToast(ErrorCodes.PERIOD_NOT_CLOSED.message, "error");
          } else {
            showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
          }
        } else {
          showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
        }
        return false;
      }
    },
    [reopeningPeriod, triggerReopen, showToast],
  );

  const handleSetStatusFilter = useCallback(
    (status: PeriodStatusFilter) => {
      setStatusFilter(status);
      setPage(1);
    },
    [],
  );

  return (
    <PeriodsContext.Provider
      value={{
        periods,
        meta,
        loading,
        listError,
        statusFilter,
        page,
        setStatusFilter: handleSetStatusFilter,
        setPage,
        closingPeriod,
        openCloseDialog,
        dismissCloseDialog,
        closePeriodError,
        isClosing,
        handleClosePeriod,
        reopeningPeriod,
        openReopenDialog,
        dismissReopenDialog,
        reopenPeriodError,
        isReopening,
        handleReopenPeriod,
      }}
    >
      {children}
    </PeriodsContext.Provider>
  );
}
