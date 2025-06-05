import { DetailItem } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/detail-item";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";
import { Card } from "@/core/presentations/components/card";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { DateTime } from "luxon";

interface InvoiceSummaryProps {
  id: string;
  status: OutgoingInvoiceStatus;
  total: number;
  createdAt: DateTime;
}

export function InvoiceSummary(props: InvoiceSummaryProps) {
  return (
    <Card>
      <div className="flex flex-col space-y-4">
        <DetailItem label="ID Faktur">{props.id}</DetailItem>
        <div className="flex flex-row justify-between space-x-4 text-left">
          <DetailItem label="ID Faktur">
            <InvoiceStatusChip status={props.status} />
          </DetailItem>
          <DetailItem label="Jenis Faktur">Faktur Keluaran</DetailItem>
          <DetailItem label="Nilai Faktur">{IDRFormatter.toCurrency(props.total)}</DetailItem>
          <DetailItem label="Tanggal Dibuat">
            {props.createdAt.setLocale("id-ID").toFormat("dd MMMM yyyy hh:mm")}
          </DetailItem>
        </div>
      </div>
    </Card>
  );
}
