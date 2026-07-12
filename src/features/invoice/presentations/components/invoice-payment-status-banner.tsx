"use client";

import clsx from "clsx";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { QrisPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/qris-pay-in-detail";
import {
  deriveInvoicePaymentStatusKind,
  formatInvoiceDateTime,
  formatInvoiceTimeOnly,
  isInvoicePayInQris,
} from "@/features/invoice/presentations/components/invoice-payment-helpers";

type InvoicePaymentStatusBannerProps = {
  invoice: OutgoingInvoiceEntity;
};

export function InvoicePaymentStatusBanner({ invoice }: InvoicePaymentStatusBannerProps) {
  const kind = deriveInvoicePaymentStatusKind(invoice);
  const isQris = isInvoicePayInQris(invoice);

  if (kind === "paid") {
    const methodLabel = isQris ? "QRIS terbayar" : "Tunai diterima";
    return (
      <BannerShell tone="success">
        <CheckCircleIcon className="size-6 shrink-0" aria-hidden />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Pembayaran diterima</span>
          <span className="text-xs">
            {methodLabel} pada{" "}
            {formatInvoiceDateTime(invoice.updatedAt.isValid ? invoice.updatedAt : invoice.invoiceDate)} WIB
          </span>
        </div>
      </BannerShell>
    );
  }

  const detail = invoice.payInDetail?.detail;
  const expirationTime = detail instanceof QrisPayInDetailEntity ? detail.expirationTime : null;

  if (kind === "expired") {
    return (
      <BannerShell tone="error">
        <ClockIcon className="size-6 shrink-0" aria-hidden />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">QR kedaluwarsa</span>
          <span className="text-xs">
            {expirationTime
              ? `Kedaluwarsa ${formatInvoiceTimeOnly(expirationTime)} WIB · pembayaran tidak diselesaikan`
              : "Pembayaran tidak diselesaikan pelanggan"}
          </span>
        </div>
      </BannerShell>
    );
  }

  if (kind === "failed") {
    return (
      <BannerShell tone="error">
        <XCircleIcon className="size-6 shrink-0" aria-hidden />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Pembayaran gagal</span>
          <span className="text-xs">Pembayaran QRIS tidak berhasil diproses</span>
        </div>
      </BannerShell>
    );
  }

  return (
    <BannerShell tone="warning">
      <ClockIcon className="size-6 shrink-0" aria-hidden />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">Menunggu pembayaran</span>
        <span className="text-xs">
          Pelanggan belum scan QR
          {expirationTime ? ` · auto-expired ${formatInvoiceTimeOnly(expirationTime)}` : ""}
        </span>
      </div>
    </BannerShell>
  );
}

type BannerTone = "success" | "warning" | "error";

function BannerShell({ tone, children }: { tone: BannerTone; children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "flex flex-row items-center gap-x-3 rounded-lg border px-4 py-3",
        tone === "success" && "border-success-100 bg-success-50 text-success-500",
        tone === "warning" && "border-warning-100 bg-warning-50 text-warning-500",
        tone === "error" && "border-error-100 bg-error-50 text-error-500",
      )}
      aria-live="polite"
    >
      {children}
    </div>
  );
}
