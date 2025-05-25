"use client";

import { Card } from "@/core/presentations/components/card";
import { BankCombobox } from "@/app/(authenticated)/invoices/incoming/create/@banks/_components/bank-combobox";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import React, { useState } from "react";
import { TextInput } from "@/core/presentations/components/text-input";
import { InquiryBankAccount } from "@/features/bank/presentation/components/inquiry-bank-account";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";
import {
  CreateAccountBankAccountButton
} from "@/app/(authenticated)/settings/bank-accounts/create/_components/create-button";
import { CancelButton } from "@/app/(authenticated)/settings/bank-accounts/create/_components/cancel-button";

export default function CreateBankAccountPage() {
  const [bank, setBank] = useState<BankEntity | null>(null);
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [inquiredAccount, setInquiredAccount] = useState<AccountInquiryResultEntity>();

  return (
    <div className="flex flex-row items-start justify-center">
      <Card className="w-full max-w-md ">
        <div className="flex flex-col space-y-8 -mx-4 sm:-mx-6">
          <div className="flex flex-col space-y-2 px-4 sm:px-6">
            <h1 className="text-base font-semibold text-gray-900">Tambah Rekening Bank Baru</h1>
            <p className="text-sm text-gray-400">
              Pastikan rekening ini terdaftar atas nama bisnismu, ya. Ini penting untuk kelancaran proses
              pembayaran.
            </p>
          </div>
          <div className="flex flex-col space-y-4 px-4 sm:px-6">
            <BankCombobox
              selectedBank={bank}
              setSelectedBank={setBank}
            />

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:items-end">
              <div className="flex-3">
                <TextInput
                  title="Nomor Rekening"
                  type="text"
                  inputMode="numeric"
                  placeholder="Cth. 1234567890"
                  value={accountNumber}
                  onChange={setAccountNumber}
                  required
                />
              </div>
              <div className="flex-2">
                <InquiryBankAccount
                  bankId={bank?.id}
                  accountNumber={accountNumber}
                  onInquired={setInquiredAccount}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Pemilik Rekening
              </label>
              <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                {inquiredAccount?.accountHolderName} &nbsp;
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end space-x-4 border-t border-gray-200 pt-4 px-4 sm:px-6">
            <CancelButton />
            <CreateAccountBankAccountButton
              inquiredAccount={inquiredAccount}
              accountNumber={accountNumber}
              bank={bank}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
