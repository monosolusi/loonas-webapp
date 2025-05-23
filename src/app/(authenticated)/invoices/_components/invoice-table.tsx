"use client";

import React, { useMemo } from "react";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { DateTime } from "luxon";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { EmptyInvoiceState } from "@/app/(authenticated)/invoices/_components/empty-invoice-state";
import { TableContainer } from "@/core/presentations/components/table-container";
import { TableHeader } from "@/core/presentations/components/table-header";
import { Table } from "@/core/presentations/components/table";
import { TableBody } from "@/core/presentations/components/table-body";
import { InvoiceTypeIcon } from "@/app/(authenticated)/invoices/_components/invoice-type-icon";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import Link from "next/link";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";

export interface InvoiceRow {
  id: string;
  type: InvoiceType;
  receiverName: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  total: number;
  status: PaymentRequestStatus;
  paymentMethod: string;
  createdAt: DateTime;
}

interface InvoiceTableProps {
  data: InvoiceRow[];
}

export function InvoiceTable(props: InvoiceTableProps) {
  const generatedBodyItems = useMemo(() => {
    return props.data.map((row) => ({
      row: [
        { node: <InvoiceTypeIcon type={row.type} />, hideOnMobile: true },
        {
          node: (
            <Link
              href={`/invoices/${row.id}`}
              className="font-bold text-primary-default  hover:underline line-clamp-2"
            >
              {row.receiverName}
            </Link>
          ),
          hideOnMobile: false
        },
        { node: row.bankAccount.accountHolderName, hideOnMobile: false },
        { node: IDRFormatter.toCurrency(row.total), hideOnMobile: false },
        { node: <InvoiceStatusChip status={row.status} />, hideOnMobile: false },
        { node: row.paymentMethod, hideOnMobile: false },
        { node: row.createdAt.setLocale("id").toFormat("dd LLL yyyy, HH:mm"), hideOnMobile: false }
      ]
    }));
  }, [props.data]);

  if (props.data.length === 0) return <EmptyInvoiceState />;
  return (
    <TableContainer>
      <Table>
        <TableHeader items={[
          { node: <></>, hideOnMobile: false },
          { node: "Nama Penerima", hideOnMobile: false },
          { node: "Bank & No. Rekening", hideOnMobile: false },
          { node: "Total", hideOnMobile: false },
          { node: "Status", hideOnMobile: false },
          { node: "Metode", hideOnMobile: false },
          { node: "Tanggal Dibuat", hideOnMobile: false }
        ]} />
        <TableBody items={generatedBodyItems} />
      </Table>
    </TableContainer>
    // <div>
    //   <div className="flow-root">
    //     <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    //       <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
    //         <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
    //           <table className="min-w-full divide-y divide-gray-300">
    //             <thead className="bg-gray-50">
    //             <tr>
    //               <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-6" scope="col">
    //               </th>
    //               <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
    //                 Nama Penerima
    //               </th>
    //               <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
    //                 Bank & No. Rekening
    //               </th>
    //               <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
    //                 Total
    //               </th>
    //               <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
    //                 Status
    //               </th>
    //               <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
    //                 Metode
    //               </th>
    //               <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
    //                 Tanggal Dibuat
    //               </th>
    //             </tr>
    //             </thead>
    //             <tbody className="divide-y divide-gray-200 bg-white">
    //             {props.data.map((row, idx) => (
    //               <tr key={idx}>
    //                 <td
    //                   className="py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6">
    //                   <InvoiceTypeIcon type={row.type} />
    //                 </td>
    //                 <td className="whitespace-normal px-3 py-4 text-sm text-black max-w-[200px]">
    //                   <Link href={`/invoices/${row.id}`}
    //                         className="font-bold underline line-clamp-2 cursor-pointer hover:text-primary-default">
    //                     {row.receiverName}
    //                   </Link>
    //                 </td>
    //                 <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
    //                   <div>
    //                     <div>{row.bankAccount.accountHolderName}</div>
    //                     <div className="text-xs text-gray-400">{row.bankAccount.bankName}</div>
    //                     <div className="text-xs text-gray-400">{row.bankAccount.accountNumber}</div>
    //                   </div>
    //                 </td>
    //                 <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
    //                   {IDRFormatter.toCurrency(row.total)}
    //                 </td>
    //                 <td className="whitespace-nowrap px-3 py-4 text-xs font-semibold rounded">
    //                     <span className={`px-2 py-1 rounded ${statusChips[row.status].className}`}>
    //                       {statusChips[row.status].label}
    //                     </span>
    //                 </td>
    //                 <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
    //                   {row.paymentMethod}
    //                 </td>
    //                 <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
    //                   {row.createdAt.setLocale("id").toFormat("dd LLL yyyy, HH:mm")}
    //                 </td>
    //               </tr>
    //             ))}
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
