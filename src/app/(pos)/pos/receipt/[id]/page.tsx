"use client";

import { use } from "react";
import { PosReceiptLoading } from "@/features/invoice/presentations/components/pos-receipt-loading";
import { PosReceiptProvider } from "@/features/invoice/presentations/providers/pos-receipt-provider";
import { ReceiptActions } from "@/app/(pos)/pos/receipt/[id]/_components/receipt-actions";
import { ReceiptCardContent } from "@/app/(pos)/pos/receipt/[id]/_components/receipt-card-content";
import { ReceiptError } from "@/app/(pos)/pos/receipt/[id]/_components/receipt-error";

type ReceiptPageProps = {
  params: Promise<{ id: string }>;
};

export default function ReceiptPage(props: ReceiptPageProps) {
  const { id } = use(props.params);

  return (
    <PosReceiptProvider id={id} loading={<PosReceiptLoading />} error={(err) => <ReceiptError error={err} />}>
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex flex-1 flex-col items-center gap-y-6 overflow-y-auto p-6">
          <ReceiptCardContent />
        </div>
        <ReceiptActions />
      </div>
    </PosReceiptProvider>
  );
}
