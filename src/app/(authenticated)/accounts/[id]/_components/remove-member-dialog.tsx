"use client";

import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useRemoveMember } from "@/features/member/presentations/hooks/use-remove-member";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";

type RemoveMemberDialogProps = {
  open: boolean;
  member: MemberEntity | null;
  onClose: () => void;
};

export function RemoveMemberDialog({ open, member, onClose }: RemoveMemberDialogProps) {
  const { trigger, isMutating } = useRemoveMember();

  const handleRemove = async () => {
    if (!member) return;
    try {
      await trigger({ id: member.id });
      await revalidateSWRKey("list-members");
      onClose();
    } catch {
      // Error captured by SWR
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      title="Hapus Anggota"
      description={
        <p>
          Apakah Anda yakin ingin menghapus <span className="font-semibold">{member?.email}</span> dari akun ini?
        </p>
      }
      confirmLabel="Hapus"
      loading={isMutating}
      onConfirm={handleRemove}
    />
  );
}
