import React from "react";
import { DateTime } from "luxon";
import clsx from "clsx";

interface InvoiceTopSummaryProps {
  invoiceNumber: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  /** Force the desktop (self-end) alignment regardless of viewport — used by headless PDF rendering. */
  forceDesktop?: boolean;
}

export function InvoiceTopSummary(props: InvoiceTopSummaryProps) {
  return (
    <div className={clsx("flex flex-1 flex-col space-y-1", props.forceDesktop ? "self-end" : "lg:self-end")}>
      <h3 className="mb-5 text-right text-2xl font-semibold text-neutral-500">INVOICE</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <div className="text-end font-light text-neutral-300">Referensi</div>
        <div className="flex-1 text-end font-semibold">{props.invoiceNumber}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <div className="flex-1 text-end font-light text-neutral-300">Tanggal Invoice</div>
        <div className="text-end font-semibold">{props.invoiceDate.setLocale("id").toFormat("dd MMMM yyyy")}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <div className="flex-1 text-end font-light text-neutral-300">Tanggal Jatuh Tempo</div>
        <div className="text-end font-semibold">{props.dueDate.setLocale("id").toFormat("dd MMMM yyyy")}</div>
      </div>
    </div>
  );
}
