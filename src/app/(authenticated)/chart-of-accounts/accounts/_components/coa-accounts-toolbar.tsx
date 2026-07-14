"use client";

import { MiniToggle } from "@/core/presentations/components/mini-toggle";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { useCoaAccounts } from "@/app/(authenticated)/chart-of-accounts/accounts/_providers/coa-accounts-provider";

export function CoaAccountsToolbar() {
  const { search, setSearch, showSeeded, setShowSeeded, setPage } = useCoaAccounts();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <TableToolbar>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowSeeded(!showSeeded)}
          className="flex cursor-pointer items-center gap-x-2"
          aria-pressed={showSeeded}
        >
          <MiniToggle active={showSeeded} />
          <label className="cursor-pointer select-none text-sm text-neutral-400">Tampilkan akun bawaan</label>
        </button>
        <TableSearch value={search} onChange={handleSearchChange} placeholder="Cari kode atau nama akun..." />
      </div>
    </TableToolbar>
  );
}
