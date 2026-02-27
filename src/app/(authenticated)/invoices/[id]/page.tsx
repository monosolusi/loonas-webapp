"use client";
//
// import { useParams } from "next/navigation";
// import { useGetCombinedInvoiceSummary } from "@/features/invoice/presentations/hooks/use-get-combined-invoice-summary";
// import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
// import IncomingInvoiceDetailPage from "@/app/(authenticated)/invoices/[id]/@incomingDetail/page";
// import OutgoingInvoiceDetailPage from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/page";
//
// export default function InvoiceDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const { invoice, loading } = useGetCombinedInvoiceSummary({ id });
//
//   if (!invoice || loading) return null;
//   if (invoice.type === InvoiceType.INCOMING) return <IncomingInvoiceDetailPage />;
//   else if (invoice.type === InvoiceType.OUTGOING) return <OutgoingInvoiceDetailPage />;
//   else return null;
// }

import Image from "next/image";
import { useParams } from "next/navigation";
import { SectionCard } from "@/core/presentations/components/section-card";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-y-6">
      {/*  Header */}
      <div className="flex flex-row items-center gap-x-4">
        <div className="flex size-9 cursor-pointer flex-col items-center justify-center rounded-lg border border-neutral-100">
          <Image
            src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg"
            alt="arrow-left-icon"
            width={16}
            height={16}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <div className="text-xl leading-5 font-bold tracking-tight">INV/2023/10/001</div>
          <div className="text-sm leading-5 text-neutral-200">Faktur Masukan</div>
        </div>
      </div>

      {/*  Content */}
      <div className="flex flex-row gap-x-6">
        <div className="flex flex-2 flex-col gap-y-6">
          {/* Status Transaksi */}
          {/* Rincian Faktur */}
          <SectionCard
            title="Rincian Faktur"
            bodyClassName="p-0"
            iconSrc="/assets/images/document-icon-primary-300-w24-h24.svg"
          >
            {/* Table Header */}
            <div className="grid grid-cols-[60px_1fr_auto] border-b border-neutral-100 px-6 py-3 text-sm font-medium">
              <span>No</span>
              <span>Keterangan</span>
              <span>Jumlah</span>
            </div>

            {/* Row 1 */}
            <div className="border-b border-neutral-100 px-6 py-5">
              <div className="grid grid-cols-[60px_1fr_auto]">
                <span className="text-sm">1</span>
                <div className="flex flex-col gap-y-1">
                  <span className="text-sm leading-5 font-medium">INV-001</span>
                  <span className="text-xs leading-4">Jasa Konsultasi IT Bulan Oktober</span>
                  <span className="text-xs leading-4">Tgl: 01 Okt 2023</span>
                </div>
                <span className="text-sm leading-5 font-semibold">Rp 5.000.000</span>
              </div>

              {/* Attachment */}
              <div className="mt-4 ml-[60px]">
                <div className="flex items-center gap-x-3 rounded-lg border border-dashed border-neutral-100 px-4 py-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-red-50">
                    <Image
                      src="/assets/images/document-icon-red-500-w20-h20.svg"
                      alt="file-icon"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm leading-5 font-medium">invoice_consulting_oct.pdf</span>
                    <span className="text-xs leading-4">500 KB</span>
                  </div>
                  <OutlinedButton>Lihat</OutlinedButton>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="border-b border-neutral-100 px-6 py-5">
              <div className="grid grid-cols-[60px_1fr_auto]">
                <span className="text-sm">2</span>
                <div className="flex flex-col gap-y-1">
                  <span className="text-sm leading-5 font-medium">INV-002</span>
                  <span className="text-xs leading-4">Maintenance Server</span>
                  <span className="text-xs leading-4">Tgl: 05 Okt 2023</span>
                </div>
                <span className="text-sm leading-5 font-semibold">Rp 2.500.000</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-end gap-x-6 px-6 py-5">
              <span className="text-sm leading-5 font-semibold">Total Tagihan</span>
              <span className="text-lg leading-5 font-semibold">Rp 7.500.000</span>
            </div>
          </SectionCard>
        </div>
        <div className="flex flex-1 flex-col gap-y-6">
          {/*  Ringkasan Pembayaran */}
          <SectionCard title="Ringkasan Pembayaran" iconSrc="/assets/images/wallet-icon-primary-300-w16-h16.svg">
            <div className="flex flex-col gap-y-5">
              {/* Total Tagihan */}
              <div className="flex flex-col gap-y-1">
                <span className="text-xs leading-4 text-neutral-200">Total Tagihan</span>
                <span className="text-2xl leading-8 font-semibold tracking-tight">Rp 7.500.000</span>
              </div>

              {/* Breakdown Card */}
              <div className="flex flex-col gap-y-3 rounded-lg border border-neutral-100 p-4">
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-xs leading-4 text-neutral-200">Subtotal</span>
                  <span className="text-sm leading-5 text-neutral-500">Rp 7.500.000</span>
                </div>
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-xs leading-4 text-neutral-200">Biaya Admin</span>
                  <span className="text-sm leading-5">Rp 0</span>
                </div>
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-xs leading-4 text-neutral-200">Metode Pembayaran</span>
                  <span className="text-sm leading-5">BCA Virtual Account</span>
                </div>
              </div>

              {/* Deadline Notice */}
              <div className="bg-warning-50 flex flex-row items-start gap-x-2 rounded-lg px-3 py-2.5">
                <Image
                  src="/assets/images/clock-icon-warning-300-w13-h13.svg"
                  alt="clock-icon"
                  width={13}
                  height={13}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-warning-500 text-xs leading-4">
                  Selesaikan pembayaran sebelum <span className="font-semibold"> 20 Okt 2023</span>
                </span>
              </div>

              {/* CTA Button */}
              <PrimaryButton label="Lanjutkan Pembayaran" />
            </div>
          </SectionCard>

          {/* Informasi Penerima */}
          <SectionCard title="Informasi Penerima" iconSrc="/assets/images/person-icon-primary-300-w16-h16.svg">
            <div className="flex flex-col gap-y-5">
              {/* Contact Info */}
              <div className="flex flex-col gap-y-1">
                <span className="text-sm leading-5 font-semibold">PT Mitra Sejahtera</span>
                <div className="flex flex-col gap-y-1.5 text-xs leading-4 text-neutral-200">
                  <span>finance@mitrasejahtera.com</span>
                  <span>021-5556789</span>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-neutral-100" />

              {/* Bank Details */}
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-xs leading-4 text-neutral-200">Bank</span>
                  <span className="text-sm leading-5 font-semibold">BCA</span>
                </div>
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-xs leading-4 text-neutral-200">Atas Nama</span>
                  <span className="text-sm leading-5 font-semibold">PT Mitra Sejahtera</span>
                </div>
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-xs leading-4 text-neutral-200">Nomor Rekening</span>
                  <div className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5">
                    <span className="text-sm font-semibold text-neutral-500">1234567890</span>
                    <Image
                      src="/assets/images/copy-icon-neutral-200-w12-h12.svg"
                      alt="copy-icon"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
