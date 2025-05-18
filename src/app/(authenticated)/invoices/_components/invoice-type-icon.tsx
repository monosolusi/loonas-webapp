import {InvoiceType} from "@/features/invoice/domain/invoice-type";
import {ArrowDownIcon, ArrowUpIcon} from "@heroicons/react/24/solid";
import React from "react";

interface InvoiceTypeIconProps {
  type: InvoiceType;
}

export function InvoiceTypeIcon(props: InvoiceTypeIconProps) {
  if (props.type === InvoiceType.INCOMING) {
    return (
      <div className="group relative flex justify-center">
        <ArrowUpIcon className="h-5 w-5 text-red-500"/>
        <span
          className="absolute z-10 invisible group-hover:visible rounded bg-gray-900 text-white text-xs py-1 px-2 left-7 top-1 whitespace-nowrap"
        >
        Faktur Masukan (Uang Keluar)
      </span>
      </div>
    )
  } else if (props.type === InvoiceType.OUTGOING) {
    return (
      <div className="group relative flex justify-center">
        <ArrowDownIcon className="h-5 w-5 text-emerald-500"/>
        <span
          className="absolute z-10 invisible group-hover:visible rounded bg-gray-900 text-white text-xs py-1 px-2 left-7 top-1 whitespace-nowrap">
        Faktur Keluaran (Uang Masuk)
      </span>
      </div>
    )
  } else return null;
}
