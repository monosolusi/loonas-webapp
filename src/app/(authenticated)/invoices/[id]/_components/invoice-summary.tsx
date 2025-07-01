import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";
import { Card } from "@/core/presentations/components/card";
import { CardDetailItem } from "@/core/presentations/components/card-detail-item";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { DateTime } from "luxon";

interface InvoiceSummaryProps {
  id: string;
  status: InvoiceStatus;
  total: number;
  createdAt: DateTime;
  type: InvoiceType;
}

export function InvoiceSummary(props: InvoiceSummaryProps) {
  return (
    <Card>
      <div className="flex flex-col space-y-4">
        <CardDetailItem label="ID Faktur">{props.id}</CardDetailItem>
        <div className="flex flex-row justify-between space-x-4 text-left">
          <CardDetailItem label="Status Faktur">
            <InvoiceStatusChip status={props.status} />
          </CardDetailItem>
          <CardDetailItem label="Jenis Faktur">
            {props.type === InvoiceType.OUTGOING ? "Faktur Keluaran" : "Faktur Masukan"}
          </CardDetailItem>
          <CardDetailItem label="Nilai Faktur">{IDRFormatter.toCurrency(props.total)}</CardDetailItem>
          <CardDetailItem label="Tanggal Dibuat">
            {props.createdAt.setLocale("id-ID").toFormat("dd MMMM yyyy HH:mm")}
          </CardDetailItem>
        </div>
      </div>
    </Card>
  );
}
