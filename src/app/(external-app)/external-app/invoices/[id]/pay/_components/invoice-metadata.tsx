import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { SectionCard } from "@/core/presentations/components/section-card";
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
    <SectionCard title="Detail Faktur">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-neutral-500">ID Faktur</span>
          <span className="text-sm text-neutral-900">{props.id}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-left sm:grid-cols-3 lg:flex lg:flex-row lg:justify-between lg:gap-0 lg:space-x-4">
          <div className="flex flex-col">
            <span className="text-sm text-neutral-500">Pengirim</span>
            <span className="text-sm text-neutral-900">{props.sender.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-neutral-500">Penerima</span>
            <span className="text-sm text-neutral-900">{props.recipient.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-neutral-500">Nilai Faktur</span>
            <span className="text-sm text-neutral-900">
              <CurrencyDisplay value={props.invoiceValue} />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-neutral-500">Tgl. Jatuh Tempo</span>
            <span className="text-sm text-neutral-900">
              {props.dueDate.setLocale("id-ID").toFormat("dd MMMM yyyy HH:mm")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-neutral-500">Tgl. Dibuat</span>
            <span className="text-sm text-neutral-900">
              {props.createdAt.setLocale("id-ID").toFormat("dd MMMM yyyy HH:mm")}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
