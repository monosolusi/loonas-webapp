"use client";

import { use } from "react";
import { PosReceiptProvider } from "@/features/invoice/presentations/providers/pos-receipt-provider";
import { ReceiptCardContent } from "@/app/(authenticated)/sales/pos/[id]/_components/receipt-card-content";
import { ReceiptDetailHeader } from "@/app/(authenticated)/sales/pos/[id]/_components/receipt-detail-header";
import { ReceiptDetailLoading } from "@/app/(authenticated)/sales/pos/[id]/_components/receipt-detail-loading";
import { ReceiptError } from "@/app/(authenticated)/sales/pos/[id]/_components/receipt-error";

type ChromeReceiptPageProps = {
  params: Promise<{ id: string }>;
};

export default function ChromeReceiptPage(props: ChromeReceiptPageProps) {
  const { id } = use(props.params);

  return (
    <PosReceiptProvider id={id} loading={<ReceiptDetailLoading />} error={(err) => <ReceiptError error={err} />}>
      <div className="flex flex-col gap-y-6">
        <ReceiptDetailHeader />
        <div className="flex flex-col items-center">
          <ReceiptCardContent />
        </div>
      </div>
    </PosReceiptProvider>
  );
}
