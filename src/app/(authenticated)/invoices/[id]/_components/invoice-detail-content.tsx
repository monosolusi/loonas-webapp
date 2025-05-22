import { DateTime } from "luxon";
import { PaymentDetail } from "@/app/(authenticated)/invoices/[id]/_components/payment-detail";
import React from "react";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";
import { SeeDisbursementStatus } from "@/app/(authenticated)/invoices/[id]/_components/see-disbursement-status";

export interface InvoiceDetailItem {
  id: string;
  status: InvoiceStatus;
  documents: {
    id: string;
    name: string;
    invoiceNumber?: string;
    invoiceDate: DateTime;
    dueDate: DateTime;
    amount: number;
    note?: string;
  }[];
  paymentDetail: {
    receiverName: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    total: number;
    fee: number;
  };
}

interface InvoiceDetailContentProps {
  data: InvoiceDetailItem;
}

const getFirstUuidPart = (uuid: string): string => {
  return uuid.split("-")[0];
};

export function InvoiceDetailContent(props: InvoiceDetailContentProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-row space-x-2 justify-between">
        <div className="flex flex-col space-y-1">
          <div className="flex">
            <InvoiceStatusChip status={props.data.status} />
          </div>
          <p className="text-xl font-bold uppercase">Faktur Masukan: {getFirstUuidPart(props.data.id)}</p>
          <p className="text-sm text-gray-400">{props.data.id}</p>
        </div>
        <SeeDisbursementStatus invoiceId={props.data.id} status={props.data.status} />
      </div>
      <div className="flex flex-row space-x-2">
        <div className="flex-3">
          <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 text-left text-sm font-semibold sm:pl-5">
                  Dokumen
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  <div className="flex flex-col space-y-1">
                    <span>Tanggal Faktur</span>
                    <span>Tanggal Jatuh Temo</span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="hidden relative py-3.5 pr-4 pl-3 text-sm text-right text-gray-900 sm:pr-5 sm:table-cell"
                >
                  Jumlah
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              {props.data.documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="py-4 pl-4 text-sm font-medium whitespace-nowrap sm:pl-5">
                    <div className="flex flex-col space-y-1">
                      <div className="text-gray-900 font-bold">
                        <div className="overflow-hidden overflow-ellipsis max-w-[220px]">
                          {doc.name}
                        </div>
                      </div>
                      {doc.invoiceNumber && <div className="text-xs text-gray-500">{doc.invoiceNumber}</div>}
                      {doc.note && <div className="text-xs text-gray-500">{doc.note}</div>}
                    </div>
                  </td>

                  <td className="hidden px-3 py-4 text-sm text-left whitespace-nowrap text-gray-500 sm:table-cell">
                    <div>
                      <span className="block">
                        <strong className="font-bold text-gray-900">Faktur:</strong> &nbsp;
                        {doc.invoiceDate.setLocale("id-id").toLocaleString()}
                      </span>
                      <span className="block">
                        <strong className="font-bold text-gray-900">Jatuh Tempo:</strong> &nbsp;
                        {doc.dueDate.setLocale("id-id").toLocaleString()}
                      </span>
                    </div>
                  </td>

                  <td
                    className="hidden relative py-4 pr-4 pl-3 text-right text-sm whitespace-nowrap sm:pr-5 sm:table-cell"
                  >
                    Rp 100.000.000
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex-2">
          <PaymentDetail
            receiverName={props.data.paymentDetail.receiverName}
            bankName={props.data.paymentDetail.bankName}
            accountNumber={props.data.paymentDetail.accountNumber}
            accountHolderName={props.data.paymentDetail.accountHolderName}
            total={props.data.paymentDetail.total}
            fee={props.data.paymentDetail.fee}
            totalPayment={props.data.paymentDetail.total + props.data.paymentDetail.fee}
            showActions={false}
          />
        </div>
      </div>
    </div>
  );
}
