// import React from "react";
// import { PaymentRequestProvider } from "@/features/payment/presentations/providers/payment-request";
// import {
//   DisbursementStatusPageImpl
// } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/page-impl";
//
//
// export default async function DisbursementStatusPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//
//   return (
//     <PaymentRequestProvider requestId={id}>
//       <DisbursementStatusPageImpl />
//     </PaymentRequestProvider>
//   );
// }

import {PrimaryButton} from "@/core/presentations/components/buttons/primary-button";
import {CreateIncomingSteppers} from "@/features/invoice/presentations/components/create-incoming-steppers";
import Image from "next/image";
import {IDRFormatter} from "@/core/utilities/currency/domain/formatters/idr-formatter";
import {TimelineItem} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/timeline-item";

export default function DisbursementStatusPage() {
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
          {/*  Left - Progress */}
          <CreateIncomingSteppers currentStep="invoice-created" />

          {/*  Right - Content */}
          <div className="flex flex-1 flex-col">
            <div className="flex-1 px-12 py-8">
              <div className="flex flex-col gap-y-6">
                {/*  Title & Description */}
                <div className="flex flex-1 flex-col items-center gap-y-3">
                  <div className="text-2xl leading-8 font-bold tracking-tighter">Detail Transaksi</div>
                  <div className="flex flex-row items-center gap-x-2 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2">
                    <div className="text-xs leading-4">ID: 8f1a2b3c-4d5e-6f78-9012-34567890abcd</div>
                    <div className="cursor-pointer">
                      <Image src="/assets/images/copy-icon-neutral-500-w12-h12.svg" alt="" width={12} height={12} />
                    </div>
                  </div>
                </div>

                {/*  Status With Total Amount */}
                <div className="flex flex-row items-center justify-between rounded-lg border border-neutral-200 bg-white p-6">
                  {/*  Status & Icon */}
                  <div className="flex flex-row gap-x-4">
                    <div className="flex size-12 flex-row items-center justify-center rounded-full border border-black/5 bg-white/60 shadow">
                      <Image src="/assets/images/clock-icon-neutral-300-w20-h20.svg" alt="" width={20} height={20} />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <div className="leading-5 font-bold">Menunggu Pembayaran</div>
                      <div className="text-sm leading-5 font-semibold">Silahkan selesaikan pembayaran</div>
                    </div>
                  </div>

                  {/*  Total Amount */}
                  <div className="flex flex-col gap-y-1 text-right">
                    <div className="text-xs leading-4 font-semibold tracking-tight uppercase">Total Nominal</div>
                    <div className="text-xl leading-5 font-bold tracking-tight">
                      {IDRFormatter.toCurrency(10000000)}
                    </div>
                  </div>
                </div>

                {/*  Status Timeline */}
                <div className="flex flex-col rounded-lg border border-neutral-200 bg-white">
                  {/*  Card Title */}
                  <div className="flex flex-row items-center gap-x-2 border-b border-b-neutral-100 px-6 py-4">
                    <Image src="/assets/images/shield-icon-primary-w16-h16.svg" alt="" width={16} height={16} />
                    <div className="leading-6 font-semibold">Status Transaksi</div>
                  </div>

                  {/*  Timeline Items */}
                  <div className="flex flex-col gap-y-8 p-6">
                    <TimelineItem
                      state="past"
                      title="Menunggu Pembayaran"
                      description="Silakan selesaikan pembayaran agar pesanan dapat diproses."
                      timestamp="23 Jan, 12:02"
                    />

                    <TimelineItem
                      state="current"
                      title="Pembayaran Diterima"
                      iconSrc="/assets/images/clock-icon-neutral-300-w20-h20.svg"
                      description="Terima kasih, dana Anda sudah masuk ke sistem kami."
                    />

                    <TimelineItem
                      state="future"
                      title="Selesai Di Proses"
                      description="Mohon tunggu, kami sedang memverifikasi dan mencairkan dana."
                      iconSrc="/assets/images/clock-icon-neutral-300-w20-h20.svg"
                    />

                    <TimelineItem
                      state="future"
                      title="Dana Berhasil Dicairkan"
                      description="Selesai! Dana sudah berhasil dikirim ke rekening tujuan."
                      iconSrc="/assets/images/money-icon-neutral-300-w18-h18.svg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/*  Action Buttons */}
            <div className="flex flex-row items-center justify-between border-t border-t-neutral-200 p-6">
              <div className="flex"></div>
              <div className="flex">
                <PrimaryButton label="Lihat Faktur" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
