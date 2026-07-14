import { Suspense } from "react";
import { LedgerListRangeProvider } from "@/app/(authenticated)/finance/ledger/_providers/ledger-list-range-provider";
import { LedgerListImpl } from "@/app/(authenticated)/finance/ledger/_components/ledger-list-impl";

export default function LedgerPage() {
  return (
    <Suspense>
      <LedgerListRangeProvider>
        <LedgerListImpl />
      </LedgerListRangeProvider>
    </Suspense>
  );
}
