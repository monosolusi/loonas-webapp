"use client";

import { useState } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useInviteMember } from "@/features/member/presentations/hooks/use-invite-member";
import { useSWRConfig } from "swr";

type InviteMemberDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function InviteMemberDialog({ open, onClose }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const { trigger, isMutating } = useInviteMember();
  const { mutate } = useSWRConfig();

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
      await mutate((key: unknown) => Array.isArray(key) && key[0] === "list-members");
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

        <div className="-mx-4 flex flex-row justify-end gap-x-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:px-6">
          <SecondaryButton outlined type="button" label="Batal" onClick={handleClose} className="w-auto px-6" />
          <PrimaryButton
            disabled={!isValidEmail}
            loading={isMutating}
            onClick={handleSubmit}
            label="Undang"
            className="w-auto px-6"
          />
        </div>
      </div>
    </LoonasDialog>
  );
}
