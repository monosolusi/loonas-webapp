"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { OpeningBalanceRepositoryImpl } from "@/features/accounting/data/repositories/opening-balance";
import { OpeningBalanceServiceImpl } from "@/features/accounting/data/sources/opening-balance";
import { LedgerAccountRepositoryImpl } from "@/features/accounting/data/repositories/ledger-account";
import { LedgerAccountServiceImpl } from "@/features/accounting/data/sources/ledger-account";
import { GetOpeningBalanceUseCase } from "@/features/accounting/domain/usecases/get-opening-balance.usecases";
import { ListLedgerAccountsUseCase, ListLedgerAccountsUseCaseParams } from "@/features/accounting/domain/usecases/list-ledger-accounts.usecases";
import { OpeningBalanceEntity } from "@/features/accounting/domain/entities/opening-balance";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { JournalLineDraft } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor.types";
import { NormalBalanceHintLine } from "@/features/accounting/domain/entities/normal-balance-hint";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { usePostOpeningBalance } from "@/features/accounting/presentations/hooks/use-post-opening-balance";
import { deriveHeaderAccountIds } from "@/features/accounting/presentations/helpers/derive-header-account-ids";
import {
  isPermittedOpeningBalanceAccount,
  getAccountGroup,
} from "@/features/accounting/presentations/helpers/opening-balance-account-filter";
import { computeRetainedEarningsLine } from "@/features/accounting/presentations/helpers/compute-retained-earnings-line";
import { resolveNormalBalanceOutcome, NormalBalanceOutcome } from "@/features/accounting/presentations/helpers/normal-balance-hint-resolver";
import { parseNormalBalanceHintLines } from "@/features/accounting/presentations/helpers/normal-balance-hint-parser";

// ─── Types ─────────────────────────────────────────────────────────────────────

// Plain amount map: accountId → integer IDR amount (always positive)
export type PlainAmountMap = Map<string, number>;

export type WizardStep = "loading" | "error" | "readonly" | "intro" | "date" | "balances" | "review";

export type BalanceGroupAccount = {
  account: LedgerAccountEntity;
  isHeader: boolean;
};

export type GroupedAccounts = {
  assets: BalanceGroupAccount[];
  liabilities: BalanceGroupAccount[];
  equity: BalanceGroupAccount[];
};

export type NormalBalanceError =
  | { kind: "generic"; lines: NormalBalanceHintLine[] }
  | { kind: "deficit" };

type ResolvedAccount = { name: string; code: string };

type OpeningBalanceWizardContextValue = {
  step: WizardStep;
  // GET state
  existingBalance: OpeningBalanceEntity | null;
  // Account list state
  accounts: LedgerAccountEntity[];
  groupedAccounts: GroupedAccounts;
  accountsLoading: boolean;
  accountsError: ServerError | null;
  account3200Missing: boolean;
  // Form state
  asOf: string;
  amountMap: PlainAmountMap;
  // Derived lines + balance
  derivedLines: JournalLineDraft[];
  hasAnyNonZeroInput: boolean;
  // Submit state
  confirmModalOpen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  normalBalanceError: NormalBalanceError | null;
  isDeadEnd: boolean;
  // Actions
  setAsOf: (date: string) => void;
  setAmount: (accountId: string, amount: number) => void;
  goToStep: (step: WizardStep) => void;
  openConfirmModal: () => void;
  closeConfirmModal: () => void;
  handleSubmit: () => Promise<void>;
  handleDeadEnd: () => void;
  refetchAccounts: () => void;
  resolveAccount: (accountId: string) => ResolvedAccount | undefined;
};

const OpeningBalanceWizardContext = createContext<OpeningBalanceWizardContextValue | null>(null);

export function useOpeningBalanceWizard() {
  const ctx = useContext(OpeningBalanceWizardContext);
  if (!ctx) throw new Error("useOpeningBalanceWizard must be used within OpeningBalanceWizardProvider");
  return ctx;
}

// ─── GET opening balance (wizard-specific tri-state: entity / null / error) ──────

type GetFetcherParams = { clerk: ReturnType<typeof useClerk> };

async function GetOpeningBalanceWizardFetcher([_, params]: [string, GetFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new OpeningBalanceRepositoryImpl(new OpeningBalanceServiceImpl(new HttpRequest()));
  const uc = new GetOpeningBalanceUseCase(repo, sessionRepo);
  // Unlike use-get-opening-balance.ts which swallows errors to isMigration:false,
  // this fetcher propagates DataFailed so the wizard can render a real error state (tri-state requirement).
  const result = await uc.execute();
  if (result instanceof DataFailed) throw result.error;
  return result.data ?? null; // null = un-migrated
}

// ─── LIST ledger accounts (high limit, all at once) ───────────────────────────

type ListFetcherParams = { clerk: ReturnType<typeof useClerk> };

async function ListAllLedgerAccountsFetcher([_, params]: [string, ListFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const uc = new ListLedgerAccountsUseCase(repo, sessionRepo);
  const result = await uc.execute(new ListLedgerAccountsUseCaseParams({ limit: 500 }));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data.accounts;
}

// Local key — not in swr-keys.ts since it's scoped to this wizard
const LIST_ALL_LEDGER_ACCOUNTS_KEY = "opening-balance-wizard-list-accounts";

// ─── Provider ──────────────────────────────────────────────────────────────────

type OpeningBalanceWizardProviderProps = {
  children: React.ReactNode;
  loading: React.ReactNode;
};

export function OpeningBalanceWizardProvider({ children, loading }: OpeningBalanceWizardProviderProps) {
  const clerk = useClerk();
  const { trigger, isMutating } = usePostOpeningBalance();

  // ── GET state ──────────────────────────────────────────────────────────────
  const {
    data: existingBalance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useSWR(
    [ACCOUNTING_SWR_KEYS.GET_OPENING_BALANCE, { clerk }],
    GetOpeningBalanceWizardFetcher,
    { revalidateOnFocus: false },
  );

  // ── Account list ───────────────────────────────────────────────────────────
  const {
    data: allAccounts,
    isLoading: accountsLoading,
    error: accountsError,
    mutate: refetchAccountsMutate,
  } = useSWR(
    [LIST_ALL_LEDGER_ACCOUNTS_KEY, { clerk }],
    ListAllLedgerAccountsFetcher,
    { revalidateOnFocus: false },
  );

  const refetchAccounts = useCallback(() => {
    refetchAccountsMutate();
  }, [refetchAccountsMutate]);

  // ── Step machine ───────────────────────────────────────────────────────────
  const [step, setStep] = useState<WizardStep>("loading");

  useEffect(() => {
    if (balanceLoading) return;
    if (balanceError) {
      setStep("error");
      return;
    }
    if (existingBalance !== undefined) {
      setStep(existingBalance !== null ? "readonly" : "intro");
    }
  }, [balanceLoading, balanceError, existingBalance]);

  // ── 3200 resolution ────────────────────────────────────────────────────────
  const account3200Id = useMemo<string | null>(() => {
    if (!allAccounts) return null;
    return allAccounts.find((a) => a.code === "3200")?.id ?? null;
  }, [allAccounts]);

  const account3200Missing = useMemo<boolean>(() => {
    if (!allAccounts) return false;
    return allAccounts.every((a) => a.code !== "3200");
  }, [allAccounts]);

  // ── Header IDs ─────────────────────────────────────────────────────────────
  const headerIds = useMemo<Set<string>>(() => {
    if (!allAccounts) return new Set<string>();
    return deriveHeaderAccountIds(allAccounts);
  }, [allAccounts]);

  // ── Grouped accounts ───────────────────────────────────────────────────────
  const groupedAccounts = useMemo<GroupedAccounts>(() => {
    const groups: GroupedAccounts = { assets: [], liabilities: [], equity: [] };
    if (!allAccounts) return groups;

    const sorted = [...allAccounts].sort((a, b) => a.code.localeCompare(b.code));

    for (const account of sorted) {
      if (headerIds.has(account.id)) {
        const group = getAccountGroup(account);
        if (group) {
          groups[group].push({ account, isHeader: true });
        }
        continue;
      }
      if (!isPermittedOpeningBalanceAccount(account, headerIds)) continue;
      const group = getAccountGroup(account);
      if (group) {
        groups[group].push({ account, isHeader: false });
      }
    }

    return groups;
  }, [allAccounts, headerIds]);

  // ── Form state ─────────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = today.slice(0, 8) + "01";

  const [asOf, setAsOf] = useState<string>(firstOfMonth);
  const [amountMap, setAmountMap] = useState<PlainAmountMap>(new Map());

  const setAmount = useCallback((accountId: string, amount: number) => {
    setAmountMap((prev) => {
      const next = new Map(prev);
      if (amount === 0) {
        next.delete(accountId);
      } else {
        next.set(accountId, amount);
      }
      return next;
    });
  }, []);

  // ── Account type lookup ────────────────────────────────────────────────────
  const accountTypeById = useCallback(
    (id: string): AccountType | undefined => allAccounts?.find((a) => a.id === id)?.type,
    [allAccounts],
  );

  const resolveAccount = useCallback(
    (accountId: string): ResolvedAccount | undefined => {
      const acc = allAccounts?.find((a) => a.id === accountId);
      if (!acc) return undefined;
      return { name: acc.name, code: acc.code };
    },
    [allAccounts],
  );

  // ── Input lines derivation ─────────────────────────────────────────────────
  const inputLines = useMemo<JournalLineDraft[]>(() => {
    const lines: JournalLineDraft[] = [];
    if (!allAccounts) return lines;

    for (const [accountId, amount] of amountMap.entries()) {
      if (amount === 0) continue;
      const account = allAccounts.find((a) => a.id === accountId);
      if (!account) continue;
      const group = getAccountGroup(account);
      if (!group) continue;
      // assets → debit; liabilities + equity → credit
      lines.push(
        group === "assets"
          ? { account_id: accountId, debit: amount, credit: 0 }
          : { account_id: accountId, debit: 0, credit: amount },
      );
    }

    return lines;
  }, [amountMap, allAccounts]);

  const derivedLines = useMemo<JournalLineDraft[]>(() => {
    if (!account3200Id) return inputLines;
    const re = computeRetainedEarningsLine(inputLines, account3200Id);
    return re ? [...inputLines, re] : inputLines;
  }, [inputLines, account3200Id]);

  const hasAnyNonZeroInput = useMemo<boolean>(() => {
    for (const amount of amountMap.values()) {
      if (amount > 0) return true;
    }
    return false;
  }, [amountMap]);

  // ── Submit state ───────────────────────────────────────────────────────────
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [normalBalanceError, setNormalBalanceError] = useState<NormalBalanceError | null>(null);
  const [isDeadEnd, setIsDeadEnd] = useState(false);

  // Stable per-session idempotency key; rotated only on terminal error
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const openConfirmModal = useCallback(() => {
    setSubmitError(null);
    setConfirmModalOpen(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    if (isMutating) return;
    setConfirmModalOpen(false);
    setSubmitError(null);
  }, [isMutating]);

  const goToStep = useCallback((s: WizardStep) => {
    setStep(s);
  }, []);

  const handleDeadEnd = useCallback(() => {
    setIsDeadEnd(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitError(null);

    try {
      await trigger({
        asOf,
        lines: derivedLines
          .filter((l) => l.account_id !== null)
          .map((l) => ({ accountId: l.account_id as string, debit: l.debit, credit: l.credit })),
        idempotencyKey: idempotencyKeyRef.current,
      });

      // Success: revalidate GET cache and transition to readonly terminal
      setConfirmModalOpen(false);
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.GET_OPENING_BALANCE);
      setStep("readonly");
    } catch (err) {
      if (!(err instanceof ServerError)) {
        idempotencyKeyRef.current = crypto.randomUUID();
        setSubmitError("Terjadi kesalahan jaringan — coba lagi.");
        return;
      }

      const serverError = err as ServerError;
      const code =
        serverError.code === "UNKNOWN"
          ? (serverError.details?.code ?? serverError.code)
          : serverError.code;

      // NORMAL_BALANCE_HINT: resolve outcome → generic hints or deficit dead-end
      if (code === "NORMAL_BALANCE_HINT") {
        const hintLines = parseNormalBalanceHintLines(
          serverError.details?.details ?? serverError.details,
        );
        const outcome: NormalBalanceOutcome = resolveNormalBalanceOutcome(hintLines, accountTypeById);
        idempotencyKeyRef.current = crypto.randomUUID();
        setConfirmModalOpen(false);
        setNormalBalanceError(
          outcome.kind === "deficit" ? { kind: "deficit" } : { kind: "generic", lines: outcome.lines },
        );
        setStep("balances");
        return;
      }

      // Already migrated from a concurrent submission
      if (code === "OPENING_BALANCE_EXISTS" || code === "OPENING_BALANCE_BLOCKED") {
        idempotencyKeyRef.current = crypto.randomUUID();
        setConfirmModalOpen(false);
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.GET_OPENING_BALANCE);
        setStep("readonly");
        return;
      }

      // Other 422/409 business errors: inline modal error, keep modal open
      if (serverError.httpCode === 422 || serverError.httpCode === 409) {
        setSubmitError(serverError.message);
        return;
      }

      // Network / 5xx: inline error, rotate key
      idempotencyKeyRef.current = crypto.randomUUID();
      setSubmitError("Terjadi kesalahan jaringan — coba lagi.");
    }
  }, [asOf, derivedLines, trigger, accountTypeById]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (balanceLoading || step === "loading") {
    return <>{loading}</>;
  }

  const accountsErrTyped = accountsError instanceof ServerError ? accountsError : null;

  const value: OpeningBalanceWizardContextValue = {
    step,
    existingBalance: existingBalance ?? null,
    accounts: allAccounts ?? [],
    groupedAccounts,
    accountsLoading,
    accountsError: accountsErrTyped,
    account3200Missing,
    asOf,
    amountMap,
    derivedLines,
    hasAnyNonZeroInput,
    confirmModalOpen,
    isSubmitting: isMutating,
    submitError,
    normalBalanceError,
    isDeadEnd,
    setAsOf,
    setAmount,
    goToStep,
    openConfirmModal,
    closeConfirmModal,
    handleSubmit,
    handleDeadEnd,
    refetchAccounts,
    resolveAccount,
  };

  return (
    <OpeningBalanceWizardContext.Provider value={value}>
      {children}
    </OpeningBalanceWizardContext.Provider>
  );
}
