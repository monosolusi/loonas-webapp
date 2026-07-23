"use client";

import { CreateIncomingSteppers } from "@/features/invoice/presentations/components/create-incoming-steppers";
import Image from "next/image";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { useParams } from "next/navigation";
import { useGetIncomingInvoicePayInDetail } from "@/features/payment/presentations/hooks/use-get-incoming-invoice-pay-in-detail";
import { usePayInRouteGuard } from "@/features/payment/presentations/hooks/use-pay-in-route-guard";
import { CreditCardFullRedirectPayInDetailEntity } from "@/features/payment/domain/entities/cc-full-redirect-pay-in-detail";

export default function EnterCardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { payInDetail, loading } = useGetIncomingInvoicePayInDetail({ invoice: { id } });

  const redirecting = usePayInRouteGuard({
    invoiceId: id,
    currentRoute: "cc-enter-card-detail",
    payInDetail,
    loading,
  });

  if (loading || redirecting || !payInDetail) return null;
  if (!(payInDetail instanceof CreditCardFullRedirectPayInDetailEntity)) return null;

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
        <div className="flex flex-col lg:flex-row">
          {/*  Left - Progress (desktop only; the wizard rail is a fixed width, not meant to reflow) */}
          <div className="hidden lg:block">
            <CreateIncomingSteppers currentStep="payment" />
          </div>

          {/*  Right - Content */}
          <div className="flex flex-1 flex-col">
            <div className="flex-1 px-4 py-6 lg:px-12 lg:py-8">
              <div className="flex flex-col gap-y-6">
                {/* Title & Description */}
                <div className="flex flex-col">
                  <div className="text-2xl leading-8 font-bold text-neutral-400">Pembayaran</div>
                </div>

                {/*  Detail Kartu Kredit */}
                <div className="flex flex-col gap-y-8 rounded-lg border border-neutral-100 bg-white p-4 sm:p-6">
                  {/* Title */}
                  <div className="flex flex-row items-center gap-x-2">
                    <Image
                      src="/assets/images/credit-card-icon-neutral-400-w16-h16.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                    <div className="leading-6 font-semibold">Detail Kartu Kredit</div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex flex-row items-center justify-between">
                    <div className="text-sm leading-5">Total Tagihan</div>
                    <div className="text-sm leading-5 font-bold">{IDRFormatter.toCurrency(payInDetail.amount)}</div>
                  </div>

                  <div className="w-full">
                    <iframe src={payInDetail.redirectUrl} className="min-h-[500px] w-full" allowFullScreen />
                  </div>
                </div>
              </div>
            </div>

            {/*  Action Buttons */}
            <div className="flex flex-row items-center justify-between border-t border-t-neutral-200 p-4 sm:p-6">
              <div className="flex"></div>
              <div className="flex"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
