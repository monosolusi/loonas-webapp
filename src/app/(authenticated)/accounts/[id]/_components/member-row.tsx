import Image from "next/image";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { MemberRoleBadge } from "@/app/(authenticated)/accounts/[id]/_components/member-role-badge";

type MemberRowProps = {
  member: MemberEntity;
  onRemove?: (member: MemberEntity) => void;
};

export function MemberRow({ member, onRemove }: MemberRowProps) {
  return (
    <div className="flex flex-row items-center justify-between border-b border-neutral-100 px-6 py-4 last:border-b-0">
      <div className="flex flex-col gap-y-0.5">
        <p className="text-sm font-medium text-neutral-500">{member.email}</p>
        <p className="text-xs text-neutral-200">
          {member.isPending ? "Menunggu konfirmasi" : member.fullName ?? member.email}
        </p>
      </div>

      <div className="flex flex-row items-center gap-x-3">
        <MemberRoleBadge isOwner={member.isOwner} status={member.status} />
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
