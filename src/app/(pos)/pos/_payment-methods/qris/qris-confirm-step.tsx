"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/core/presentations/components/spinner";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { useDocumentVisible } from "@/core/presentations/hooks/use-document-visible";
import { useCountdown } from "@/core/presentations/hooks/use-countdown";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { QrisPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/qris-pay-in-detail";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";
import { QrisCreatingState } from "@/app/(pos)/pos/_payment-methods/qris/qris-creating-state";
import { QrisCreationFailed } from "@/app/(pos)/pos/_payment-methods/qris/qris-creation-failed";
import { QrisCountdownRow } from "@/app/(pos)/pos/_payment-methods/qris/qris-countdown-row";
import { QrisExpiredPanel } from "@/app/(pos)/pos/_payment-methods/qris/qris-expired-panel";
import { QrisPaidSplash } from "@/app/(pos)/pos/_payment-methods/qris/qris-paid-splash";
import { QrisCard } from "@/core/presentations/components/qris-card";
import { QrisPollingIndicator } from "@/app/(pos)/pos/_payment-methods/qris/qris-polling-indicator";
import { QrisTotalRow } from "@/app/(pos)/pos/_payment-methods/qris/qris-total-row";
import { resolveMerchantName } from "@/app/(pos)/pos/_payment-methods/qris/resolve-merchant-name";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

const POLL_INTERVAL_MS = 5000;

export function QrisConfirmStep() {
  const router = useRouter();
  const { showToast } = useToast();
  const { total, isCheckingOut, completeTransaction, clearCart, changePaymentMethod, regenerateIdempotencyKey } =
    usePos();
  const { account } = useGetCurrentAccount();
  const merchantName = resolveMerchantName(account);
  const isDocumentVisible = useDocumentVisible();

  const [pendingSaleId, setPendingSaleId] = useState<string | null>(null);
  const [createFailed, setCreateFailed] = useState(false);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const createTriggeredRef = useRef(false);
  const wasPaidRef = useRef(false);
  const nullExpirationWarnedRef = useRef<Set<string>>(new Set());
  const prevQrisDetailIdRef = useRef<string | null>(null);

  const invoiceState = useGetInvoice(
    { id: pendingSaleId ?? "" },
    { refreshInterval: POLL_INTERVAL_MS },
  );
  const { refresh } = invoiceState;

  const invoice = useMemo(
    () =>
      !invoiceState.loading && !invoiceState.error && invoiceState.invoice instanceof OutgoingInvoiceEntity
        ? invoiceState.invoice
        : null,
    [invoiceState],
  );
  const detail = useMemo(() => invoice?.payInDetail?.detail ?? null, [invoice]);
  const qrisDetail = useMemo(() => (detail instanceof QrisPayInDetailEntity ? detail : null), [detail]);

  const triggerCreate = useCallback(async () => {
    if (createTriggeredRef.current) return;
    createTriggeredRef.current = true;
    const id = await completeTransaction();
    if (id) {
      setPendingSaleId(id);
    } else {
      setCreateFailed(true);
    }
  }, [completeTransaction]);

  // Trigger sale creation on mount.
  useEffect(() => {
    if (pendingSaleId !== null) return;
    if (createFailed) return;
    if (isCheckingOut) return;
    void triggerCreate();
  }, [createFailed, isCheckingOut, pendingSaleId, triggerCreate]);

  // Detect PAID via polling — clear cart, route to receipt.
  useEffect(() => {
    if (!pendingSaleId) return;
    if (detail?.status !== PayInStatus.PAID) return;
    wasPaidRef.current = true;
    clearCart();
    router.push(`/pos/receipt/${pendingSaleId}`);
  }, [clearCart, detail?.status, pendingSaleId, router]);

  // Refresh on tab becoming visible.
  useEffect(() => {
    if (!isDocumentVisible) return;
    if (!pendingSaleId) return;
    void refresh();
  }, [isDocumentVisible, pendingSaleId, refresh]);

  // Clear isRegenerating once the new pay-in arrives with a genuinely different id.
  // Guard against stale SWR cache: skip if the id hasn't changed since regenerate was triggered.
  useEffect(() => {
    if (!isRegenerating) return;
    if (!qrisDetail) return;
    if (qrisDetail.id === prevQrisDetailIdRef.current) return;
    setIsRegenerating(false);
    prevQrisDetailIdRef.current = null;
  }, [isRegenerating, qrisDetail]);

  // Latest guard values for the unmount-only abandonment toast, held in a ref so the
  // effect depends only on the stable showToast: its cleanup runs on real unmount,
  // never on detail-status transitions (the old [createFailed, detail?.status] deps
  // re-ran the cleanup mid-flow and fired the toast twice).
  const abandonStateRef = useRef({ pendingSaleId, createFailed, status: detail?.status ?? null });
  abandonStateRef.current = { pendingSaleId, createFailed, status: detail?.status ?? null };

  // Abandonment toast on unmount when sale was still pending (cashier hit ✕).
  useEffect(() => {
    return () => {
      const { pendingSaleId, createFailed, status } = abandonStateRef.current;
      if (wasPaidRef.current) return;
      if (pendingSaleId === null) return; // no sale created yet → nothing to abandon
      if (createFailed) return;
      if (status === PayInStatus.EXPIRED) return;
      showToast(
        {
          title: "Transaksi QRIS masih menunggu pembayaran",
          description: "Kode QR tetap aktif dan akan kedaluwarsa otomatis jika belum dibayar.",
          type: "warning",
        },
        "warning",
      );
    };
  }, [showToast]);

  const handleRetry = useCallback(() => {
    createTriggeredRef.current = false;
    setCreateFailed(false);
    setPendingSaleId(null);
  }, []);

  const handleManualRefresh = useCallback(async () => {
    if (manualRefreshing) return;
    setManualRefreshing(true);
    await refresh();
    setTimeout(() => setManualRefreshing(false), 2000);
  }, [manualRefreshing, refresh]);

  const handleRegenerate = useCallback(() => {
    prevQrisDetailIdRef.current = qrisDetail?.id ?? null;
    setIsRegenerating(true);
    regenerateIdempotencyKey();
    setPendingSaleId(null);
    createTriggeredRef.current = false;
  }, [qrisDetail?.id, regenerateIdempotencyKey]);

  const status = detail?.status ?? null;
  const qrString = qrisDetail?.qrString ?? null;
  const expirationTime = qrisDetail?.expirationTime ?? null;
  const payInId = qrisDetail?.id ?? null;

  // Warn once per payInId when PENDING_PAYMENT detail has no expirationTime.
  useEffect(() => {
    if (status !== PayInStatus.PENDING_PAYMENT) return;
    if (expirationTime !== null) return;
    if (!payInId) return;
    if (nullExpirationWarnedRef.current.has(payInId)) return;
    nullExpirationWarnedRef.current.add(payInId);
    console.warn("[qris] missing expirationTime on PENDING_PAYMENT detail", { payInId });
  }, [expirationTime, payInId, status]);

  const { isExpired } = useCountdown(expirationTime);
  const isFrozen = isExpired;

  if (createFailed) {
    return (
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
        <QrisTotalRow total={total} />
        <QrisCreationFailed onRetry={handleRetry} onChangeMethod={changePaymentMethod} />
      </div>
    );
  }

  if (status === PayInStatus.PAID) {
    return (
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
        <QrisTotalRow total={total} />
        <QrisPaidSplash total={total} />
      </div>
    );
  }

  if (status === PayInStatus.EXPIRED) {
    return (
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
        <QrisTotalRow total={total} />
        <QrisExpiredPanel onRegenerate={handleRegenerate} isRegenerating={isRegenerating} />
      </div>
    );
  }

  if (status === PayInStatus.PENDING_PAYMENT && qrString && payInId) {
    return (
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
        <QrisTotalRow total={total} />
        <div className="flex flex-col gap-y-4 px-6 py-6">
          {expirationTime !== null && (
            <QrisCountdownRow expirationTime={expirationTime} status={status} />
          )}
          <div className="relative">
            <QrisCard qrString={qrString} merchantName={merchantName} serialCode={payInId} />
            {isFrozen && (
              <div className="absolute inset-0 z-20 flex items-center justify-center gap-x-2 rounded-lg bg-white/70">
                <Spinner />
                <span className="text-sm text-neutral-400">Memeriksa status...</span>
              </div>
            )}
          </div>
          <div className="flex flex-row items-center justify-between gap-x-4">
            <QrisPollingIndicator />
            <SecondaryButton
              outlined
              label="Cek status sekarang"
              onClick={handleManualRefresh}
              loading={manualRefreshing}
              className="w-auto"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
      <QrisTotalRow total={total} />
      <QrisCreatingState />
    </div>
  );
}
