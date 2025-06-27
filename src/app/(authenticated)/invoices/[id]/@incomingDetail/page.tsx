import { BackButton } from "@/core/presentations/components/back-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { PageContent } from "@/core/presentations/components/page-content";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { DateTime } from "luxon";
import { InvoiceSummaryImpl } from "@/app/(authenticated)/invoices/[id]/@incomingDetail/_components/invoice-summary-impl";
import { Card } from "@/core/presentations/components/card";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { Timeline } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/timeline";
import { BanknotesIcon, ClockIcon, CreditCardIcon } from "@heroicons/react/20/solid";
import { DocumentTableImpl } from "./_components/document-table-impl";
import { PaymentDetailImpl } from "./_components/payment-detail-impl";
import { TimelineImpl } from "./_components/timeline-impl";
import { CreditCardPaymentInstruction } from "./_components/cc-payment-instruction";
import { VirtualAccountPaymentInstruction } from "./_components/va-payment-instruction";
import { VirtualAccountPaymentInstructionImpl } from "./_components/va-payment-instruction-impl";

export default function IncomingInvoiceDetailPage() {
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-1 flex-row justify-between space-x-4">
          <div className="flex">
            <BackButton />
          </div>
        </div>
        <div className="flex-1">
          <InvoiceSummaryImpl />
        </div>
        <div className="flex flex-1 flex-row space-x-4">
          <div className="flex flex-2 flex-col space-y-4">
            <DocumentTableImpl />
          </div>
          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex-1">
              <PaymentDetailImpl />
            </div>
            <div className="flex-1">
              <TimelineImpl />
            </div>
            <div className="flex-1">
              <CreditCardPaymentInstruction />
            </div>
            <div className="flex-1">
              <VirtualAccountPaymentInstructionImpl />
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  );
}
