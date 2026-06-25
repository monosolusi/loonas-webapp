"use client";

import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";
import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { usePphFinal } from "@/app/(authenticated)/finance/pph-final/_providers/pph-final-provider";

export function PphFinalFormCard() {
  const { journalDate, amount, cashAccount, memo, fieldErrors, formError, setJournalDate, setAmount, setCashAccount, setMemo } =
    usePphFinal();

  // Validity hints — shown as soon as the field is touched and invalid, cleared on correction.
  // amount hint: visible when amount has been interacted with but is still 0 or invalid.
  // cashAccount hint: visible when no account is selected.
  // Both are additive and do not affect the disabled-button logic in the submit button.
  const showAmountHint = amount === 0;
  const showCashAccountHint = !cashAccount;

  return (
    <SectionCard title="Detail Pembayaran">
      <div className="flex flex-col gap-y-4">
        <div className={clsx("grid grid-cols-2 gap-4 max-sm:grid-cols-1")}>
          <div className="flex flex-col gap-y-1">
            <DatePickerInput
              label="Tanggal"
              required
              value={journalDate}
              onChange={(date) => date && setJournalDate(date)}
              placeholder="Pilih tanggal"
            />
            {fieldErrors.date && (
              <span className="text-xs leading-4 font-normal text-red-500" role="alert">
                {fieldErrors.date}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-y-1">
            <CurrencyInput
              label="Jumlah"
              placeholder="0"
              value={amount}
              onChange={setAmount}
              required
              inputMode="numeric"
            />
            {showAmountHint && (
              <span className="text-xs leading-4 font-normal text-red-500" role="alert">
                Masukkan jumlah yang valid.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-y-1">
            <LedgerAccountCombobox
              label="Akun Kas"
              placeholder="Pilih akun kas"
              value={cashAccount}
              onChange={setCashAccount}
              required
              filter={(a) => a.type === AccountType.ASSET && a.code >= "1100" && a.code < "1200"}
            />
            {showCashAccountHint && (
              <span className="text-xs leading-4 font-normal text-red-500" role="alert">
                Pilih akun kas untuk pembayaran ini.
              </span>
            )}
          </div>

          <TextInput
            label="Memo"
            value={memo}
            onChange={setMemo}
            placeholder="Keterangan pembayaran (opsional)"
            maxLength={500}
          />
        </div>

        {formError && (
          <p className="text-sm text-red-500" role="alert">
            {formError}
          </p>
        )}
      </div>
    </SectionCard>
  );
}
