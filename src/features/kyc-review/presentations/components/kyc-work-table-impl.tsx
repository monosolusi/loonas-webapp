"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TabFilter } from "@/core/presentations/components/tab-filter";
import { useListVerificationWorks } from "@/features/kyc-review/presentations/hooks/use-list-verification-works";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { KycWorkRow, KycWorkTable } from "@/features/kyc-review/presentations/components/kyc-work-table";
import { KycWorkSearchInput } from "@/features/kyc-review/presentations/components/kyc-work-search-input";

const TAB_LABELS = ["Semua", "Menunggu", "Diproses", "Selesai", "Ditolak"] as const;
const statusMap: (VerificationWorkStatus | undefined)[] = [
  undefined,
  VerificationWorkStatus.IN_QUEUE,
  VerificationWorkStatus.PROCESSING,
  VerificationWorkStatus.DONE,
  VerificationWorkStatus.FAILED,
];

// Default to "Menunggu" (IN_QUEUE) — the reviewer queue that needs action.
const DEFAULT_TAB_INDEX = 1;

export function KycWorkTableImpl() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB_INDEX);

  const resolvedStatus = statusMap[activeTab];

  const { works, meta, loading, error } = useListVerificationWorks({
    status: resolvedStatus,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setSearch("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const toolbar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <TabFilter tabs={TAB_LABELS} selectedIndex={activeTab} onChange={handleTabChange} />
      </div>

      <KycWorkSearchInput value={search} onChange={handleSearchChange} placeholder="Filter halaman ini..." />
    </div>
  );

  const header = (
    <TableHeader
      columns={[
        { label: "Nama Akun" },
        { label: "Email" },
        { label: "Tipe" },
        { label: "Status" },
        { label: "Peninjau" },
        { label: "Tanggal" },
      ]}
      className="grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_1.5fr]"
      hideOnMobile
    />
  );

  const hasData = !loading && !error && works && meta;

  const filteredWorks = hasData
    ? search
      ? works.filter((work) => {
          const query = search.toLowerCase();
          const matchesName = work.account.fullName.toLowerCase().includes(query);
          const matchesEmail = work.user.email.toLowerCase().includes(query);
          return matchesName || matchesEmail;
        })
      : works
    : [];

  const rows: KycWorkRow[] = filteredWorks.map((work) => ({
    id: work.id,
    accountName: work.account.fullName,
    accountType: work.account.type,
    userEmail: work.user.email,
    status: work.status,
    createdAt: work.createdAt,
    executorEmail: work.executorEmail,
  }));

  return (
    <div className="flex flex-col gap-y-4">
      {toolbar}

      <TableContainer
        loading={loading}
        error={!!error}
        empty={works?.length === 0}
        emptyMessage="Tidak ada data verifikasi."
        filteredEmpty={!!search && rows.length === 0}
      >
        {header}
        {hasData && (
          <KycWorkTable
            rows={rows}
            meta={meta}
            currentPage={page}
            onPageChange={setPage}
            onRowClick={(id) => router.push(`/internal/kyc/${id}`)}
          />
        )}
      </TableContainer>
    </div>
  );
}
