"use client";

import { useState } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { DangerButton } from "@/core/presentations/components/buttons/danger-button";
import { ReviewPhase } from "@/features/kyc-review/presentations/hooks/use-kyc-review-actions";
import { ReviewAction } from "@/features/kyc-review/domain/enums/review-action";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { ServerError } from "@/core/resources/server-error";

interface ReviewActionPanelProps {
  phase: ReviewPhase;
  workStatus: VerificationWorkStatus;
  workNotes?: string | null;
  reviewOutcome: ReviewAction | null;
  onStartReview: () => void;
  onRetryReview: () => void;
  onSubmitApprove: () => void;
  onSubmitReject: (notes: string) => void;
  claimError: ServerError | null;
  reviewError: ServerError | null;
}

export function ReviewActionPanel({
  phase,
  workStatus,
  workNotes,
  reviewOutcome,
  onStartReview,
  onRetryReview,
  onSubmitApprove,
  onSubmitReject,
  claimError,
  reviewError,
}: ReviewActionPanelProps) {
  const [notes, setNotes] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  return (
    <SectionCard title="Tinjauan" iconSrc="/assets/images/check-circle-icon-neutral-400-w16-h16.svg">
      {/* Completed: terminal state from API (DONE/FAILED) */}
      {phase === "completed" && workStatus === VerificationWorkStatus.DONE && (
        <div className="flex flex-col gap-y-3">
          <div className="rounded-lg bg-success-50 px-4 py-3">
            <span className="text-sm font-medium text-success-500">Pengajuan telah disetujui.</span>
          </div>
          {workNotes && (
            <div className="rounded-lg border border-neutral-100 px-4 py-3">
              <p className="text-xs font-medium text-neutral-300">Catatan</p>
              <p className="mt-1 text-sm text-neutral-500">{workNotes}</p>
            </div>
          )}
        </div>
      )}
      {phase === "completed" && workStatus === VerificationWorkStatus.FAILED && (
        <div className="flex flex-col gap-y-3">
          <div className="rounded-lg bg-error-50 px-4 py-3">
            <span className="text-sm font-medium text-error-500">Pengajuan telah ditolak.</span>
          </div>
          {workNotes && (
            <div className="rounded-lg border border-neutral-100 px-4 py-3">
              <p className="text-xs font-medium text-neutral-300">Catatan Penolakan</p>
              <p className="mt-1 text-sm text-neutral-500">{workNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* Idle: Show "Mulai Review" (IN_QUEUE) */}
      {phase === "idle" && (
        <div className="flex flex-col gap-y-3">
          <p className="text-sm text-neutral-300">
            Klaim pengajuan ini untuk memulai proses tinjauan. Setelah diklaim, hanya Anda yang dapat meninjau.
          </p>
          <PrimaryButton label="Mulai Review" onClick={onStartReview} />
        </div>
      )}

      {/* Claiming: Show loading */}
      {phase === "claiming" && <PrimaryButton label="Mulai Review" loading />}

      {/* Review form: Approve/Reject (PROCESSING or just claimed) */}
      {phase === "review-form" && (
        <div className="flex flex-col gap-y-4">
          <p className="text-sm text-neutral-300">
            Periksa dokumen dan informasi akun, lalu tentukan keputusan Anda.
          </p>
          {!showRejectForm ? (
            <div className="flex flex-row gap-x-3">
              <PrimaryButton label="Setujui" onClick={onSubmitApprove} />
              <DangerButton label="Tolak" onClick={() => setShowRejectForm(true)} />
            </div>
          ) : (
            <div className="flex flex-col gap-y-3">
              <label className="text-sm font-medium text-neutral-500">Catatan Penolakan</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jelaskan alasan penolakan..."
                className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none"
                rows={3}
              />
              <div className="flex flex-row gap-x-3">
                <DangerButton
                  label="Kirim Penolakan"
                  onClick={() => onSubmitReject(notes)}
                  disabled={!notes.trim()}
                />
                <SecondaryButton
                  label="Batal"
                  outlined
                  onClick={() => {
                    setShowRejectForm(false);
                    setNotes("");
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submitting: Show loading */}
      {phase === "submitting" && <PrimaryButton label="Mengirim..." loading />}

      {/* Done: just reviewed successfully */}
      {phase === "done" && (
        <div className="rounded-lg bg-success-50 px-4 py-3">
          <span className="text-sm font-medium text-success-500">
            {reviewOutcome === ReviewAction.APPROVE
              ? "Pengajuan berhasil disetujui."
              : "Pengajuan berhasil ditolak."}
          </span>
        </div>
      )}

      {/* Claim error */}
      {phase === "claim-error" && (
        <div className="flex flex-col gap-y-3">
          <div className="rounded-lg bg-error-50 px-4 py-3">
            <span className="text-sm font-medium text-error-500">
              {claimError?.message ?? "Gagal mengklaim tinjauan. Silakan coba lagi."}
            </span>
          </div>
          <PrimaryButton label="Coba Lagi" onClick={onStartReview} />
        </div>
      )}

      {/* Review error */}
      {phase === "review-error" && (
        <div className="flex flex-col gap-y-3">
          <div className="rounded-lg bg-error-50 px-4 py-3">
            <span className="text-sm font-medium text-error-500">
              {reviewError?.message ?? "Gagal mengirim tinjauan. Silakan coba lagi."}
            </span>
          </div>
          <PrimaryButton label="Coba Lagi" onClick={onRetryReview} />
        </div>
      )}
    </SectionCard>
  );
}
