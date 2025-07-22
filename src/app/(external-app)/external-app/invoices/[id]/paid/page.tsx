"use client";

import DoneAnimation from "@/core/presentations/static-files/done-animation.json";
import { LogoImage } from "@/core/presentations/components/logo-image";
import { InvoiceMetadataImpl } from "@/app/(external-app)/external-app/invoices/[id]/pay/_components/invoice-metadata-impl";
import { PaymentSummaryImpl } from "@/app/(external-app)/external-app/invoices/[id]/pay-in-detail/_components/payment-summary-impl";
import { Card } from "@/core/presentations/components/card";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useGetPublicPayInDetailForOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-pay-in-detail-for-outgoing-invoice";

const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => ({ default: mod.Player })), {
  ssr: false,
});

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
          <div className="flex flex-row space-x-4">
            <div className="flex-2">
              <Card>
                <div className="flex flex-col items-center space-y-4">
                  <h1 className="text-base font-semibold text-gray-900">Pembayaran Berhasil</h1>
                  <div className="h-35 w-35">
                    <Player autoplay loop src={DoneAnimation} />
                  </div>
                  <div className="w-3/4 text-center">
                    <p>Dana Anda sedang kami teruskan ke pengirim invoice. Terima kasih telah menggunakan Loonas.</p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex-1">
              <PaymentSummaryImpl />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
