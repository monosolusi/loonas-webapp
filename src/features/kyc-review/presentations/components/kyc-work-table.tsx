import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { VerificationWorkStatusBadge } from "@/features/kyc-review/presentations/components/verification-work-status-badge";
import { DateTime } from "luxon";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";

export interface KycWorkRow {
  id: string;
  accountName: string;
  accountType: string;
  userEmail: string;
  status: VerificationWorkStatus;
  createdAt: string;
  executorEmail?: string | null;
}

interface KycWorkTableProps {
  rows: KycWorkRow[];
  onRowClick: (id: string) => void;
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  PERSONAL: "Perorangan",
  BUSINESS: "Bisnis",
};

export function KycWorkTable({ rows, onRowClick }: KycWorkTableProps) {
  if (rows.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-100">
        <div className="flex items-center justify-center py-12">
          <span className="text-sm text-neutral-300">Tidak ada data verifikasi.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      {/* Desktop: grid rows (lg and up) */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_1.5fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
          <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Nama Akun</span>
          <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Email</span>
          <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tipe</span>
          <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Status</span>
          <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Peninjau</span>
          <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tanggal</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.id}
            onClick={() => onRowClick(row.id)}
            className="hover:border-l-primary-300 hover:bg-primary-50 grid cursor-pointer grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_1.5fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
          >
            <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{row.accountName}</span>
            <span className="truncate text-sm leading-5 text-neutral-400">{row.userEmail}</span>
            <span className="text-sm leading-5 text-neutral-400">
              {ACCOUNT_TYPE_LABELS[row.accountType] ?? row.accountType}
            </span>
            <div>
              <VerificationWorkStatusBadge status={row.status} />
            </div>
            <span className="truncate text-sm leading-5 text-neutral-400">
              {row.executorEmail ?? "-"}
            </span>
            <span className="text-sm leading-5 text-neutral-400">
              {DateTime.fromISO(row.createdAt).setLocale("id").toFormat("dd LLL yyyy")}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile: stacked cards (below lg) */}
      <div className="lg:hidden">
        {rows.map((row) => (
          <MobileListCard
            key={row.id}
            onClick={() => onRowClick(row.id)}
            title={row.accountName}
            subtitle={row.userEmail}
            meta={
              <>
                {ACCOUNT_TYPE_LABELS[row.accountType] ?? row.accountType}
                {" · "}
                {DateTime.fromISO(row.createdAt).setLocale("id").toFormat("dd LLL yyyy")}
              </>
            }
            trailingBottom={<VerificationWorkStatusBadge status={row.status} />}
          />
        ))}
      </div>
    </div>
  );
}
