import { SectionCard } from "@/core/presentations/components/section-card";

const masuk = 24_500_000;
const keluar = 18_200_000;
const selisih = masuk - keluar;
const maxValue = Math.max(masuk, keluar);

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function DashboardCashflowSummary() {
  const isPositive = selisih >= 0;

  return (
    <SectionCard title="Arus Kas Bulan Ini" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Masuk</span>
            <span className="text-sm font-semibold text-neutral-500">{formatRupiah(masuk)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-50">
            <div
              className="bg-success-200 h-2 rounded-full"
              style={{ width: `${(masuk / maxValue) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Keluar</span>
            <span className="text-sm font-semibold text-neutral-500">{formatRupiah(keluar)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-50">
            <div
              className="bg-error-200 h-2 rounded-full"
              style={{ width: `${(keluar / maxValue) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <span className="text-sm text-neutral-400">Selisih</span>
          <div className="flex items-center gap-x-1">
            <span className={`text-sm font-semibold ${isPositive ? "text-success-200" : "text-error-200"}`}>
              {isPositive ? "+" : "-"}
              {formatRupiah(Math.abs(selisih))}
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
