"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import { QrisCard } from "@/core/presentations/components/qris-card";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { Spinner } from "@/core/presentations/components/spinner";
import { useCountdown } from "@/core/presentations/hooks/use-countdown";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { QrisPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/qris-pay-in-detail";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { usePosReceipt } from "@/features/invoice/presentations/providers/pos-receipt-provider";
import { QrisCountdownRow } from "@/app/(pos)/pos/_payment-methods/qris/qris-countdown-row";
import { QrisPaidSplash } from "@/app/(pos)/pos/_payment-methods/qris/qris-paid-splash";
import { QrisPollingIndicator } from "@/app/(pos)/pos/_payment-methods/qris/qris-polling-indicator";
import { resolveMerchantName } from "@/app/(pos)/pos/_payment-methods/qris/resolve-merchant-name";

const PAID_AUTO_CLOSE_MS = 1500;
const REFRESH_COOLDOWN_MS = 2000;

type ReceiptQrisModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ReceiptQrisModal({ open, onClose }: ReceiptQrisModalProps) {
  const { invoice, refresh } = usePosReceipt();
  const { account } = useGetCurrentAccount();
  const merchantName = resolveMerchantName(account);

  const qrisDetail = useMemo(() => {
    const detail = invoice.payInDetail?.detail ?? null;
    return detail instanceof QrisPayInDetailEntity ? detail : null;
  }, [invoice]);

  const status = qrisDetail?.status ?? null;
  const expirationTime = qrisDetail?.expirationTime ?? null;

  // Only tick the countdown while the modal is visible.
  const { isExpired } = useCountdown(open ? expirationTime : null);

  const [manualRefreshing, setManualRefreshing] = useState(false);

  const handleManualRefresh = useCallback(async () => {
    if (manualRefreshing) return;
    setManualRefreshing(true);
    await refresh();
    setTimeout(() => setManualRefreshing(false), REFRESH_COOLDOWN_MS);
  }, [manualRefreshing, refresh]);

  // Auto-close shortly after the provider poll flips the sale to PAID.
  useEffect(() => {
    if (!open) return;
    if (status !== PayInStatus.PAID) return;
    const id = setTimeout(onClose, PAID_AUTO_CLOSE_MS);
    return () => clearTimeout(id);
  }, [open, status, onClose]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      {/* Full-viewport flex → panel is dead-center both axes on every breakpoint. */}
      <div className="fixed inset-0 z-50 flex min-h-full w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative aspect-square w-[min(90vw,90vh)] max-w-[560px] transform overflow-hidden rounded-lg bg-white shadow-xl transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        >
          <DialogTitle className="sr-only">Pembayaran QRIS</DialogTitle>
          {/* Fixed square: content is centered and sized to fit — no internal scroll at POS viewports. */}
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-6 p-6">
            {status === PayInStatus.PAID && qrisDetail ? (
              <QrisPaidSplash total={qrisDetail.amount} />
            ) : status === PayInStatus.PENDING_PAYMENT && qrisDetail ? (
              <>
                {expirationTime !== null && <QrisCountdownRow expirationTime={expirationTime} status={status} />}
                <div className="relative w-full max-w-sm">
                  <QrisCard
                    qrString={qrisDetail.qrString}
                    merchantName={merchantName}
                    serialCode={qrisDetail.id}
                    size={216}
                    variant="bare"
                  />
                  {isExpired && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center gap-x-2 rounded-lg bg-white/70">
                      <Spinner />
                      <span className="text-sm text-neutral-400">Memeriksa status...</span>
                    </div>
                  )}
                </div>
                <div className="flex w-full max-w-sm flex-col items-center gap-y-3">
                  <QrisPollingIndicator />
                  <SecondaryButton
                    outlined
                    label="Cek status sekarang"
                    onClick={handleManualRefresh}
                    loading={manualRefreshing}
                    className="w-full"
                  />
                </div>
              </>
            ) : (
              <div className="flex w-full max-w-sm flex-col items-center gap-y-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-warning-100 text-warning-500">
                  <ClockIcon className="size-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-500">QR sudah kedaluwarsa</h3>
                <p className="text-sm text-neutral-300">
                  Kode QR sudah tidak berlaku. Buat transaksi baru di POS untuk melanjutkan pembayaran.
                </p>
                <SecondaryButton outlined label="Tutup" onClick={onClose} className="w-full" />
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
