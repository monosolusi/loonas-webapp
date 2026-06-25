"use client";

import clsx from "clsx";

const ROW_GRID = "grid-cols-[100px_1fr_160px_160px_80px_48px]";

export function CoaAccountsTableHeader() {
  return (
    <div
      className={clsx(
        "grid",
        ROW_GRID,
        "items-center gap-x-4 border-b border-neutral-100 bg-neutral-50/60 px-6 py-3",
      )}
    >
      <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">KODE</span>
      <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">NAMA</span>
      <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">TIPE</span>
      <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">AKUN INDUK</span>
      <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">STATUS</span>
      <span />
    </div>
  );
}
