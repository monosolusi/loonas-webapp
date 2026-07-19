"use client";

import { JournalCreateProvider } from "@/app/(authenticated)/accounting/journals/new/_providers/journal-create-provider";
import { JournalCreateHeader } from "@/app/(authenticated)/accounting/journals/new/_components/journal-create-header";
import { JournalCreateDetailCard } from "@/app/(authenticated)/accounting/journals/new/_components/journal-create-detail-card";
import { JournalCreateLinesCard } from "@/app/(authenticated)/accounting/journals/new/_components/journal-create-lines-card";
import { JournalWarningDialog } from "@/app/(authenticated)/accounting/journals/new/_components/journal-warning-dialog";

export default function JournalNewPage() {
  return (
    <JournalCreateProvider>
      <div className="flex flex-col gap-y-6">
        <JournalCreateHeader />
        <JournalCreateDetailCard />
        <JournalCreateLinesCard />
      </div>
      <JournalWarningDialog />
    </JournalCreateProvider>
  );
}
