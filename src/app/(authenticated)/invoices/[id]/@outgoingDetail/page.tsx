import { PageContent } from "@/core/presentations/components/page-content";
import { BackButton } from "@/core/presentations/components/back-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { InvoiceSummaryImpl } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/invoice-summary-impl";
import { InvoicePreviewImpl } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/invoice-preview-impl";
import { ErrorDisplayImpl } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/error-display-impl";
import { SendInvoiceButton } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/send-invoice-button";

export default function OutgoingInvoiceDetailPage() {
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-1 flex-row justify-between space-x-4">
          <div className="flex">
            <BackButton />
          </div>
          <div className="flex flex-1 flex-row justify-end space-x-2 self-end">
            <div className="flex">
              <OutlinedButton>Download PDF</OutlinedButton>
            </div>
            <div className="flex">
              <SendInvoiceButton />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <ErrorDisplayImpl />
        </div>
        <div className="flex-1">
          <InvoiceSummaryImpl />
        </div>
        <div className="flex flex-1">
          <InvoicePreviewImpl />
        </div>
      </div>
    </PageContent>
  );
}
