"use client";

import { useMemo } from "react";
import Link from "next/link";
import { DateTime } from "luxon";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

type YearEndJournalReferenceProps = {
  label?: string;
  closeJournalId: string | null;
  closingJournalCreatedAt: string | null;
};

export function YearEndJournalReference({ label = "Jurnal penutup:", closeJournalId, closingJournalCreatedAt }: YearEndJournalReferenceProps) {
  const formattedDate = useMemo(() => {
    if (!closingJournalCreatedAt) return null;
    return DateTime.fromISO(closingJournalCreatedAt, { zone: "Asia/Jakarta" }).setLocale("id").toFormat("d LLLL yyyy, HH:mm");
  }, [closingJournalCreatedAt]);

  if (!closeJournalId) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
      <span className="text-sm text-neutral-400">{label}</span>
      <Link
        href={`/finance/journals/${closeJournalId}`}
        className="flex items-center gap-x-1 font-mono text-sm text-primary-500 hover:underline"
      >
        {closeJournalId}
        <ArrowTopRightOnSquareIcon className="size-3.5" aria-hidden="true" />
      </Link>
      <span className="ml-auto text-xs text-neutral-400">{formattedDate}</span>
    </div>
  );
}
