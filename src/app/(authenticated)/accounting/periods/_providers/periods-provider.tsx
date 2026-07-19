"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { DateTime } from "luxon";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  resolveClosePeriodErrorMessage,
  isPeriodHasFailedPostingsError,
} from "@/features/accounting/presentations/helpers/close-period-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { PaginationMeta } from "@/core/resources/paginated";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { YearEndSummaryEntity } from "@/features/accounting/domain/entities/year-end-summary";
import { CloseWarning } from "@/features/accounting/domain/entities/close-warning";
import { useListPeriods } from "@/features/accounting/presentations/hooks/use-list-periods";
import { useClosePeriod } from "@/features/accounting/presentations/hooks/use-close-period";
import { useReopenPeriod } from "@/features/accounting/presentations/hooks/use-reopen-period";
import { useGetYearSummary } from "@/features/accounting/presentations/hooks/use-get-year-summary";
import { useCloseYear } from "@/features/accounting/presentations/hooks/use-close-year";
import { useReopenYear } from "@/features/accounting/presentations/hooks/use-reopen-year";
import { useAllocateManagerialCost } from "@/features/accounting/presentations/hooks/use-allocate-managerial-cost";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

// Feature-gate literal for managerial costing — centralised here for a one-line change if the string is corrected.
export const MANAGERIAL_COSTING_FEATURE = "managerial_costing" as const;

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
  // Close period dialog
  closingPeriod: AccountingPeriodEntity | null;
  openCloseDialog: (period: AccountingPeriodEntity) => void;
  dismissCloseDialog: () => void;
  closePeriodError: string | null;
  closePeriodFailureCount: number;
  isClosing: boolean;
  handleClosePeriod: (reason: string) => Promise<boolean>;
  // Reopen period dialog
  reopeningPeriod: AccountingPeriodEntity | null;
  openReopenDialog: (period: AccountingPeriodEntity) => void;
  dismissReopenDialog: () => void;
  reopenPeriodError: string | null;
  isReopening: boolean;
  handleReopenPeriod: (reason: string) => Promise<boolean>;
  // Advisory state
  pendingAdvisories: Record<string, CloseWarning[]>;
  dismissAdvisory: (periodId: string) => void;
  // Year-end state
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  yearSummary: YearEndSummaryEntity | null;
  yearSummaryLoading: boolean;
  // Close year dialog
  isCloseYearDialogOpen: boolean;
  openCloseYearDialog: () => void;
  dismissCloseYearDialog: () => void;
  closeYearError: string | null;
  isClosingYear: boolean;
  handleCloseYear: (retainedEarningsAccountId?: string) => Promise<boolean>;
  // Reopen year dialog
  isReopenYearDialogOpen: boolean;
  openReopenYearDialog: () => void;
  dismissReopenYearDialog: () => void;
  reopenYearError: string | null;
  isReopeningYear: boolean;
  handleReopenYear: (reason: string) => Promise<boolean>;
  // Post-reopen reversal journal reference
  reopenedReversalJournalId: string | null;
  // Allocate dialog state
  allocatingPeriod: AccountingPeriodEntity | null;
  openAllocateDialog: (period: AccountingPeriodEntity) => void;
  dismissAllocateDialog: () => void;
  allocateError: string | null;
  isAllocating: boolean;
  handleAllocate: () => Promise<boolean>;
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

  const { periods, meta, loading, error: listError } = useListPeriods({ page, limit: DEFAULT_PAGE_SIZE, status: statusFilter });

  const { trigger: triggerClose, isMutating: isClosing } = useClosePeriod();
  const { trigger: triggerReopen, isMutating: isReopening } = useReopenPeriod();

  // Close period dialog state
  const [closingPeriod, setClosingPeriod] = useState<AccountingPeriodEntity | null>(null);
  const [closePeriodError, setClosePeriodError] = useState<string | null>(null);
  const [closePeriodFailureCount, setClosePeriodFailureCount] = useState(0);

  // Advisory state
  const [pendingAdvisories, setPendingAdvisories] = useState<Record<string, CloseWarning[]>>({});

  // Reopen period dialog state
  const [reopeningPeriod, setReopeningPeriod] = useState<AccountingPeriodEntity | null>(null);
  const [reopenPeriodError, setReopenPeriodError] = useState<string | null>(null);

  // Year-end state
  const [selectedYear, setSelectedYear] = useState<number>(DateTime.now().year);
  const { summary: yearSummary, loading: yearSummaryLoading } = useGetYearSummary(selectedYear);

  const { trigger: triggerCloseYear, isMutating: isClosingYear } = useCloseYear();
  const { trigger: triggerReopenYear, isMutating: isReopeningYear } = useReopenYear();
  const { trigger: triggerAllocate, isMutating: isAllocating } = useAllocateManagerialCost();

  // Close year dialog state
  const [isCloseYearDialogOpen, setIsCloseYearDialogOpen] = useState(false);
  const [closeYearError, setCloseYearError] = useState<string | null>(null);

  // Reopen year dialog state
  const [isReopenYearDialogOpen, setIsReopenYearDialogOpen] = useState(false);
  const [reopenYearError, setReopenYearError] = useState<string | null>(null);

  // Post-reopen reversal journal reference (transient — cleared when dialog re-opens)
  const [reopenedReversalJournalId, setReopenedReversalJournalId] = useState<string | null>(null);

  // Allocate dialog state
  const [allocatingPeriod, setAllocatingPeriod] = useState<AccountingPeriodEntity | null>(null);
  const [allocateError, setAllocateError] = useState<string | null>(null);

  const openCloseDialog = useCallback((period: AccountingPeriodEntity) => {
    setClosePeriodError(null);
    setClosePeriodFailureCount(0);
    setClosingPeriod(period);
  }, []);

  const dismissCloseDialog = useCallback(() => {
    setClosingPeriod(null);
    setClosePeriodError(null);
    setClosePeriodFailureCount(0);
  }, []);

  const openReopenDialog = useCallback((period: AccountingPeriodEntity) => {
    setReopenPeriodError(null);
    setReopeningPeriod(period);
  }, []);

  const dismissReopenDialog = useCallback(() => {
    setReopeningPeriod(null);
    setReopenPeriodError(null);
  }, []);

  const dismissAdvisory = useCallback((id: string) => {
    setPendingAdvisories((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  }, []);

  const openAllocateDialog = useCallback((period: AccountingPeriodEntity) => {
    setAllocateError(null);
    setAllocatingPeriod(period);
  }, []);

  const dismissAllocateDialog = useCallback(() => {
    setAllocatingPeriod(null);
    setAllocateError(null);
  }, []);

  const openCloseYearDialog = useCallback(() => {
    setCloseYearError(null);
    setIsCloseYearDialogOpen(true);
  }, []);

  const dismissCloseYearDialog = useCallback(() => {
    setIsCloseYearDialogOpen(false);
    setCloseYearError(null);
  }, []);

  const openReopenYearDialog = useCallback(() => {
    setReopenYearError(null);
    setReopenedReversalJournalId(null);
    setIsReopenYearDialogOpen(true);
  }, []);

  const dismissReopenYearDialog = useCallback(() => {
    setIsReopenYearDialogOpen(false);
    setReopenYearError(null);
  }, []);

  const handleClosePeriod = useCallback(
    async (reason: string): Promise<boolean> => {
      if (!closingPeriod) return false;
      setClosePeriodError(null);
      const idempotencyKey = crypto.randomUUID();
      try {
        const res = await triggerClose({ id: closingPeriod.id, idempotencyKey, reason: reason || undefined });
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS);
        if (res.warnings.length > 0) {
          setPendingAdvisories((prev) => ({ ...prev, [closingPeriod.id]: res.warnings }));
        }
        setClosingPeriod(null);
        setClosePeriodFailureCount(0);
        showToast("Periode berhasil ditutup.", "success");
        return true;
      } catch (err) {
        const isFailedPostings = isPeriodHasFailedPostingsError(err);
        setClosePeriodFailureCount((c) => (isFailedPostings ? c + 1 : 0));

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
            setClosePeriodError(resolveClosePeriodErrorMessage(err));
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

  const handleCloseYear = useCallback(
    async (retainedEarningsAccountId?: string): Promise<boolean> => {
      setCloseYearError(null);
      const idempotencyKey = crypto.randomUUID();
      try {
        await triggerCloseYear({ year: selectedYear, idempotencyKey, retainedEarningsAccountId });
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS, ACCOUNTING_SWR_KEYS.GET_ACCOUNTING_YEAR_SUMMARY);
        setIsCloseYearDialogOpen(false);
        showToast("Tahun buku berhasil ditutup.", "success");
        return true;
      } catch (err) {
        if (err instanceof ServerError) {
          if (err.httpCode === 403) {
            showToast(ErrorCodes.FEATURE_NOT_AVAILABLE.message, "error");
          } else if (err.code === ErrorCodes.MONTHLY_PERIODS_NOT_CLOSED.code) {
            setCloseYearError(ErrorCodes.MONTHLY_PERIODS_NOT_CLOSED.message);
          } else if (err.code === ErrorCodes.YEAR_ALREADY_CLOSED.code) {
            showToast(ErrorCodes.YEAR_ALREADY_CLOSED.message, "error");
          } else if (err.code === ErrorCodes.YEAR_CLOSE_BOUNDARY_INVALID.code) {
            setCloseYearError(ErrorCodes.YEAR_CLOSE_BOUNDARY_INVALID.message);
          } else if (err.code === ErrorCodes.RETAINED_EARNINGS_ACCOUNT_INVALID.code) {
            setCloseYearError(ErrorCodes.RETAINED_EARNINGS_ACCOUNT_INVALID.message);
          } else if (err.httpCode === 422) {
            setCloseYearError(err.message);
          } else {
            showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
          }
        } else {
          showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
        }
        return false;
      }
    },
    [selectedYear, triggerCloseYear, showToast],
  );

  const handleReopenYear = useCallback(
    async (reason: string): Promise<boolean> => {
      setReopenYearError(null);
      const confirmationToken = yearSummary?.closingJournalCreatedAt ?? null;
      if (confirmationToken === null) {
        setReopenYearError("Token konfirmasi tidak tersedia. Muat ulang halaman lalu coba lagi.");
        return false;
      }
      const idempotencyKey = crypto.randomUUID();
      try {
        const result = await triggerReopenYear({ year: selectedYear, confirmationToken, reason, idempotencyKey });
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS, ACCOUNTING_SWR_KEYS.GET_ACCOUNTING_YEAR_SUMMARY);
        setReopenedReversalJournalId(result.reversalJournalId);
        setIsReopenYearDialogOpen(false);
        showToast("Tahun buku berhasil dibuka kembali.", "success");
        return true;
      } catch (err) {
        if (err instanceof ServerError) {
          if (err.httpCode === 403) {
            showToast("Hanya admin yang dapat membuka kembali tahun.", "error");
          } else if (err.code === ErrorCodes.YEAR_UNLOCK_TOKEN_MISMATCH.code) {
            setReopenYearError("Token konfirmasi tidak cocok. Muat ulang halaman lalu coba lagi.");
          } else if (err.code === ErrorCodes.PERIOD_REOPEN_REASON_REQUIRED.code) {
            setReopenYearError(ErrorCodes.PERIOD_REOPEN_REASON_REQUIRED.message);
          } else if (err.code === ErrorCodes.YEAR_NOT_CLOSED.code) {
            showToast(ErrorCodes.YEAR_NOT_CLOSED.message, "error");
          } else {
            showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
          }
        } else {
          showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
        }
        return false;
      }
    },
    [selectedYear, yearSummary, triggerReopenYear, showToast],
  );

  const handleAllocate = useCallback(async (): Promise<boolean> => {
    if (!allocatingPeriod) return false;
    setAllocateError(null);
    try {
      const res = await triggerAllocate({ periodId: allocatingPeriod.id });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.GET_MANAGERIAL_COST);
      setAllocatingPeriod(null);
      showToast(`Alokasi berhasil. ${res.allocationCount} varian dialokasikan.`, "success");
      return true;
    } catch (err) {
      if (err instanceof ServerError) {
        if (
          err.code === ErrorCodes.FEATURE_NOT_AVAILABLE.code ||
          err.code === ErrorCodes.FORBIDDEN.code ||
          err.httpCode === 403
        ) {
          showToast(ErrorCodes.FEATURE_NOT_AVAILABLE.message, "error");
        } else if (err.code === ErrorCodes.PERIOD_NOT_CLOSED.code) {
          setAllocateError("Periode harus ditutup terlebih dahulu sebelum mengalokasikan biaya tetap.");
        } else if (err.code === ErrorCodes.PERIOD_NOT_FOUND.code || err.httpCode === 404) {
          showToast(ErrorCodes.PERIOD_NOT_FOUND.message, "error");
        } else {
          showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
        }
      } else {
        showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
      }
      return false;
    }
  }, [allocatingPeriod, triggerAllocate, showToast]);

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
        periods: periods ?? [],
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
        closePeriodFailureCount,
        isClosing,
        handleClosePeriod,
        reopeningPeriod,
        openReopenDialog,
        dismissReopenDialog,
        reopenPeriodError,
        isReopening,
        handleReopenPeriod,
        pendingAdvisories,
        dismissAdvisory,
        selectedYear,
        setSelectedYear,
        yearSummary,
        yearSummaryLoading,
        isCloseYearDialogOpen,
        openCloseYearDialog,
        dismissCloseYearDialog,
        closeYearError,
        isClosingYear,
        handleCloseYear,
        isReopenYearDialogOpen,
        openReopenYearDialog,
        dismissReopenYearDialog,
        reopenYearError,
        isReopeningYear,
        handleReopenYear,
        reopenedReversalJournalId,
        allocatingPeriod,
        openAllocateDialog,
        dismissAllocateDialog,
        allocateError,
        isAllocating,
        handleAllocate,
      }}
    >
      {children}
    </PeriodsContext.Provider>
  );
}
