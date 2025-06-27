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

export default function IncomingInvoiceDetailPage() {
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-1 flex-row justify-between space-x-4">
          <div className="flex">
            <BackButton />
          </div>
          <div className="flex self-end">
            <FilledButton>Lihat Status</FilledButton>
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
            <div className="flex flex-col">
              <CreditCardPaymentInstruction />
            </div>
            <Card>
              <div className="flex flex-col">
                <div className="mb-4 text-lg font-semibold">Petunjuk Pembayaran</div>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-600">Metode Pembayaran</div>
                    <div className="font-bold">BRI Virtual Account</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-600">Nomor Virtual Account</div>
                    <div className="font-bold">1234567890</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-600">Nominal Pembayaran</div>
                    <div className="font-bold">{IDRFormatter.toCurrency(100000)}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-600">Bayar Sebelum</div>
                    <div className="font-bold">{DateTime.now().plus({ days: 1 }).toFormat("dd LLLL yyyy hh:mm")}</div>
                  </div>
                  <div className="flex-1">
                    <FilledButton>Sudah Bayar</FilledButton>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContent>
  );
}
