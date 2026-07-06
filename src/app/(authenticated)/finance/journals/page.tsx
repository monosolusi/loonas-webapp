import { Suspense } from "react";
import { JournalRangeProvider } from "@/app/(authenticated)/finance/journals/_providers/journal-range-provider";
import { JournalListImpl } from "@/app/(authenticated)/finance/journals/_components/journal-list-impl";

export default function JournalsPage() {
  return (
    <Suspense>
      <JournalRangeProvider>
        <JournalListImpl />
      </JournalRangeProvider>
    </Suspense>
  );
}
