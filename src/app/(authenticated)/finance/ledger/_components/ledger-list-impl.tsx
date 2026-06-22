"use client";

import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { FilterDropdown, FilterPill } from "@/app/(authenticated)/products/_components/filter-dropdown";
import { AccountTypeBadge } from "@/app/(authenticated)/finance/ledger/_components/account-type-badge";
import { useListLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-ledger-accounts";
import { AccountType, ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";

const TYPE_OPTIONS = Object.values(AccountType).map((t) => ({ label: ACCOUNT_TYPE_LABELS[t], value: t }));

export function LedgerListImpl() {
  const [page, setPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const { accounts, meta, loading, error } = useListLedgerAccounts({
    page,
    limit: 25,
    search: searchQuery,
    types: selectedTypes.length > 0 ? (selectedTypes as AccountType[]) : undefined,
  });

  const hasActiveFilters = selectedTypes.length > 0;

  const toolbar = (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-row items-center justify-between">
        <FilterDropdown
          label="Tipe Akun"
          options={TYPE_OPTIONS}
          selected={selectedTypes}
          onChange={(v) => { setSelectedTypes(v); setPage(1); }}
          multiple
        />
        <div className="w-[280px]">
          <TextInput
            label=""
            placeholder="Cari kode atau nama akun..."
            value={search}
            onChange={setSearch}
            leftIcon={<Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="" width={20} height={20} />}
            rightIcon={search ? (
              <button type="button" onClick={() => setSearch("")} className="flex items-center justify-center text-neutral-200 hover:text-neutral-400">
                <XMarkIcon className="size-4" />
              </button>
            ) : undefined}
          />
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex flex-row flex-wrap items-center gap-2">
          {selectedTypes.map((t) => (
            <FilterPill key={t} label={ACCOUNT_TYPE_LABELS[t as AccountType]} onRemove={() => { setSelectedTypes((prev) => prev.filter((v) => v !== t)); setPage(1); }} />
          ))}
          <button type="button" onClick={() => { setSelectedTypes([]); setPage(1); }} className="text-xs font-medium text-neutral-300 transition-colors hover:text-neutral-500">
            Hapus semua
          </button>
        </div>
      )}
    </div>
  );

  const header = (
    <div className="grid grid-cols-[0.5fr_2fr_1.2fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Kode</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Nama Akun</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tipe</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Saldo</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Buku Besar</h1>
        <p className="leading-6 text-neutral-300">{meta ? `${meta.total} akun` : "Memuat..."}</p>
      </div>

      <InvoiceTableShell toolbar={toolbar} header={header} loading={loading} error={!!error} empty={accounts.length === 0 && !loading} emptyMessage="Belum ada akun.">
        {accounts.map((account) => (
          <Link
            key={account.id}
            href={`/finance/ledger/${account.id}`}
            className="hover:border-l-primary-300 hover:bg-primary-50 grid cursor-pointer grid-cols-[0.5fr_2fr_1.2fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
          >
            <span className="text-sm font-mono text-neutral-400">{account.code}</span>
            <div className="flex flex-row items-center gap-x-2">
              <span className="text-sm font-medium text-neutral-500">{account.name}</span>
            </div>
            <div className="flex flex-row items-center">
              <AccountTypeBadge type={account.type} />
            </div>
            <span className={clsx("text-right text-sm font-semibold tabular-nums", account.balance < 0 ? "text-warning-500" : "text-neutral-500")}>{IDRFormatter.toCurrency(account.balance)}</span>
          </Link>
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={accounts.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </InvoiceTableShell>
    </div>
  );
}
