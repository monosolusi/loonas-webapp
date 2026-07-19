import { Suspense } from "react";
import { JournalRangeProvider } from "@/app/(authenticated)/accounting/journals/_providers/journal-range-provider";
import { JournalListImpl } from "@/app/(authenticated)/accounting/journals/_components/journal-list-impl";

export default function JournalsPage() {
  return (
    <Suspense>
      <JournalRangeProvider>
        <JournalListImpl />
      </JournalRangeProvider>
    </Suspense>
  );
}
