"use client";

import React, { useState } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { BankCombobox } from "@/features/bank/presentation/components/bank-combobox";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { InquiryBankAccount } from "@/features/bank/presentation/components/inquiry-bank-account";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useCreateAccountBankAccount } from "@/features/bank/presentation/hooks/use-create-account-bank-account";
import { useSWRConfig } from "swr";
import { useMemo } from "react";

interface CreateBankAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateBankAccountDialog(props: CreateBankAccountDialogProps) {
  const [bank, setBank] = useState<BankEntity | undefined>(undefined);
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [inquiredAccount, setInquiredAccount] = useState<AccountInquiryResultEntity>();
  const { trigger, isMutating } = useCreateAccountBankAccount();
  const { mutate } = useSWRConfig();

  const isDisabled = useMemo((): boolean => {
    if (!accountNumber) return true;
    if (!bank) return true;
    if (!inquiredAccount) return true;
    return false;
  }, [accountNumber, bank, inquiredAccount]);

  const resetForm = () => {
    setBank(undefined);
    setAccountNumber("");
    setInquiredAccount(undefined);
  };

  const handleClose = () => {
    resetForm();
    props.onClose();
  };

  const handleSubmit = async () => {
    if (!bank || !accountNumber || !inquiredAccount || isMutating) return;

    try {
      await trigger({
        bankId: bank.id,
        accountNumber: accountNumber,
      });

      await mutate((key: unknown) => Array.isArray(key) && key[0] === "list-account-bank-account");
      handleClose();
    } catch {
      // Error is captured by SWR's `error` state — user can retry
    }
  };

  return (
    <LoonasDialog title="Tambah Rekening Bank Baru" width="lg" open={props.open} onClose={handleClose}>
      <div className="mt-2 flex flex-col gap-y-6">
        <p className="text-sm text-gray-500">
          Pastikan rekening ini terdaftar atas nama bisnismu. Ini penting untuk kelancaran proses pembayaran.
        </p>

        <BankCombobox selectedBank={bank} setSelectedBank={setBank} />

        <div className="flex flex-col gap-y-4 sm:flex-row sm:items-end sm:gap-x-4 sm:gap-y-0">
          <div className="flex-[3]">
            <TextInput
              label="Nomor Rekening"
              type="text"
              inputMode="numeric"
              placeholder="Cth. 1234567890"
              value={accountNumber}
              onChange={setAccountNumber}
              required
            />
          </div>
          <div className="flex-[2]">
            <InquiryBankAccount bankId={bank?.id} accountNumber={accountNumber} onInquired={setInquiredAccount} />
          </div>
        </div>

        {inquiredAccount && (
          <div className="flex flex-col gap-y-2">
            <label className="text-base text-neutral-500">Nama Pemilik Rekening</label>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-base text-neutral-500">
              {inquiredAccount.accountHolderName}
            </div>
          </div>
        )}

        <div className="-mx-4 flex flex-row justify-end gap-x-3 border-t border-gray-200 px-4 pt-4 sm:-mx-6 sm:px-6">
          <SecondaryButton outlined type="button" label="Batal" onClick={handleClose} />
          <PrimaryButton
            disabled={isDisabled}
            loading={isMutating}
            onClick={handleSubmit}
            label="Tambah Rekening"
            className="w-auto px-6"
          />
        </div>
      </div>
    </LoonasDialog>
  );
}
