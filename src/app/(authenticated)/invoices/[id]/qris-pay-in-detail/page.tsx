"use client";

import { PageContent } from "@/core/presentations/components/page-content";
import { TextHeadingWithUnderline } from "@/core/presentations/components/text-heading-with-underline";
import { PaymentDetail } from "@/app/(authenticated)/invoices/_components/payment-detail";
import { QrisPayInDetailBox } from "@/app/(authenticated)/invoices/[id]/qris-pay-in-detail/_components/qris-pay-in-detail-box";
import { RemainingPaymentTimeImpl } from "@/app/(authenticated)/invoices/[id]/qris-pay-in-detail/_components/remaining-payment-time-impl";

export default function QrisPayInDetailPage() {
  return (
    <PageContent>
      <div className="flex flex-col gap-y-5">
        <TextHeadingWithUnderline>Harap Lakukan Pembayaran</TextHeadingWithUnderline>
        <div className="flex flex-row gap-x-4">
          <div className="flex flex-1 flex-col gap-y-4">
            {/*  RemainingPaymentTime dan QrisPayInDetailBox */}
            <RemainingPaymentTimeImpl />
            <QrisPayInDetailBox
              payInDetail={{ id: "3728ac60-dad9-4215-a0f5-e6b637bf7939" }}
              merchant={{ name: "PT. Tumbuh Adidaya Perkasa" }}
              qrString="some-random-string"
            />
          </div>
          <div className="flex flex-1">
            {/*  PaymentDetail */}
            <PaymentDetail
              invoiceId="1234567890"
              receiverName="Test"
              bankName="BCA"
              accountNumber="1234567890"
              accountHolderName="AAa"
              total={100000}
              fee={1000}
              totalPayment={101000}
              showActions={false}
            />
          </div>
        </div>
      </div>
    </PageContent>
  );
}
