"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type PaymentSummaryStatus = "pending" | "processing" | "completed";

interface PaymentSummaryProps {
  total: string;
  subtotal: string;
  adminFee: string;
  paymentMethod: string;
  status: PaymentSummaryStatus;
  completedAt?: string;
  onContinuePayment?: () => void;
}

export function PaymentSummary({
  total,
  subtotal,
  adminFee,
  paymentMethod,
  status,
  completedAt,
  onContinuePayment,
}: PaymentSummaryProps) {
  return (
    <div className="flex flex-col gap-y-5">
      {/* Total Tagihan */}
      <div className="flex flex-col gap-y-1">
        <span className="text-xs leading-4 text-neutral-200">Total Tagihan</span>
        <span className="text-2xl leading-8 font-semibold tracking-tight">{total}</span>
      </div>

      {/* Breakdown Card */}
      <div className="flex flex-col gap-y-3 rounded-lg border border-neutral-100 p-4">
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Subtotal</span>
          <span className="text-sm leading-5 text-neutral-500">{subtotal}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Biaya Admin</span>
          <span className="text-sm leading-5">{adminFee}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Metode Pembayaran</span>
          <span className="text-sm leading-5">{paymentMethod}</span>
        </div>
      </div>

      {/* Status-based Notice */}
      {status === "pending" && (
        <div className="bg-warning-50 flex flex-row items-start gap-x-2 rounded-lg px-3 py-2.5">
          <span className="text-warning-500 text-xs leading-4">Mohon selesaikan pembayaran secepatnya.</span>
        </div>
      )}

      {status === "processing" && (
        <div className="bg-primary-50 flex flex-row items-start gap-x-2 rounded-lg px-3 py-2.5">
          <span className="text-primary-400 text-xs leading-4">Sedang diproses...</span>
        </div>
      )}

      {status === "completed" && (
        <div className="bg-success-50 flex flex-col items-start gap-y-1 rounded-lg px-3 py-2.5">
          <span className="text-success-500 text-xs leading-4 font-semibold">Pembayaran Selesai</span>
          {completedAt && <span className="text-success-400 text-xs leading-4">{completedAt}</span>}
        </div>
      )}

      {/* Status-based CTA */}
      {status === "pending" && <PrimaryButton label="Lanjutkan Pembayaran" onClick={onContinuePayment} />}
      {status === "processing" && <SecondaryButton outlined disabled label="Menunggu Proses" />}
      {status === "completed" && <SecondaryButton outlined label="Unduh Bukti" />}
    </div>
  );
}
