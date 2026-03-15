"use client";

import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DangerButton } from "@/core/presentations/components/buttons/danger-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useRemoveMember } from "@/features/member/presentations/hooks/use-remove-member";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { useSWRConfig } from "swr";

type RemoveMemberDialogProps = {
  open: boolean;
  member: MemberEntity | null;
  onClose: () => void;
};

export function RemoveMemberDialog({ open, member, onClose }: RemoveMemberDialogProps) {
  const { trigger, isMutating } = useRemoveMember();
  const { mutate } = useSWRConfig();

  const handleRemove = async () => {
    if (!member) return;
    try {
      await trigger({ id: member.id });
      await mutate((key: unknown) => Array.isArray(key) && key[0] === "list-members");
      onClose();
    } catch {
      // Error captured by SWR
    }
  };

  return (
    <LoonasDialog title="Hapus Anggota" width="sm" open={open} onClose={onClose}>
      <div className="mt-4 flex flex-col gap-y-4">
        <p className="text-sm text-neutral-300">
          Apakah Anda yakin ingin menghapus <span className="font-semibold">{member?.email}</span> dari akun ini?
        </p>

        <div className="-mx-4 flex flex-row justify-end gap-x-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:px-6">
          <SecondaryButton outlined type="button" label="Batal" onClick={onClose} className="w-auto px-6" />
          <DangerButton loading={isMutating} onClick={handleRemove} label="Hapus" className="w-auto px-6" />
        </div>
      </div>
    </LoonasDialog>
  );
}
