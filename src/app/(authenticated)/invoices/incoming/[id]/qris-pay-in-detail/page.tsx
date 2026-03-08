"use client";

import { PageContent } from "@/core/presentations/components/page-content";
import { TextHeadingWithUnderline } from "@/core/presentations/components/text-heading-with-underline";
import { RemainingPaymentTimeImpl } from "@/app/(authenticated)/invoices/incoming/[id]/qris-pay-in-detail/_components/remaining-payment-time-impl";
import { QrisPayInDetailBoxImpl } from "@/app/(authenticated)/invoices/incoming/[id]/qris-pay-in-detail/_components/qris-pay-in-detail-box-impl";
import { PaymentDetailImpl } from "@/app/(authenticated)/invoices/incoming/[id]/qris-pay-in-detail/_components/payment-detail-impl";

export default function QrisPayInDetailPage() {
  return (
    <PageContent>
      <div className="flex flex-col gap-y-5">
        <TextHeadingWithUnderline>Harap Lakukan Pembayaran</TextHeadingWithUnderline>
        <div className="flex flex-row gap-x-4">
          <div className="flex flex-1 flex-col gap-y-4">
            <RemainingPaymentTimeImpl />
            <QrisPayInDetailBoxImpl />
          </div>
          <div className="flex flex-1">
            <PaymentDetailImpl />
          </div>
        </div>
      </div>
    </PageContent>
  );
}
