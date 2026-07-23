import clsx from "clsx";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";

type BalanceSheetIdentityRowProps = {
  grandTotal: number;
  isBalanced: boolean;
};

export function BalanceSheetIdentityRow({ grandTotal, isBalanced }: BalanceSheetIdentityRowProps) {
  return (
    <tr
      aria-label="Konfirmasi keseimbangan: Total Aset sama dengan Total Liabilitas ditambah Ekuitas"
      className="border-t-2 border-neutral-300 bg-primary-50"
    >
      <td className="px-6 py-4 text-sm font-semibold text-neutral-500">
        <span className="flex items-center gap-x-2">
          {isBalanced ? (
            <CheckCircleIcon aria-hidden className={clsx("size-4 text-success-500")} />
          ) : (
            <ExclamationTriangleIcon aria-hidden className={clsx("size-4 text-warning-500")} />
          )}
          Total Aset = Total Liabilitas + Ekuitas
        </span>
      </td>
      <td className="px-6 py-4 text-right text-sm font-bold text-neutral-500">
        <BalanceDisplay value={grandTotal} />
      </td>
    </tr>
  );
}
