import clsx from "clsx";
import { MemberStatus } from "@/features/member/domain/enums/member-status";

type MemberRoleBadgeProps = {
  isOwner: boolean;
  status: MemberStatus;
};

const BADGE_CONFIG = {
  owner: {
    label: "Pemilik",
    dotColor: "bg-success-300",
    className: "bg-success-300/10 text-success-300",
  },
  accepted: {
    label: "Anggota",
    dotColor: "bg-primary-300",
    className: "bg-primary-300/10 text-primary-300",
  },
  pending: {
    label: "Pending",
    dotColor: "bg-warning-300",
    className: "bg-warning-300/10 text-warning-300",
  },
};

export function MemberRoleBadge({ isOwner, status }: MemberRoleBadgeProps) {
  const config = isOwner ? BADGE_CONFIG.owner : status === MemberStatus.ACCEPTED ? BADGE_CONFIG.accepted : BADGE_CONFIG.pending;

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
