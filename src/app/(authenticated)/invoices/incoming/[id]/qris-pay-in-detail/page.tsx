"use client";

import { CreateIncomingSteppers } from "@/features/invoice/presentations/components/create-incoming-steppers";
import { RemainingPaymentTime } from "@/core/presentations/components/remaining-payment-time";
import { QrisPayInDetailBox } from "@/app/(authenticated)/invoices/incoming/[id]/qris-pay-in-detail/_components/qris-pay-in-detail-box";
import { PaymentDetail } from "@/app/(authenticated)/invoices/_components/payment-detail";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useParams, useRouter } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { useGetIncomingInvoicePayInDetail } from "@/features/payment/presentations/hooks/use-get-incoming-invoice-pay-in-detail";
import { usePayInRouteGuard } from "@/features/payment/presentations/hooks/use-pay-in-route-guard";
import { QrisPayInDetailEntity } from "@/features/payment/domain/entities/qris-pay-in-detail-entity";
import { isIncomingInvoice } from "@/features/invoice/domain/guards/invoice-guards";

export default function QrisPayInDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { invoice, loading: invoiceLoading } = useGetInvoice({ id });
  const { payInDetail, loading: payInLoading } = useGetIncomingInvoicePayInDetail({ invoice: { id } });

  const redirecting = usePayInRouteGuard({
    invoiceId: id,
    currentRoute: "qris-pay-in-detail",
    payInDetail,
    loading: payInLoading,
  });

  const isLoading = invoiceLoading || payInLoading;
  if (isLoading || redirecting || !payInDetail || !invoice) return null;
  if (!(payInDetail instanceof QrisPayInDetailEntity)) return null;
  if (!isIncomingInvoice(invoice)) return null;

  return (
    <div className="flex flex-col gap-y-8">
      {/* Title & Description */}
      <div className="flex flex-col">
        <div className="text-2xl leading-8 font-bold tracking-tighter">Faktur Masukan</div>
        <div className="text-base leading-6 font-normal text-neutral-300">
          Bayar faktur dari Client kamu disini. Ikuti langkah-langkah dibawah ini untuk mencatat faktur masukan baru
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200">
        <div className="flex flex-row">
          {/* Left - Progress */}
          <CreateIncomingSteppers currentStep="payment" />

          {/* Right - Content */}
          <div className="flex flex-1 flex-col">
            <div className="flex-1 px-12 py-8">
              <div className="flex flex-col gap-y-6">
                {/* Title */}
                <div className="flex flex-col">
                  <div className="text-2xl leading-8 font-bold text-neutral-400">Pembayaran</div>
                </div>

                {/* Countdown Timer */}
                <RemainingPaymentTime deadline={payInDetail.expirationTime} />

                {/* QRIS Detail */}
                <QrisPayInDetailBox
                  payInDetail={{ id: payInDetail.id }}
                  merchant={{ name: payInDetail.providerName }}
                  qrString={payInDetail.qrString}
                />

                {/* Payment Detail */}
                <PaymentDetail
                  receiverName={invoice.receiver.name}
                  bankName={invoice.bankAccount.bankName}
                  accountNumber={invoice.bankAccount.accountNumber}
                  accountHolderName={invoice.bankAccount.accountHolderName}
                  total={invoice.amount}
                  fee={invoice.fee}
                  totalPayment={invoice.total}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center justify-end gap-x-3 border-t border-t-neutral-200 p-6">
              <SecondaryButton outlined label="Bayar Nanti" onClick={() => router.push("/invoices/incoming")} />
              <PrimaryButton
                label="Sudah Bayar"
                onClick={() => router.replace(`/invoices/incoming/${id}/disbursement-status`)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
