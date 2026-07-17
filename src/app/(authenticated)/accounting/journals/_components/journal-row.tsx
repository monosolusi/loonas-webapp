"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { ActionMenu } from "@/core/presentations/components/action-menu";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";

type JournalRowProps = { journal: JournalEntity };

export function JournalRow({ journal }: JournalRowProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="hidden border-b border-neutral-100 last:border-b-0 lg:block">
        <div className="grid grid-cols-[1.5fr_3fr_1fr_1fr_auto] items-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="col-span-4 grid cursor-pointer grid-cols-[1.5fr_3fr_1fr_1fr] items-center px-6 py-4 text-left transition-colors hover:bg-neutral-50"
          >
            <span className="text-sm text-neutral-400">{journal.displayDate}</span>
            <span className="truncate text-sm text-neutral-500">{journal.memo || "—"}</span>
            <span className="text-right text-sm font-medium text-neutral-500">{IDRFormatter.toCurrency(journal.totalDebit)}</span>
            <div className="flex flex-row items-center justify-end gap-x-2">
              <span className="text-sm font-medium text-neutral-500">{IDRFormatter.toCurrency(journal.totalCredit)}</span>
              <ChevronDownIcon className={clsx("size-4 text-neutral-300 transition-transform", expanded && "rotate-180")} />
            </div>
          </button>
          <div className="px-2">
            <ActionMenu
              options={[
                {
                  label: "Lihat detail",
                  onClick: () => router.push(`/accounting/journals/${journal.id}`),
                },
              ]}
            />
          </div>
        </div>

        {expanded && (
          <div className="border-t border-neutral-50 bg-neutral-50/50 px-6 py-3">
            <div className="grid grid-cols-[1.5fr_3fr_1fr_1fr] gap-y-2">
              <span className="text-xs font-medium text-neutral-300">KODE</span>
              <span className="text-xs font-medium text-neutral-300">NAMA AKUN</span>
              <span className="text-right text-xs font-medium text-neutral-300">DEBIT</span>
              <span className="text-right text-xs font-medium text-neutral-300">KREDIT</span>
              {journal.lines.map((line) => (
                <div key={line.id} className="col-span-4 grid grid-cols-[1.5fr_3fr_1fr_1fr]">
                  <span className="text-sm font-mono text-neutral-400">{line.accountCode}</span>
                  <span className="text-sm text-neutral-500">{line.accountName}</span>
                  <span className="text-right text-sm text-neutral-500">{line.displayDebit}</span>
                  <span className="text-right text-sm text-neutral-500">{line.displayCredit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden">
        <MobileListCard
          href={`/accounting/journals/${journal.id}`}
          title={journal.memo || "—"}
          subtitle={journal.displayDate}
          trailingTop={IDRFormatter.toCurrency(journal.totalDebit)}
          trailingBottom={<span className="text-xs text-neutral-300">Kredit {IDRFormatter.toCurrency(journal.totalCredit)}</span>}
        />
      </div>
    </>
  );
}
