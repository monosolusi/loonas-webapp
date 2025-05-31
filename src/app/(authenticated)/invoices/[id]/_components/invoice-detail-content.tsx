import { DateTime } from "luxon";
import { PaymentDetail } from "@/app/(authenticated)/invoices/[id]/_components/payment-detail";
import React, { useMemo } from "react";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";
import { SeeDisbursementStatus } from "@/app/(authenticated)/invoices/[id]/_components/see-disbursement-status";
import { TableContainer } from "@/core/presentations/components/table-container";
import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

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

export function InvoiceDetailContent(props: InvoiceDetailContentProps) {
  const generatedBodyItems = useMemo(() => {
    return props.data.documents.map((doc) => ({
      row: [
        {
          node: (
            <div className="flex flex-col space-y-1">
              <div className="font-bold text-gray-900">
                <div className="max-w-[220px] overflow-hidden overflow-ellipsis">{doc.name}</div>
              </div>
              {doc.invoiceNumber && <div className="text-xs text-gray-500">{doc.invoiceNumber}</div>}
              {doc.note && <div className="text-xs text-gray-500">{doc.note}</div>}
            </div>
          ),
          hideOnMobile: false,
        },
        {
          node: (
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
          ),
          hideOnMobile: true,
        },
        { node: IDRFormatter.toCurrency(doc.amount), hideOnMobile: true },
      ],
    }));
  }, [props.data.documents]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-row items-center justify-between space-x-2">
        <div className="flex">
          <InvoiceStatusChip status={props.data.status} />
        </div>
        <SeeDisbursementStatus invoiceId={props.data.id} status={props.data.status} />
      </div>
      <div className="flex flex-row space-x-2">
        <div className="flex-3">
          <TableContainer>
            <Table>
              <TableHeader
                items={[
                  { node: "Dokumen", hideOnMobile: false },
                  {
                    node: (
                      <div className="flex flex-col space-y-1">
                        <span>Tanggal Faktur</span>
                        <span>Tanggal Jatuh Temo</span>
                      </div>
                    ),
                    hideOnMobile: true,
                  },
                  { node: "Jumlah", hideOnMobile: true },
                ]}
              />
              <TableBody items={generatedBodyItems} />
            </Table>
          </TableContainer>
        </div>
        <div className="flex-2">
          <PaymentDetail
            receiverName={props.data.paymentDetail.receiverName}
            bankName={props.data.paymentDetail.bankName}
            accountNumber={props.data.paymentDetail.accountNumber}
            accountHolderName={props.data.paymentDetail.accountHolderName}
            total={props.data.paymentDetail.total}
            fee={props.data.paymentDetail.fee}
            totalPayment={Number(props.data.paymentDetail.total) + Number(props.data.paymentDetail.fee)}
            showActions={false}
          />
        </div>
      </div>
    </div>
  );
}
