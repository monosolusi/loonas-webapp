"use client";

import {PrimaryButton} from "@/core/presentations/components/buttons/primary-button";
import {CreateIncomingSteppers} from "@/features/invoice/presentations/components/create-incoming-steppers";
import {SectionCard} from "@/core/presentations/components/section-card";
import Image from "next/image";
import {InvoiceRowItem} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/invoice-row-item";
import {StatusBannerImpl} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/status-banner-impl";
import {TimelineItem} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/timeline-item";
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
                <SectionCard iconSrc="/assets/images/shield-icon-primary-w16-h16.svg" title="Status Transaksi">
                  <div className="flex flex-col gap-y-8">
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
                </SectionCard>

                {/*  Payment Information */}
                <SectionCard
                  iconSrc="/assets/images/wallet-icon-primary-300-w16-h16.svg"
                  title="Informasi Pembayaran"
                  bodyClassName="p-0"
                >
                  <div className="flex flex-row">
                    <div className="flex flex-1 flex-col gap-y-4 border-r border-r-neutral-100 p-6">
                      <div className="flex flex-col gap-y-1">
                        <div className="text-xs leading-4 text-neutral-300">Metode Bayar</div>
                        <div className="leading-5 font-medium">QRIS</div>
                      </div>

                      <div className="flex flex-col gap-y-1">
                        <div className="text-xs leading-4 text-neutral-300">Waktu Transaksi</div>
                        <div className="leading-5 font-medium">25 Februari 2026, 19:48 WIB</div>
                      </div>

                      <div className="flex flex-col gap-y-1">
                        <div className="text-xs leading-4 text-neutral-300">Client</div>
                        <div className="leading-5 font-medium">PT Sumber Makmur</div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-y-4 p-6">
                      <div className="flex flex-col gap-y-1">
                        <div className="text-xs leading-4 text-neutral-300">Bank Penerima</div>
                        <div className="leading-5 font-medium">Bank Central Asia</div>
                      </div>

                      <div className="flex flex-col gap-y-1">
                        <div className="text-xs leading-4 text-neutral-300">Nomor Rekening</div>
                        <div className="leading-5 font-medium">00000000000000000000</div>
                      </div>

                      <div className="flex flex-col gap-y-1">
                        <div className="text-xs leading-4 text-neutral-300">Atas Nama</div>
                        <div className="leading-5 font-medium">Finance Sumber Makmur Sejati</div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/*  Invoice Information */}
                <SectionCard
                  title="Rincian Faktur"
                  iconSrc="/assets/images/document-icon-primary-300-w16-h16.svg"
                  bodyClassName="p-0"
                >
                  <div className="flex flex-col">
                    <InvoiceRowItem
                      number={1}
                      invoiceNumber="INV/2023/10/001"
                      amount="Rp 5.000.000"
                      date="01 Oktober 2023"
                    />
                    <InvoiceRowItem
                      number={2}
                      invoiceNumber="INV/2023/10/002"
                      amount="Rp 5.000.000"
                      date="01 Oktober 2023"
                    />
                  </div>
                </SectionCard>
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
