"use client";

import { LogoImage } from "@/core/presentations/components/logo-image";
import { InvoiceMetadataImpl } from "@/app/(external-app)/external-app/invoices/[id]/pay/_components/invoice-metadata-impl";
import { PaymentSummaryImpl } from "@/app/(external-app)/external-app/invoices/[id]/pay-in-detail/_components/payment-summary-impl";
import { SectionCard } from "@/core/presentations/components/section-card";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetPublicPayInDetailForOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-pay-in-detail-for-outgoing-invoice";

export default function PaidPage() {
  const { id } = useParams<{ id: string }>();
  const { payIn, loading } = useGetPublicPayInDetailForOutgoingInvoice({ invoiceId: id });
  const router = useRouter();

  useEffect(() => {
    // Don't have PayIn but forcing to Paid page.
    if (!payIn && !loading) router.replace("pay");
  }, [payIn, loading]);

  if (!payIn || loading) return null;
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
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:space-x-4">
            <div className="lg:flex-2">
              <SectionCard title="Pembayaran Berhasil">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="w-3/4 text-center">
                    <p className="text-neutral-900">
                      Dana Anda sedang kami teruskan ke pengirim invoice. Terima kasih telah menggunakan Loonas.
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>
            <div className="lg:flex-1">
              <PaymentSummaryImpl />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
