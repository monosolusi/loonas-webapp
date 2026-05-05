"use client";

import { DateTime } from "luxon";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";

type PosSalesTableRowProps = {
  sale: PosSaleEntity;
  onClick: (saleId: string) => void;
};

export function PosSalesTableRow({ sale, onClick }: PosSalesTableRowProps) {
  const dt = DateTime.fromISO(sale.invoiceDate);
  const dateLabel = dt.isValid ? dt.setLocale("id-ID").toFormat("dd LLL yyyy, HH:mm") : sale.invoiceDate;
  const itemCount = sale.items.reduce((sum, item) => sum + item.qty, 0);
  const methodLabel = sale.paymentGateway?.title || "—";

  return (
    <button
      type="button"
      onClick={() => onClick(sale.id)}
      className="hover:border-l-primary-300 hover:bg-primary-50 grid w-full grid-cols-[2fr_1.5fr_1fr_0.5fr_1fr_24px] cursor-pointer items-center gap-x-4 border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 text-left transition-colors last:border-b-0"
    >
      <span className="truncate text-sm font-medium text-neutral-500">{sale.receiptNumber}</span>
      <span className="text-sm tabular-nums text-neutral-400">{dateLabel}</span>
      <span className="truncate text-sm text-neutral-400">{methodLabel}</span>
      <span className="text-sm tabular-nums text-neutral-400">{itemCount}</span>
      <span className="text-right text-sm font-semibold tabular-nums text-neutral-500">
        Rp <NumberDisplay value={sale.total} />
      </span>
      <ChevronRightIcon className="size-4 text-neutral-300" />
    </button>
  );
}
