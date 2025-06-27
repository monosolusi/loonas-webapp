import { BackButton } from "@/core/presentations/components/back-button";
import { PageContent } from "@/core/presentations/components/page-content";
import { InvoiceSummaryImpl } from "@/app/(authenticated)/invoices/[id]/@incomingDetail/_components/invoice-summary-impl";
import { DocumentTableImpl } from "./_components/document-table-impl";
import { PaymentDetailImpl } from "./_components/payment-detail-impl";
import { TimelineImpl } from "./_components/timeline-impl";
import { CreditCardPaymentInstruction } from "./_components/cc-payment-instruction";
import { VirtualAccountPaymentInstructionImpl } from "./_components/va-payment-instruction-impl";

export default function IncomingInvoiceDetailPage() {
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row justify-between space-x-4">
          <div className="flex">
            <BackButton />
          </div>
        </div>
        <InvoiceSummaryImpl />
        <div className="flex flex-row space-x-4">
          <div className="flex flex-2 flex-col space-y-4">
            <PaymentDetailImpl />
            <DocumentTableImpl />
          </div>
          <div className="flex flex-1 flex-col space-y-4">
            <VirtualAccountPaymentInstructionImpl />
            <CreditCardPaymentInstruction />
            <TimelineImpl />
          </div>
        </div>
      </div>
    </PageContent>
  );
}
