"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import { ServerError } from "@/core/resources/server-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { useGetAccountSetting } from "@/features/accounting/presentations/hooks/use-get-account-setting";
import { useSettleFinalIncomeTax } from "@/features/accounting/presentations/hooks/use-settle-final-income-tax";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

type FieldErrors = {
  date?: string;
};

type PphFinalContextValue = {
  journalDate: DateTime;
  amount: number;
  cashAccount: LedgerAccountEntity | null;
  memo: string;
  fieldErrors: FieldErrors;
  formError: string | null;
  isSubmitting: boolean;
  enabled: boolean;
  setJournalDate: (date: DateTime) => void;
  setAmount: (amount: number) => void;
  setCashAccount: (account: LedgerAccountEntity | null) => void;
  setMemo: (memo: string) => void;
  handleSubmit: () => Promise<void>;
};

const PphFinalContext = createContext<PphFinalContextValue | null>(null);

export function usePphFinal() {
  const context = useContext(PphFinalContext);
  if (!context) throw new Error("usePphFinal must be used within PphFinalProvider");
  return context;
}

type PphFinalProviderProps = {
  loading: React.ReactNode;
  accessDeniedNoFeature: React.ReactNode;
  accessDeniedNotConfigured: React.ReactNode;
  children: React.ReactNode;
};

export function PphFinalProvider({
  loading: loadingIndicator,
  accessDeniedNoFeature,
  accessDeniedNotConfigured,
  children,
}: PphFinalProviderProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { trigger, isMutating } = useSettleFinalIncomeTax();

  const { account, loading: accountLoading } = useGetCurrentAccount();
  const accountSettingResult = useGetAccountSetting();

  const [journalDate, setJournalDate] = useState<DateTime>(DateTime.now().startOf("day"));
  const [amount, setAmount] = useState<number>(0);
  const [cashAccount, setCashAccount] = useState<LedgerAccountEntity | null>(null);
  const [memo, setMemo] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  // One UUID per form session. Rotated only on terminal error.
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const isSubmitting = isMutating;

  const enabled = useMemo(
    () => amount > 0 && !!cashAccount && !!journalDate && !isSubmitting,
    [amount, cashAccount, journalDate, isSubmitting],
  );

  const mapServerError = useCallback(
    (err: ServerError) => {
      const code = err.code === "UNKNOWN" ? (err.details?.code ?? err.code) : err.code;

      // Closed period — inline under Tanggal field
      if (code === "PERIOD_CLOSED") {
        setFieldErrors((prev) => ({
          ...prev,
          date: "Periode untuk tanggal ini sudah ditutup. Pilih tanggal yang masih terbuka.",
        }));
        return;
      }

      // 422 business errors — show as form-level error.
      // Also catch a details-carried 422 that collapsed to httpCode 500 via UNKNOWN passthrough.
      if (err.httpCode === 422 || err.details?.httpCode === 422) {
        setFormError(`Pembayaran tidak dapat diproses. ${err.message}`);
        return;
      }

      // Network / 5xx / IDEMPOTENCY_KEY_REQUIRED → toast
      showToast("Gagal menyimpan pembayaran. Silakan coba lagi.", "error");
    },
    [showToast],
  );

  const handleSubmit = useCallback(async () => {
    setFieldErrors({});
    setFormError(null);

    try {
      const entity = await trigger({
        cashAccountId: cashAccount!.id,
        amount,
        journalDate: journalDate.toISODate() ?? "",
        memo: memo || undefined,
        idempotencyKey: idempotencyKeyRef.current,
      });

      showToast("Pembayaran PPh Final berhasil dicatat.", "success");
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_JOURNALS);
      router.push(`/accounting/journals/${entity.id}`);
    } catch (err) {
      // Rotate key on terminal error
      idempotencyKeyRef.current = crypto.randomUUID();
      if (err instanceof ServerError) {
        mapServerError(err);
      } else {
        showToast("Gagal menyimpan pembayaran. Silakan coba lagi.", "error");
      }
    }
  }, [cashAccount, amount, journalDate, memo, trigger, mapServerError, showToast, router]);

  // Access-gate: account loading first
  if (accountLoading) return <>{loadingIndicator}</>;

  // No accounting feature
  if (!account?.hasFeature("accounting")) return <>{accessDeniedNoFeature}</>;

  // Account setting loading
  if (accountSettingResult.loading) return <>{loadingIndicator}</>;

  // Feature available but PPh Final UMKM not configured
  const accountSetting = accountSettingResult.data;
  if (!accountSetting || !accountSetting.isPphFinalUmkm) return <>{accessDeniedNotConfigured}</>;

  return (
    <PphFinalContext.Provider
      value={{
        journalDate,
        amount,
        cashAccount,
        memo,
        fieldErrors,
        formError,
        isSubmitting,
        enabled,
        setJournalDate,
        setAmount,
        setCashAccount,
        setMemo,
        handleSubmit,
      }}
    >
      {children}
    </PphFinalContext.Provider>
  );
}
