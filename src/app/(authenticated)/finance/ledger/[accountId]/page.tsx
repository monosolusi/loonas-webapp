"use client";

import { use } from "react";
import { LedgerDetailImpl } from "@/app/(authenticated)/finance/ledger/[accountId]/_components/ledger-detail-impl";

type LedgerDetailPageProps = {
  params: Promise<{ accountId: string }>;
};

export default function LedgerDetailPage(props: LedgerDetailPageProps) {
  const { accountId } = use(props.params);
  return <LedgerDetailImpl accountId={accountId} />;
}
