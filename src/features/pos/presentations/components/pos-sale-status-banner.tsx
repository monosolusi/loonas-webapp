"use client";

import clsx from "clsx";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import {
  derivePosSaleStatusKind,
  formatPosSaleDateTime,
  formatPosSaleTimeOnly,
  isPosSaleQris,
} from "@/features/pos/presentations/components/pos-sale-status-helpers";

type PosSaleStatusBannerProps = {
  sale: PosSaleEntity;
};

export function PosSaleStatusBanner({ sale }: PosSaleStatusBannerProps) {
  const kind = derivePosSaleStatusKind(sale);
  const isQris = isPosSaleQris(sale);

  if (kind === "paid") {
    const methodLabel = isQris ? "QRIS terbayar" : "Tunai diterima";
    return (
      <BannerShell tone="success">
        <CheckCircleIcon className="size-6 shrink-0" aria-hidden />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Pembayaran diterima</span>
          <span className="text-xs">
            {methodLabel} pada {formatPosSaleDateTime(sale.updatedAt || sale.invoiceDate)} WIB
          </span>
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
          {sale.payInDetail?.expiresAt
            ? ` · auto-expired ${formatPosSaleTimeOnly(sale.payInDetail.expiresAt)}`
            : ""}
        </span>
      </div>
    </BannerShell>
  );
}

type BannerTone = "success" | "warning";

function BannerShell({ tone, children }: { tone: BannerTone; children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "flex flex-row items-center gap-x-3 rounded-lg border px-4 py-3",
        tone === "success" && "border-success-100 bg-success-50 text-success-500",
        tone === "warning" && "border-warning-100 bg-warning-50 text-warning-500",
      )}
      aria-live="polite"
    >
      {children}
    </div>
  );
}
