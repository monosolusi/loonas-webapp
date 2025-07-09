"use client";

import { LogoImage } from "@/core/presentations/components/logo-image";
import { InvoiceMetadataImpl } from "../pay/_components/invoice-metadata-impl";
import { useSearchParams } from "next/navigation";
import { Card } from "@/core/presentations/components/card";
import { RemainingPaymentTime } from "@/core/presentations/components/remaining-payment-time";
import { DateTime } from "luxon";
import { VirtualAccountDetailBox } from "@/core/presentations/components/va-detail";
import { PaymentSummary } from "@/core/presentations/components/payment-summary";

export default function PayInDetailPage() {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("payment_method");
  const paymentScheme = searchParams.get("payment_scheme");

  console.log("Payment Method:", paymentMethod);
  console.log("Payment Scheme:", paymentScheme);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex-1 self-start">
          <LogoImage />
        </div>
        <div className="flex-1">
          <InvoiceMetadataImpl />
        </div>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-gray-900">Lakukan Pembayaran</h1>
            <p className="mt-2 text-sm text-gray-700">
              Silahkan membayar sesuai dengan instruksi yang diberikan di bawah ini.
            </p>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex-2">
              <Card>
                <div className="flex flex-col space-y-4">
                  <RemainingPaymentTime deadline={DateTime.now().plus({ hours: 1 })} />
                  <VirtualAccountDetailBox
                    logoUrl="https://res.cloudinary.com/monosolusi/image/upload/v1746106618/loonas/web-assets/bca-bank-central-asia-logo_hloxg2.png"
                    bankName="BCA Virtual Account"
                    accountNumber="1234567890"
                    totalPayment={1000000}
                  />
                </div>
              </Card>
            </div>
            <div className="flex-1">
              <PaymentSummary
                selectedPaymentMethod={{ title: "Virtual Account" }}
                invoiceValue={1000000}
                fee={5000}
                totalPayable={1005000}
                isDisabled={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
