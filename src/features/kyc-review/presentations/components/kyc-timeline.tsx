import clsx from "clsx";
import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { VerificationWorkHistoryEntity } from "@/features/kyc-review/domain/entities/verification-work-history";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";

interface KycTimelineProps {
  history: VerificationWorkHistoryEntity[];
}

const STATUS_CONFIG: Record<VerificationWorkStatus, { label: string; dotColor: string }> = {
  [VerificationWorkStatus.IN_QUEUE]: { label: "Pengajuan masuk", dotColor: "bg-neutral-300" },
  [VerificationWorkStatus.PROCESSING]: { label: "Diklaim untuk ditinjau", dotColor: "bg-warning-500" },
  [VerificationWorkStatus.DONE]: { label: "Disetujui", dotColor: "bg-success-500" },
  [VerificationWorkStatus.FAILED]: { label: "Ditolak", dotColor: "bg-error-500" },
};

export function KycTimeline({ history }: KycTimelineProps) {
  if (history.length === 0) return null;

  return (
    <SectionCard title="Riwayat" iconSrc="/assets/images/document-icon-neutral-400-w16-h16.svg">
      <div className="flex flex-col">
        {history.map((item, index) => {
          const config = STATUS_CONFIG[item.status] ?? { label: item.status, dotColor: "bg-neutral-300" };
          const isLast = index === history.length - 1;
          const formattedDate = DateTime.fromISO(item.createdAt).setLocale("id").toFormat("dd LLL yyyy, HH:mm");

          return (
            <div key={index} className="flex flex-row gap-x-3">
              {/* Dot + line */}
              <div className="flex flex-col items-center">
                <div className={clsx("mt-1.5 size-2.5 shrink-0 rounded-full", config.dotColor)} />
                {!isLast && <div className="w-px flex-1 bg-neutral-100" />}
              </div>

              {/* Content */}
              <div className={clsx("flex flex-col", !isLast && "pb-4")}>
                <span className="text-sm font-medium text-neutral-500">{config.label}</span>
                {item.executorEmail && (
                  <span className="text-xs text-neutral-300">oleh {item.executorEmail}</span>
                )}
                <span className="text-xs text-neutral-200">{formattedDate}</span>
                {item.notes && (
                  <p className="mt-1 rounded border border-neutral-100 px-3 py-2 text-xs text-neutral-400 italic">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
