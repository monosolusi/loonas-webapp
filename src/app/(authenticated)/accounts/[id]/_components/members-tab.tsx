"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useListMembers } from "@/features/member/presentations/hooks/use-list-members";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { MemberRow } from "@/app/(authenticated)/accounts/[id]/_components/member-row";
import { InviteMemberDialog } from "@/app/(authenticated)/accounts/[id]/_components/invite-member-dialog";
import { RemoveMemberDialog } from "@/app/(authenticated)/accounts/[id]/_components/remove-member-dialog";

export function MembersTab() {
  const { members, loading } = useListMembers();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [removingMember, setRemovingMember] = useState<MemberEntity | null>(null);

  return (
    <>
      <SectionCard
        title="Anggota"
        iconSrc="/assets/images/people-icon-primary-300-w16-h16.svg"
        headerAction={
          <PrimaryButton
            label="Undang Anggota"
            className="h-9 w-auto px-4 text-sm"
            onClick={() => setInviteDialogOpen(true)}
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="add" width={16} height={16} />}
          />
        }
        bodyClassName="p-0"
      >
        {loading ? (
          <div className="flex flex-col gap-y-4 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex animate-pulse flex-row items-center justify-between">
                <div className="flex flex-col gap-y-1">
                  <div className="h-4 w-40 rounded bg-neutral-100" />
                  <div className="h-3 w-24 rounded bg-neutral-100" />
                </div>
                <div className="h-5 w-16 rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div>
            {members.map((member) => (
              <MemberRow key={member.id} member={member} onRemove={setRemovingMember} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-y-4 py-16">
            <div className="flex size-12 items-center justify-center rounded-full bg-neutral-50">
              <Image src="/assets/images/people-icon-neutral-200-w20-h20.svg" alt="" width={20} height={20} />
            </div>
            <div className="flex flex-col items-center gap-y-1 text-center">
              <p className="text-sm font-semibold text-neutral-500">Belum ada anggota</p>
              <p className="text-sm text-neutral-200">Undang anggota untuk bergabung ke akun ini.</p>
            </div>
          </div>
        )}
      </SectionCard>

      <InviteMemberDialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} />
      <RemoveMemberDialog open={!!removingMember} member={removingMember} onClose={() => setRemovingMember(null)} />
    </>
  );
}
