"use client";

import { Suspense, use } from "react";
import { LedgerDetailRangeProvider } from "@/app/(authenticated)/finance/ledger/[accountId]/_providers/ledger-detail-range-provider";
import { LedgerDetailImpl } from "@/app/(authenticated)/finance/ledger/[accountId]/_components/ledger-detail-impl";

type LedgerDetailPageProps = {
  params: Promise<{ accountId: string }>;
};

export default function LedgerDetailPage(props: LedgerDetailPageProps) {
  const { accountId } = use(props.params);
  return (
    <Suspense>
      <LedgerDetailRangeProvider>
        <LedgerDetailImpl accountId={accountId} />
      </LedgerDetailRangeProvider>
    </Suspense>
  );
}
