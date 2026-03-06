"use client";

import { useGetInvoiceSummary } from "@/features/invoice/presentations/hooks/use-get-invoice-summary";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import Image from "next/image";
import Link from "next/link";

function StatisticCardSkeleton() {
  return (
    <div className="flex flex-1 flex-row justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-5">
      <div className="flex flex-col gap-y-3">
        <div className="h-5 w-24 animate-pulse rounded bg-neutral-100" />
        <div className="flex flex-col gap-y-1.5">
          <div className="h-8 w-36 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
      <div className="flex size-10 animate-pulse items-center justify-center rounded-lg bg-neutral-100" />
    </div>
  );
}

export function OutgoingInvoiceStatisticsImpl() {
  const { summary, loading } = useGetInvoiceSummary({ type: InvoiceType.OUTGOING });

  if (loading || !summary) {
    return (
      <div className="flex flex-row gap-x-4">
        <StatisticCardSkeleton />
        <StatisticCardSkeleton />
        <StatisticCardSkeleton />
      </div>
    );
  }

  const unpaidCard = (
    <>
      <div className="flex flex-col gap-y-3">
        <span className="text-sm leading-5 text-neutral-300">Belum Dibayar</span>
        <div className="flex flex-col gap-y-1.5">
          <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">
            {IDRFormatter.toCurrency(summary.unpaidAmount)}
          </span>
          <span className="text-warning-400 text-xs leading-4">{summary.unpaidCount} faktur menunggu</span>
        </div>
      </div>
      <div className="bg-warning-50 flex size-10 items-center justify-center rounded-lg">
        <Image
          src="/assets/images/circle-dollar-sign-icon-warning-300-w20-h20.svg"
          alt="Belum Dibayar"
          width={20}
          height={20}
        />
      </div>
    </>
  );

  const overdueCard = (
    <>
      <div className="flex flex-col gap-y-3">
        <span className="text-sm leading-5 text-neutral-300">Jatuh Tempo</span>
        <div className="flex flex-col gap-y-1.5">
          <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">
            {IDRFormatter.toCurrency(summary.overdueAmount)}
          </span>
          <span className="text-error-400 text-xs leading-4">{summary.overdueCount} faktur terlambat</span>
        </div>
      </div>
      <div className="bg-error-50 flex size-10 items-center justify-center rounded-lg">
        <Image
          src="/assets/images/circle-dollar-sign-icon-warning-300-w20-h20.svg"
          alt="Jatuh Tempo"
          width={20}
          height={20}
        />
      </div>
    </>
  );

  const paidCard = (
    <>
      <div className="flex flex-col gap-y-3">
        <span className="text-sm leading-5 text-neutral-300">Telah Dibayar</span>
        <div className="flex flex-col gap-y-1.5">
          <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">
            {summary.paidCount}
          </span>
          <span className="text-success-400 text-xs leading-4">Pembayaran selesai</span>
        </div>
      </div>
      <div className="bg-success-50 flex size-10 items-center justify-center rounded-lg">
        <Image src="/assets/images/check-icon-success-300-w40-h40.svg" alt="Telah Dibayar" width={20} height={20} />
      </div>
    </>
  );

  const warningBase =
    "border-b-warning-200/50 border-warning-50 border-warning-200/60 flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5";
  const errorBase =
    "border-b-error-200/50 border-error-50 border-error-200/60 flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5";
  const successBase =
    "border-b-success-200/50 border-success-50 border-success-200/60 flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5";

  return (
    <div className="flex flex-row gap-x-4">
      {/* Belum Dibayar */}
      {summary.unpaidCount > 0 ? (
        <Link href="/invoices/outgoing/unpaid" className={`${warningBase} transition-shadow hover:shadow-sm`}>
          {unpaidCard}
        </Link>
      ) : (
        <div className={`${warningBase} opacity-50`}>{unpaidCard}</div>
      )}

      {/* Jatuh Tempo */}
      {summary.overdueCount > 0 ? (
        <Link href="/invoices/outgoing/overdue" className={`${errorBase} transition-shadow hover:shadow-sm`}>
          {overdueCard}
        </Link>
      ) : (
        <div className={`${errorBase} opacity-50`}>{overdueCard}</div>
      )}

      {/* Telah Dibayar */}
      {summary.paidCount > 0 ? (
        <Link href="/invoices/outgoing/paid" className={`${successBase} transition-shadow hover:shadow-sm`}>
          {paidCard}
        </Link>
      ) : (
        <div className={`${successBase} opacity-50`}>{paidCard}</div>
      )}
    </div>
  );
}
