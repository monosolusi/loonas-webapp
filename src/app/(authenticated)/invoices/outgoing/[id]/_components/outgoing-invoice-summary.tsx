"use client";

interface OutgoingInvoiceSummaryProps {
  total: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: string;
  tax: string;
}

export function OutgoingInvoiceSummary({
  total,
  invoiceNumber,
  invoiceDate,
  dueDate,
  subtotal,
  tax,
}: OutgoingInvoiceSummaryProps) {
  return (
    <div className="flex flex-col gap-y-5">
      {/* Total */}
      <div className="flex flex-col gap-y-1">
        <span className="text-xs leading-4 text-neutral-200">Total Faktur</span>
        <span className="text-2xl leading-8 font-semibold tracking-tight">{total}</span>
      </div>

      {/* Breakdown Card */}
      <div className="flex flex-col gap-y-3 rounded-lg border border-neutral-100 p-4">
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Nomor Faktur</span>
          <span className="text-sm leading-5 text-neutral-500">{invoiceNumber}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Tanggal Faktur</span>
          <span className="text-sm leading-5 text-neutral-500">{invoiceDate}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Jatuh Tempo</span>
          <span className="text-sm leading-5 text-neutral-500">{dueDate}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Subtotal</span>
          <span className="text-sm leading-5 text-neutral-500">{subtotal}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Pajak</span>
          <span className="text-sm leading-5 text-neutral-500">{tax}</span>
        </div>
      </div>
    </div>
  );
}
