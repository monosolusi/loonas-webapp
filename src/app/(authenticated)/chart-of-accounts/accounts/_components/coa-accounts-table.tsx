"use client";

import { useMemo } from "react";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { CoaAccountRow } from "@/app/(authenticated)/chart-of-accounts/accounts/_components/coa-account-row";
import { useCoaAccounts } from "@/app/(authenticated)/chart-of-accounts/accounts/_providers/coa-accounts-provider";

const COLUMNS = [
  { label: "Kode" },
  { label: "Nama" },
  { label: "Tipe" },
  { label: "Akun Induk" },
  { label: "Status" },
  { label: "" },
];

export function CoaAccountsTable() {
  const { accounts, allAccounts, meta, loading, error, page, setPage, search, showSeeded } = useCoaAccounts();

  // Build parent name lookup from all loaded accounts
  const parentNameMap = useMemo<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const a of allAccounts) {
      map.set(a.id, a.name);
    }
    return map;
  }, [allAccounts]);

  const isFiltered = search.trim().length > 0;
  const isEmpty = !loading && !error && accounts.length === 0;

  return (
    <TableContainer
      loading={loading}
      error={!!error}
      empty={isEmpty && !isFiltered}
      emptyMessage={showSeeded ? "Belum ada akun bawaan yang tersedia." : "Belum ada akun yang ditambahkan."}
      filteredEmpty={isEmpty && isFiltered}
      filteredEmptyMessage="Tidak ditemukan akun dengan pencarian tersebut."
      scrollable
    >
      <div className="min-w-[820px]">
        <TableHeader className="grid-cols-[100px_1fr_160px_160px_80px_48px] gap-x-4" columns={COLUMNS} />
        {accounts.map((account) => (
          <CoaAccountRow
            key={account.id}
            account={account}
            parentName={account.parentId ? parentNameMap.get(account.parentId) : undefined}
          />
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={accounts.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </div>
    </TableContainer>
  );
}
