"use client";

import { useRouter } from "next/navigation";
import { useListVerificationWorks } from "@/features/kyc-review/presentations/hooks/use-list-verification-works";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { KycWorkRow, KycWorkTable } from "@/features/kyc-review/presentations/components/kyc-work-table";

interface KycWorkTableImplProps {
  status?: VerificationWorkStatus;
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_1.5fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
        <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Nama Akun</span>
        <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Email</span>
        <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tipe</span>
        <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Status</span>
        <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Peninjau</span>
        <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tanggal</span>
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="grid animate-pulse grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_1.5fr] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0"
        >
          <div className="h-4 w-3/4 rounded bg-neutral-100" />
          <div className="h-4 w-2/3 rounded bg-neutral-100" />
          <div className="h-4 w-1/2 rounded bg-neutral-100" />
          <div className="h-5 w-16 rounded-sm bg-neutral-100" />
          <div className="h-4 w-2/3 rounded bg-neutral-100" />
          <div className="h-4 w-2/3 rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

export function KycWorkTableImpl({ status }: KycWorkTableImplProps) {
  const router = useRouter();
  const { works, loading, error } = useListVerificationWorks({ status });

  if (loading) return <TableSkeleton />;

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-100">
        <div className="flex items-center justify-center py-12">
          <span className="text-sm text-neutral-300">Gagal memuat data verifikasi.</span>
        </div>
      </div>
    );
  }

  const rows: KycWorkRow[] = (works ?? []).map((work) => ({
    id: work.id,
    accountName: work.account.fullName,
    accountType: work.account.type,
    userEmail: work.user.email,
    status: work.status,
    createdAt: work.createdAt,
    executorEmail: work.executorEmail,
  }));

  return <KycWorkTable rows={rows} onRowClick={(id) => router.push(`/internal/kyc/${id}`)} />;
}
