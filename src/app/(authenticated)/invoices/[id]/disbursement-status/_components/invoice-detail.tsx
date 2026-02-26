import { SectionCard } from "@/core/presentations/components/section-card";
import { InvoiceRowItem } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/invoice-row-item";

interface InvoiceDetailProps {
  documents: {
    number: number;
    invoiceNumber: string;
    amount: string;
    date: string;
  }[];
}

export function InvoiceDetail(props: InvoiceDetailProps) {
  return (
    <SectionCard
      title="Rincian Faktur"
      iconSrc="/assets/images/document-icon-primary-300-w16-h16.svg"
      bodyClassName="p-0"
    >
      <div className="flex flex-col">
        {props.documents.map((doc) => (
          <InvoiceRowItem
            key={doc.number}
            number={doc.number}
            invoiceNumber={doc.invoiceNumber}
            amount={doc.amount}
            date={doc.date}
          />
        ))}
      </div>
    </SectionCard>
  );
}
