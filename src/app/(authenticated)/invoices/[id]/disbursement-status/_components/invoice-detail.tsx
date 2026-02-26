import { SectionCard } from "@/core/presentations/components/section-card";

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
          <div key={doc.number} className="flex flex-row gap-x-4 border-b border-b-neutral-100 px-6 py-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-100">
              <div className="text-xs leading-4 font-bold">{doc.number}</div>
            </div>
            <div className="flex flex-1 flex-col gap-y-3">
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-row items-center justify-between">
                  <div className="text-sm leading-5 font-medium">{doc.invoiceNumber}</div>
                  <div className="text-sm leading-5 font-bold">{doc.amount}</div>
                </div>
                <div className="text-xs leading-4">{doc.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
