import Image from "next/image";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { MemberRoleBadge } from "@/app/(authenticated)/accounts/[id]/_components/member-role-badge";

type MemberRowProps = {
  member: MemberEntity;
  onRemove?: (member: MemberEntity) => void;
  onResend?: (member: MemberEntity) => void;
  isResending?: boolean;
};

export function MemberRow({ member, onRemove, onResend, isResending }: MemberRowProps) {
  return (
    <div className="flex flex-row items-center justify-between border-b border-neutral-100 px-6 py-4 last:border-b-0">
      <div className="flex flex-col gap-y-0.5">
        <p className="text-sm font-medium text-neutral-500">{member.email}</p>
        {member.isPending && <p className="text-xs text-neutral-200">Menunggu konfirmasi</p>}
        {member.isRejected && <p className="text-xs text-error-300">Undangan ditolak</p>}
      </div>

      <div className="flex flex-row items-center gap-x-3">
        <MemberRoleBadge isOwner={member.isOwner} status={member.status} />
        {member.isRejected && onResend && (
          <button
            type="button"
            disabled={isResending}
            onClick={() => onResend(member)}
            className="rounded-md border border-primary-300/30 px-3 py-1 text-xs font-medium text-primary-300 transition-colors hover:bg-primary-300/5 disabled:opacity-50"
          >
            Kirim Ulang
          </button>
        )}
        {!member.isOwner && member.isAccepted && onRemove && (
          <button
            type="button"
            onClick={() => onRemove(member)}
            className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Image src="/assets/images/trash-icon-neutral-200-w16-h16.svg" alt="remove" width={16} height={16} />
          </button>
        )}
      </div>
    </div>
  );
}
