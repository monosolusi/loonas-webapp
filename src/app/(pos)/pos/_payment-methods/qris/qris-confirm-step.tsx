"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { PayInDetailStatus } from "@/features/pos/domain/enums/pay-in-detail-status";
import { useGetPosSale } from "@/features/pos/presentations/hooks/use-get-pos-sale";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";
import { QrisCreatingState } from "@/app/(pos)/pos/_payment-methods/qris/qris-creating-state";
import { QrisCreationFailed } from "@/app/(pos)/pos/_payment-methods/qris/qris-creation-failed";
import { QrisPaidSplash } from "@/app/(pos)/pos/_payment-methods/qris/qris-paid-splash";
import { QrisPaymentBox } from "@/app/(pos)/pos/_payment-methods/qris/qris-payment-box";
import { QrisPollingIndicator } from "@/app/(pos)/pos/_payment-methods/qris/qris-polling-indicator";

const POLL_INTERVAL_MS = 5000;

function resolveMerchantName(account: ReturnType<typeof useGetCurrentAccount>["account"]): string {
  if (!account) return "";
  if (account instanceof BusinessAccountEntity) return account.company.name;
  if ("fullName" in account && typeof account.fullName === "string") return account.fullName;
  return "";
}

export function QrisConfirmStep() {
  const router = useRouter();
  const { showToast } = useToast();
  const { total, isCheckingOut, completeTransaction, clearCart, changePaymentMethod } = usePos();
  const { account } = useGetCurrentAccount();
  const merchantName = resolveMerchantName(account);

  const [pendingSaleId, setPendingSaleId] = useState<string | null>(null);
  const [createFailed, setCreateFailed] = useState(false);
  const createTriggeredRef = useRef(false);
  const wasPaidRef = useRef(false);

  const saleState = useGetPosSale(pendingSaleId, { refreshInterval: POLL_INTERVAL_MS });
  const sale = saleState.status === "loaded" ? saleState.sale : null;
  const payInDetail = sale?.payInDetail ?? null;

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
    if (payInDetail?.status !== PayInDetailStatus.PAID) return;
    wasPaidRef.current = true;
    clearCart();
    router.push(`/pos/receipt/${pendingSaleId}`);
  }, [clearCart, pendingSaleId, payInDetail?.status, router]);

  // Abandonment toast on unmount when sale was still pending (cashier hit ✕).
  useEffect(() => {
    return () => {
      if (wasPaidRef.current) return;
      if (!createTriggeredRef.current) return;
      if (createFailed) return;
      showToast(
        {
          title: "Pembayaran QRIS dibatalkan dari sisi kasir",
          description: "QR akan kedaluwarsa otomatis dalam 24 jam.",
          type: "warning",
        },
        "warning",
      );
    };
  }, [createFailed, showToast]);

  const handleRetry = useCallback(() => {
    createTriggeredRef.current = false;
    setCreateFailed(false);
    setPendingSaleId(null);
  }, []);

  return (
    <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex flex-row items-baseline justify-between border-b border-b-neutral-100 px-6 py-4 text-sm">
        <span className="text-neutral-400">Total</span>
        <span className="tabular-nums text-neutral-500">
          <NumberDisplay value={total} suffix="IDR" />
        </span>
      </div>

      {renderPhase({
        createFailed,
        status: payInDetail?.status ?? null,
        qrString: payInDetail?.qrString ?? null,
        payInDetailId: payInDetail?.id ?? null,
        merchantName,
        total,
        onRetry: handleRetry,
        onChangeMethod: changePaymentMethod,
      })}
    </div>
  );
}

type RenderPhaseArgs = {
  createFailed: boolean;
  status: PayInDetailStatus | null;
  qrString: string | null;
  payInDetailId: string | null;
  merchantName: string;
  total: number;
  onRetry: () => void;
  onChangeMethod: () => void;
};

function renderPhase(args: RenderPhaseArgs): ReactNode {
  if (args.createFailed) return <QrisCreationFailed onRetry={args.onRetry} onChangeMethod={args.onChangeMethod} />;
  if (args.status === PayInDetailStatus.PAID) return <QrisPaidSplash total={args.total} />;
  if (args.status === PayInDetailStatus.PENDING_PAYMENT && args.qrString && args.payInDetailId) {
    return (
      <div className="flex flex-col gap-y-6 px-6 py-6">
        <QrisPaymentBox
          qrString={args.qrString}
          merchantName={args.merchantName}
          payInDetailId={args.payInDetailId}
        />
        <QrisPollingIndicator />
      </div>
    );
  }
  return <QrisCreatingState />;
}
