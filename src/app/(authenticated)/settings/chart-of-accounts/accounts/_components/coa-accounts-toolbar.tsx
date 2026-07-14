"use client";

import Image from "next/image";
import { MiniToggle } from "@/core/presentations/components/mini-toggle";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCoaAccounts } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_providers/coa-accounts-provider";

export function CoaAccountsToolbar() {
  const { search, setSearch, showSeeded, setShowSeeded, setCreatingOpen } = useCoaAccounts();

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
        <TableSearch
          value={search}
          onChange={setSearch}
          placeholder="Cari kode atau nama akun..."
        />
      </div>
      <PrimaryButton
        label="Tambah Akun"
        leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
        onClick={() => setCreatingOpen(true)}
        className="w-auto px-4"
      />
    </TableToolbar>
  );
}
