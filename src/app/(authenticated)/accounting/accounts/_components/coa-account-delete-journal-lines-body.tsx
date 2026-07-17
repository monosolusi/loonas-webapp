"use client";

import Link from "next/link";

type CoaAccountDeleteJournalLinesBodyProps = {
  accountName: string;
  accountCode: string;
  accountId: string;
  journalLineCount: number | null;
};

export function CoaAccountDeleteJournalLinesBody({
  accountName,
  accountId,
  journalLineCount,
}: CoaAccountDeleteJournalLinesBodyProps) {
  return (
    <div className="flex flex-col gap-y-3">
      <p className="text-sm font-semibold text-neutral-500">Akun ini tidak dapat dihapus.</p>
      {journalLineCount !== null ? (
        <p className="text-sm text-neutral-400">
          Akun &ldquo;{accountName}&rdquo; memiliki {journalLineCount} baris jurnal yang terkait. Hapus atau pindahkan
          entri jurnal terkait terlebih dahulu.
        </p>
      ) : (
        <p className="text-sm text-neutral-400">
          Akun ini memiliki baris jurnal yang terkait. Hapus entri jurnal terkait terlebih dahulu.
        </p>
      )}
      {journalLineCount !== null && (
        <Link
          href={`/accounting/ledger/${accountId}`}
          className="text-sm text-primary-300 underline hover:text-primary-500"
        >
          Lihat {journalLineCount} baris entri
        </Link>
      )}
    </div>
  );
}
