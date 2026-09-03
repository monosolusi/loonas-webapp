"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { eligibleAccountTypesFor } from "@/features/accounting/domain/helpers/cash-category-eligibility";
import { directionLabel } from "@/app/(authenticated)/accounting/cash-categories/_utils/direction-label";
import {
  CASH_CATEGORY_ACCOUNT_COPY,
  resolveEligibleAccountTypesHint,
} from "@/app/(authenticated)/accounting/cash-categories/_utils/cash-category-account-copy";

type CashCategoryAccountFormDialogProps = {
  open: boolean;
  /** Fixed at create time — displayed read-only. */
  direction: CashEntryDirection;
  /** Fixed for a general category — displayed read-only, never sent on the PATCH. */
  name: string;
  /** The currently-resolved account, or null while loading / while the saved account is missing. */
  account: LedgerAccountEntity | null;
  /** Non-null only in the loaded-and-absent state — never shown while the CoA list is loading. */
  missingSavedAccountId: string | null;
  loading: boolean;
  /** CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH / VALIDATION_FAILED — rendered beside the account field. */
  accountError: string | null;
  /** CASH_CATEGORY_REFERENCED / CASH_CATEGORY_CURATED / CASH_CATEGORY_NOT_FOUND — dialog-wide strip. */
  formError: string | null;
  onAccountChange: (account: LedgerAccountEntity | null) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function CashCategoryAccountFormDialog({
  open,
  direction,
  name,
  account,
  missingSavedAccountId,
  loading,
  accountError,
  formError,
  onAccountChange,
  onSubmit,
  onClose,
}: CashCategoryAccountFormDialogProps) {
  const directionLabelText = directionLabel(direction);
  const eligibleHint = resolveEligibleAccountTypesHint(direction);

  return (
    <LoonasDialog title="Ubah Akun" width="sm" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        {formError && (
          <div className="border-error-300/20 bg-error-300/5 rounded-lg border px-4 py-3">
            <p className="text-error-500 text-sm">{formError}</p>
          </div>
        )}

        <p className="text-sm text-neutral-400">{CASH_CATEGORY_ACCOUNT_COPY.description}</p>

        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-base">Nama Kategori</span>
          <p className="text-base text-neutral-400">{name}</p>
          <p className="text-xs leading-4 text-neutral-300">{CASH_CATEGORY_ACCOUNT_COPY.nameImmutableHint}</p>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-base">Arah</span>
          <p className="text-base text-neutral-400">{directionLabelText}</p>
        </div>

        {/* `LedgerAccountCombobox` has no `error` slot and no passthrough to its inner
            `ComboboxInput`, so this wrapper owns the surface — `aria-invalid`/`aria-describedby`
            cannot be restored from outside it. */}
        <div className="flex flex-col gap-y-2">
          <LedgerAccountCombobox
            label="Akun"
            value={account}
            onChange={onAccountChange}
            filter={(candidate) => eligibleAccountTypesFor(direction).includes(candidate.type)}
          />
          <p className="text-xs leading-4 text-neutral-300">{eligibleHint}</p>
          {missingSavedAccountId && (
            <p className="text-xs leading-4 text-neutral-500">{CASH_CATEGORY_ACCOUNT_COPY.missingSavedAccountNotice}</p>
          )}
          {accountError && (
            <span role="alert" className="text-xs leading-4 font-normal text-red-500">
              {accountError}
            </span>
          )}
        </div>

        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={onClose} />
          <PrimaryButton
            label="Simpan"
            disabled={!account}
            loading={loading}
            loadingLabel="Menyimpan..."
            onClick={onSubmit}
            className="px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
