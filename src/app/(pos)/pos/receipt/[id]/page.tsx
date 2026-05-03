"use client";

import { use } from "react";
import { ReceiptActions } from "@/app/(pos)/pos/receipt/[id]/_components/receipt-actions";
import { ReceiptCard } from "@/app/(pos)/pos/receipt/[id]/_components/receipt-card";
import { ReceiptLoading } from "@/app/(pos)/pos/receipt/[id]/_components/receipt-loading";
import { ReceiptProvider } from "@/app/(pos)/pos/receipt/[id]/_providers/receipt-provider";

type ReceiptPageProps = {
  params: Promise<{ id: string }>;
};

export default function ReceiptPage(props: ReceiptPageProps) {
  const { id } = use(props.params);

  return (
    <div className="flex h-full flex-col items-center gap-y-4 overflow-y-auto p-6">
      <ReceiptProvider id={id} loading={<ReceiptLoading />}>
        <ReceiptCard />
        <ReceiptActions />
      </ReceiptProvider>
    </div>
  );
}
