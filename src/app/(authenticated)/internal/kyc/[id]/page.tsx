"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useKycDetail } from "@/features/kyc-review/presentations/components/kyc-detail-impl";
import { VerificationWorkStatusBadge } from "@/features/kyc-review/presentations/components/verification-work-status-badge";
import { ReviewActionPanelImpl } from "@/features/kyc-review/presentations/components/review-action-panel-impl";
import { AccountInfoSection } from "@/features/kyc-review/presentations/components/account-info-section";
import { KycDocumentViewer } from "@/features/kyc-review/presentations/components/kyc-document-viewer";
import { KycTimeline } from "@/features/kyc-review/presentations/components/kyc-timeline";

function DetailSkeleton() {
  return (
    <div className="flex flex-row gap-x-6">
      {/* Left: document skeleton */}
      <div className="flex-1">
        <div className="animate-pulse rounded-lg border border-neutral-200 bg-white">
          <div className="flex flex-row items-center gap-x-2 border-b border-b-neutral-100 px-6 py-4">
            <div className="h-4 w-4 rounded bg-neutral-100" />
            <div className="h-4 w-24 rounded bg-neutral-100" />
          </div>
          <div className="flex flex-col gap-y-4 p-6">
            <div className="h-48 w-full rounded bg-neutral-100" />
            <div className="h-48 w-full rounded bg-neutral-100" />
          </div>
        </div>
      </div>
      {/* Right: info + action skeleton */}
      <div className="flex w-[380px] shrink-0 flex-col gap-y-6">
        <div className="animate-pulse rounded-lg border border-neutral-200 bg-white">
          <div className="flex flex-row items-center gap-x-2 border-b border-b-neutral-100 px-6 py-4">
            <div className="h-4 w-4 rounded bg-neutral-100" />
            <div className="h-4 w-28 rounded bg-neutral-100" />
          </div>
          <div className="flex flex-col gap-y-3 p-6">
            <div className="h-4 w-full rounded bg-neutral-100" />
            <div className="h-4 w-3/4 rounded bg-neutral-100" />
            <div className="h-4 w-1/2 rounded bg-neutral-100" />
          </div>
        </div>
        <div className="animate-pulse rounded-lg border border-neutral-200 bg-white">
          <div className="flex flex-row items-center gap-x-2 border-b border-b-neutral-100 px-6 py-4">
            <div className="h-4 w-4 rounded bg-neutral-100" />
            <div className="h-4 w-20 rounded bg-neutral-100" />
          </div>
          <div className="p-6">
            <div className="h-10 w-32 rounded bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KycDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { work, loading, error, refresh } = useKycDetail(id);

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="flex flex-row items-center gap-x-4">
        <button
          onClick={() => router.push("/internal/kyc")}
          className="flex size-9 cursor-pointer flex-col items-center justify-center rounded-lg border border-neutral-100"
        >
          <Image
            src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg"
            alt="Kembali"
            width={16}
            height={16}
          />
        </button>
        <div className="flex flex-col gap-y-1">
          <div className="flex flex-row items-center gap-x-3">
            <span className="text-xl leading-5 font-bold tracking-tight">Detail Verifikasi</span>
            {work && <VerificationWorkStatusBadge status={work.status} />}
          </div>
          <div className="text-sm leading-5 text-neutral-200">
            ID: {id.slice(0, 8)}
            {work?.executorEmail && <> · Ditinjau oleh: {work.executorEmail}</>}
          </div>
        </div>
      </div>

      {/* Content: two-column layout */}
      {loading && <DetailSkeleton />}

      {error && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <span className="text-sm text-neutral-300">Gagal memuat detail verifikasi.</span>
        </div>
      )}

      {work && (
        <div className="flex flex-row gap-x-6">
          {/* Left: documents (scrolls with page) */}
          <div className="flex-1">
            <KycDocumentViewer documents={work.documents} />
          </div>

          {/* Right: account info + timeline + review actions (sticky) */}
          <div className="flex w-[380px] shrink-0 flex-col gap-y-6 self-start sticky top-8">
            <AccountInfoSection account={work.account} userEmail={work.user.email} />
            <KycTimeline history={work.history} />
            <ReviewActionPanelImpl
              workId={id}
              workStatus={work.status}
              executorEmail={work.executorEmail}
              workNotes={work.notes}
              onClaimed={() => refresh?.()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
