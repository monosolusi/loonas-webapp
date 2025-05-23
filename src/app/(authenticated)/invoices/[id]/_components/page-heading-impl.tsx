"use client";

import { PageHeading } from "@/core/presentations/components/page-heading";
import { useGetInvoice } from "@/features/invoice/presentations/providers/get-invoice";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

export function PageHeadingImpl() {
  const { invoice, loading } = useGetInvoice();

  const getFirstUuidPart = (uuid: string): string => {
    return uuid.split("-")[0];
  };

  if (!invoice || loading) return null;
  return (
    <PageHeading>
      <span className="group relative inline-flex items-center uppercase">
        Faktur Masukan: {getFirstUuidPart(invoice.id)}
        <InformationCircleIcon className="h-6 w-6 ml-1 text-gray-500 cursor-help" />
        <span
          className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-black rounded-md whitespace-nowrap"
        >
          {invoice.id}
        </span>
      </span>
    </PageHeading>
  );
}
