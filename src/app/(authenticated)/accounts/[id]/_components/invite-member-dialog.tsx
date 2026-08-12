"use client";

import { useState } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useInviteMember } from "@/features/member/presentations/hooks/use-invite-member";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";

type InviteMemberDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function InviteMemberDialog({ open, onClose }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const { trigger, isMutating } = useInviteMember();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetForm = () => {
    setEmail("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      await trigger({ email });
      await revalidateSWRKey("list-members");
      handleClose();
    } catch {
      // Error captured by SWR
    }
  };

  return (
    <LoonasDialog title="Undang Anggota" width="md" open={open} onClose={handleClose}>
      <div className="mt-4 flex flex-col gap-y-4">
        <TextInput label="Email" placeholder="user@email.com" value={email} onChange={setEmail} type="email" />

        <p className="text-sm text-neutral-200">Undangan akan dikirim melalui email ke alamat di atas.</p>

        <DialogFooter>
          <SecondaryButton outlined type="button" label="Batal" onClick={handleClose} className="px-6" />
          <PrimaryButton
            disabled={!isValidEmail}
            loading={isMutating}
            onClick={handleSubmit}
            label="Undang"
            className="px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
