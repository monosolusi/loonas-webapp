"use client";

import {PrimaryButton} from "@/core/presentations/components/buttons/primary-button";
import {CreateIncomingSteppers} from "@/features/invoice/presentations/components/create-incoming-steppers";
import Image from "next/image";
import {StatusBannerImpl} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/status-banner-impl";
import {TransactionTimelineImpl} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/transaction-timeline-impl";
import {PaymentInformationImpl} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/payment-information-impl";
import {InvoiceDetailImpl} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/invoice-detail-impl";
import {useParams} from "next/navigation";
import {useCopyToClipboard} from "@/core/presentations/hooks/use-copy-to-clipboard";

export default function DisbursementStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { copy } = useCopyToClipboard();
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
                    <div className="text-xs leading-4">ID: {id}</div>
                    <div className="cursor-pointer" onClick={() => copy(id)}>
                      <Image src="/assets/images/copy-icon-neutral-500-w12-h12.svg" alt="" width={12} height={12} />
                    </div>
                  </div>
                </div>

                {/*  Status With Total Amount */}
                <StatusBannerImpl id={id} />

                {/*  Status Timeline */}
                <TransactionTimelineImpl id={id} />

                {/*  Payment Information */}
                <PaymentInformationImpl id={id} />

                {/*  Invoice Information */}
                <InvoiceDetailImpl id={id} />
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
