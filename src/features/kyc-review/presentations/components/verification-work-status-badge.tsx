import clsx from "clsx";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";

interface VerificationWorkStatusBadgeProps {
  status: VerificationWorkStatus;
}

const STATUS_CONFIG: Record<VerificationWorkStatus, { label: string; dotColor: string; className: string }> = {
  [VerificationWorkStatus.IN_QUEUE]: {
    label: "Menunggu",
    dotColor: "bg-neutral-400",
    className: "bg-neutral-100 text-neutral-400",
  },
  [VerificationWorkStatus.PROCESSING]: {
    label: "Diproses",
    dotColor: "bg-warning-500",
    className: "bg-warning-50 text-warning-500",
  },
  [VerificationWorkStatus.DONE]: {
    label: "Selesai",
    dotColor: "bg-success-500",
    className: "bg-success-50 text-success-500",
  },
  [VerificationWorkStatus.FAILED]: {
    label: "Ditolak",
    dotColor: "bg-error-500",
    className: "bg-error-50 text-error-500",
  },
};

const FALLBACK = { label: "Unknown", dotColor: "bg-neutral-400", className: "bg-neutral-100 text-neutral-400" };

export function VerificationWorkStatusBadge({ status }: VerificationWorkStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? FALLBACK;

  return (
    <span
      className={clsx(
        config.className,
        "inline-flex items-center gap-x-1.5 rounded-sm px-2 py-0.5 text-xs leading-4 font-medium",
      )}
    >
      <span className={clsx(config.dotColor, "size-1.5 rounded-full")} />
      {config.label}
    </span>
  );
}
