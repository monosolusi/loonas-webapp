import { Card } from "@/core/presentations/components/card";
import { CardDetailItem } from "@/core/presentations/components/card-detail-item";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { DateTime } from "luxon";

interface InvoiceMetadataProps {
  id: string;
  sender: { name: string };
  recipient: { name: string };
  invoiceValue: number;
  dueDate: DateTime;
  createdAt: DateTime;
}

export function InvoiceMetadata(props: InvoiceMetadataProps) {
  return (
    <Card>
      <div className="flex flex-col space-y-4">
        <CardDetailItem label="ID Faktur">{props.id}</CardDetailItem>
        <div className="flex flex-row justify-between space-x-4 text-left">
          <CardDetailItem label="Pengirim">{props.sender.name}</CardDetailItem>
          <CardDetailItem label="Penerima">{props.recipient.name}</CardDetailItem>
          <CardDetailItem label="Nilai Faktur">
            <CurrencyDisplay value={props.invoiceValue} />
          </CardDetailItem>
          <CardDetailItem label="Tgl. Jatuh Tempo">
            {props.dueDate.setLocale("id-ID").toFormat("dd MMMM yyyy HH:mm")}
          </CardDetailItem>
          <CardDetailItem label="Tgl. Dibuat">
            {props.createdAt.setLocale("id-ID").toFormat("dd MMMM yyyy HH:mm")}
          </CardDetailItem>
        </div>
      </div>
    </Card>
  );
}
