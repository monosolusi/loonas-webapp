import React from "react";
import { SenderInformation } from "@/app/(authenticated)/invoices/_components/sender-information";
import { InvoiceTopSummary } from "@/app/(authenticated)/invoices/_components/invoice-top-summary";
import { DateTime } from "luxon";
import { BillTo } from "@/app/(authenticated)/invoices/_components/bill-to";
import { InvoiceItemTable } from "@/app/(authenticated)/invoices/_components/invoice-item-table";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { Note } from "@/app/(authenticated)/invoices/_components/note";
import { Tnc } from "@/app/(authenticated)/invoices/_components/tnc";
import { Signature } from "@/app/(authenticated)/invoices/_components/signature";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import clsx from "clsx";

interface InvoicePreviewProps {
  className?: string;
  /** Force the desktop (single-row) layout regardless of viewport — used by headless PDF rendering. */
  forceDesktop?: boolean;
  sender: { name: string; address: string };
  recipient: { name: string; phoneNumber: string; email: string };
  invoice: {
    id?: string;
    invoiceNumber: string;
    invoiceDate: DateTime;
    dueDate: DateTime;
    note?: string;
    tnc?: string;
  };
  signature: {
    file?: File | null;
    url?: string;
    signerName: string;
  };
  items: {
    name: string;
    description?: string;
    qty: number;
    price: number;
    discountType?: DiscountType;
    discount?: number;
    taxBase: number;
    tax: number;
    taxType: TaxType;
    total: number;
  }[];
}

export function InvoicePreview(props: InvoicePreviewProps) {
  const { forceDesktop } = props;
  return (
    <div
      className={clsx(
        "w-full rounded-lg border border-neutral-200 bg-white p-4 text-sm shadow-md sm:p-6",
        props.className,
      )}
    >
      <div className="flex flex-col space-y-4">
        <div className={clsx("flex flex-1 gap-4", forceDesktop ? "flex-row" : "flex-col lg:flex-row")}>
          <div className="flex-1">
            <SenderInformation senderName={props.sender.name} address={props.sender.address} />
          </div>
          <div className="flex-1">
            <InvoiceTopSummary
              invoiceNumber={props.invoice.invoiceNumber}
              invoiceDate={props.invoice.invoiceDate}
              dueDate={props.invoice.dueDate}
              forceDesktop={forceDesktop}
            />
          </div>
        </div>
        <div className={clsx("flex flex-col space-y-1", forceDesktop ? "mt-16 w-1/3" : "mt-8 w-full lg:mt-16 lg:w-1/3")}>
          <BillTo name={props.recipient.name} phoneNumber={props.recipient.phoneNumber} email={props.recipient.email} />
        </div>
        <div className="flex flex-1">
          <InvoiceItemTable items={props.items} forceDesktop={forceDesktop} />
        </div>
        <div className={clsx("mt-8 flex flex-1 gap-4", forceDesktop ? "flex-row" : "flex-col lg:flex-row")}>
          <div className="flex-1 flex-col space-y-4">
            <Note note={props.invoice.note} />
            <Tnc tnc={props.invoice.tnc} />
          </div>
          <div className="flex-1">
            <Signature
              signature={props.signature.file}
              signatureUrl={props.signature.url}
              invoiceDate={props.invoice.invoiceDate}
              signerName={props.signature.signerName}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-1 flex-col items-start justify-start text-xs font-light text-neutral-300 italic">
          {props.invoice.id && <div className="flex-1">[{props.invoice.id}]</div>}
          <div className="flex-1">Invoice ini dibuat dengan aplikasi loonas.id</div>
        </div>
      </div>
    </div>
  );
}
