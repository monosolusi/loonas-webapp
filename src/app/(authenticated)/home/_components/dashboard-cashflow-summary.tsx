"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { useGetCashFlow } from "@/features/invoice/presentations/hooks/use-get-cash-flow";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { DateTime } from "luxon";

function DashboardCashflowSummarySkeleton() {
  return (
    <SectionCard title="Arus Kas Bulan Ini" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="flex animate-pulse flex-col gap-y-4">
        <div className="flex flex-col gap-y-1.5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-12 rounded bg-neutral-100" />
            <div className="h-4 w-28 rounded bg-neutral-100" />
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-50" />
        </div>

        <div className="flex flex-col gap-y-1.5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-12 rounded bg-neutral-100" />
            <div className="h-4 w-28 rounded bg-neutral-100" />
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-50" />
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <div className="h-4 w-12 rounded bg-neutral-100" />
          <div className="h-4 w-32 rounded bg-neutral-100" />
        </div>
      </div>
    </SectionCard>
  );
}

export function DashboardCashflowSummary() {
  const now = DateTime.now();
  const { cashFlow, loading } = useGetCashFlow({ month: now.month, year: now.year });

  if (loading || !cashFlow) return <DashboardCashflowSummarySkeleton />;

  const masuk = cashFlow.incoming;
  const keluar = cashFlow.outgoing;
  const selisih = cashFlow.difference;
  const maxValue = Math.max(masuk, keluar);
  const isPositive = selisih >= 0;

  return (
    <SectionCard title="Arus Kas Bulan Ini" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Masuk</span>
            <span className="text-sm font-semibold text-neutral-500">{IDRFormatter.toCurrency(masuk)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-50">
            <div
              className="bg-success-200 h-2 rounded-full"
              style={{ width: maxValue > 0 ? `${(masuk / maxValue) * 100}%` : "0%" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Keluar</span>
            <span className="text-sm font-semibold text-neutral-500">{IDRFormatter.toCurrency(keluar)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-50">
            <div
              className="bg-error-200 h-2 rounded-full"
              style={{ width: maxValue > 0 ? `${(keluar / maxValue) * 100}%` : "0%" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <span className="text-sm text-neutral-400">Selisih</span>
          <div className="flex items-center gap-x-1">
            <span className={`text-sm font-semibold ${isPositive ? "text-success-200" : "text-error-200"}`}>
              {isPositive ? "+" : "-"}
              {IDRFormatter.toCurrency(Math.abs(selisih))}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={isPositive ? "text-success-200" : "text-error-200"}
            >
              {isPositive ? (
                <path
                  d="M7 11.0833V2.91667M7 2.91667L2.91667 7M7 2.91667L11.0833 7"
                  stroke="currentColor"
                  strokeWidth="1.16667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M7 2.91667V11.0833M7 11.0833L11.0833 7M7 11.0833L2.91667 7"
                  stroke="currentColor"
                  strokeWidth="1.16667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
