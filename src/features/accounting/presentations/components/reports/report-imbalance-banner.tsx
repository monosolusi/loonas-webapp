import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { NumberDisplay } from "@/core/presentations/components/number-display";

type ReportImbalanceBannerProps = {
  imbalance: {
    readonly isBalanced: boolean;
    readonly delta: number;
  };
};

export function ReportImbalanceBanner({ imbalance }: ReportImbalanceBannerProps) {
  const absDelta = Math.abs(imbalance.delta);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-row items-start gap-x-3 rounded-lg border border-warning-400 bg-warning-50 px-4 py-3"
    >
      <ExclamationTriangleIcon className="mt-0.5 size-5 shrink-0 text-warning-500" aria-hidden="true" />
      <div className="flex flex-col gap-y-0.5">
        <span className="text-sm font-semibold text-warning-500">Laporan tidak seimbang</span>
        <span className="text-sm text-warning-500">
          {absDelta > 0 ? (
            <>
              Terdapat selisih sebesar <NumberDisplay value={absDelta} prefix="Rp" />. Periksa kembali jurnal dengan tim
              Anda.
            </>
          ) : (
            "Periksa kembali jurnal dengan tim Anda."
          )}
        </span>
      </div>
    </div>
  );
}
