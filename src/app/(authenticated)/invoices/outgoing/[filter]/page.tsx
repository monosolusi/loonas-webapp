"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FilteredOutgoingInvoiceTableImpl } from "./_components/filtered-outgoing-invoice-table-impl";

const FILTER_CONFIG: Record<string, { title: string }> = {
  unpaid: { title: "Faktur Belum Dibayar" },
  paid: { title: "Faktur Telah Dibayar" },
  overdue: { title: "Faktur Jatuh Tempo" },
};

export default function OutgoingFilteredInvoicePage() {
  const { filter } = useParams<{ filter: string }>();
  const router = useRouter();

  const config = FILTER_CONFIG[filter];

  if (!config) {
    router.replace("/invoices/outgoing");
    return null;
  }

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="flex flex-row items-center gap-x-3">
        <Link
          href="/invoices/outgoing"
          className="flex size-9 items-center justify-center rounded-lg border border-neutral-100 hover:bg-neutral-50"
        >
          <Image
            src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg"
            alt="Back"
            width={16}
            height={16}
          />
        </Link>
        <div className="flex flex-col gap-y-1">
          <span className="text-2xl leading-8 font-bold tracking-tight">{config.title}</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-y-4">
        <FilteredOutgoingInvoiceTableImpl filter={filter} />
      </div>
    </div>
  );
}
