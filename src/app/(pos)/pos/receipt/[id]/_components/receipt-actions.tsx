"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { deriveInvoicePaymentStatusKind } from "@/features/invoice/presentations/components/invoice-payment-helpers";
import { usePosReceipt } from "@/features/invoice/presentations/providers/pos-receipt-provider";

export function ReceiptActions() {
  const router = useRouter();
  const { invoice } = usePosReceipt();
  const isPaid = deriveInvoicePaymentStatusKind(invoice) === "paid";

  const backToPos = () => router.push("/pos");
  const reprint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="shrink-0 border-t border-neutral-100 bg-white p-4">
      <div className="mx-auto flex w-full max-w-md flex-col gap-y-3">
        {isPaid ? (
          <>
            <PrimaryButton label="Transaksi Baru" onClick={backToPos} />
            <SecondaryButton outlined label="Cetak Ulang" onClick={reprint} />
          </>
        ) : (
          <PrimaryButton label="Kembali ke POS" onClick={backToPos} />
        )}
      </div>
    </div>
  );
}
