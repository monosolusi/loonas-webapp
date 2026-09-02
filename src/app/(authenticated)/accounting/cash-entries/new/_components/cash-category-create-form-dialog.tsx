"use client";

import { useId, useMemo } from "react";
import clsx from "clsx";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { toLedgerAccountOptionParts } from "@/features/accounting/domain/helpers/ledger-account-option";

type LedgerAccountOption = SearchComboboxOption & { entity: LedgerAccountEntity };

type CashCategoryCreateFormDialogProps = {
  open: boolean;
  /**
   * `null` only for the list-page choose-mode caller before a direction has been picked — the
   * entry-flow caller always passes a concrete direction.
   */
  direction: CashEntryDirection | null;
  /**
   * Present only for the list-page choose-mode caller: renders a direction selector in place of
   * the static "arah X" copy and routes a pick back through `direction`. Omitted by the
   * entry-flow caller, which keeps the original fixed-direction rendering byte-identical.
   */
  onDirectionChange?: (direction: CashEntryDirection) => void;
  name: string;
  account: LedgerAccountEntity | null;
  /** Already narrowed to the account types eligible for `direction` by the caller. */
  accounts: LedgerAccountEntity[];
  accountsLoading: boolean;
  /**
   * Copy for a failed account-list fetch, or (choose-mode caller only) for "no direction picked
   * yet" — both leave the picker disabled with an explanation instead of enabled-and-empty.
   */
  accountsError: string | null;
  /**
   * Styling tone for `accountsError`. Defaults to `"error"` (the original, entry-flow-only
   * behaviour: red validation copy) since a real fetch failure IS an error. The list-page
   * choose-mode caller passes `"notice"` for its benign "no direction picked yet" case, which is
   * not a failure and should not read as one.
   */
  accountsErrorTone?: "error" | "notice";
  /**
   * Present only for the list-page choose-mode caller: neutral notice shown after a direction
   * switch discards a previously chosen account. `null` renders nothing — the entry-flow caller
   * never passes this prop at all, so its rendering stays byte-identical.
   */
  accountDiscardedNotice?: string | null;
  formError: string | null;
  loading: boolean;
  onNameChange: (value: string) => void;
  onAccountChange: (value: LedgerAccountEntity | null) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const DIRECTION_LABELS: Record<CashEntryDirection, string> = {
  [CashEntryDirection.In]: "Kas Masuk",
  [CashEntryDirection.Out]: "Kas Keluar",
};

// TabFilter is index-based, so the tab labels and the direction values they represent are kept
// as parallel tuples, mirroring cash-entry-create-form.tsx's direction selector.
const DIRECTION_TABS = ["Kas Masuk", "Kas Keluar"] as const;
const DIRECTION_VALUES = [CashEntryDirection.In, CashEntryDirection.Out] as const;

export function CashCategoryCreateFormDialog({
  open,
  direction,
  onDirectionChange,
  name,
  account,
  accounts,
  accountsLoading,
  accountsError,
  accountsErrorTone = "error",
  accountDiscardedNotice = null,
  formError,
  loading,
  onNameChange,
  onAccountChange,
  onSubmit,
  onClose,
}: CashCategoryCreateFormDialogProps) {
  // This is a shared Display component; a hardcoded id would collide if two instances ever mount
  // together, silently pointing both groups' aria-labelledby at the same node.
  const directionLabelId = useId();

  const accountOptions = useMemo<LedgerAccountOption[]>(
    () => accounts.map((a) => ({ ...toLedgerAccountOptionParts(a), entity: a })),
    [accounts],
  );

  const selectedAccount = useMemo<LedgerAccountOption | null>(
    () => (account ? (accountOptions.find((option) => option.id === account.id) ?? null) : null),
    [account, accountOptions],
  );

  return (
    <LoonasDialog title="Tambah Kategori Kas" width="sm" open={open} onClose={onClose} allowDismiss={!loading}>
      <div className="mt-2 flex flex-col gap-y-4">
        {onDirectionChange ? (
          <div role="group" aria-labelledby={directionLabelId} className="flex flex-col gap-y-2">
            <span id={directionLabelId} className="text-base">
              Arah Kas<span className="text-red-500"> *</span>
            </span>
            {/* Plain toggle buttons, not TabFilter/Headless UI's TabGroup — TabGroup treats any
                non-null `selectedIndex` as controlled and its reducer clamps a negative index to
                tab 0, so there is no way to encode "nothing picked yet" through it. Styled off
                `direction === value` so a blank starting state is representable at all. */}
            <div className="flex w-fit flex-row gap-1 rounded-lg bg-neutral-100 p-1">
              {DIRECTION_VALUES.map((value, index) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onDirectionChange(value)}
                  aria-pressed={direction === value}
                  className={clsx(
                    "focus-visible:ring-primary-300 rounded-md px-4 py-1.5 text-sm leading-5 outline-none focus-visible:ring-2",
                    direction === value
                      ? "bg-white text-neutral-500 shadow-sm"
                      : "text-neutral-300 hover:text-neutral-400",
                  )}
                >
                  {DIRECTION_TABS[index]}
                </button>
              ))}
            </div>
            {accountDiscardedNotice && <p className="text-xs leading-4 text-neutral-500">{accountDiscardedNotice}</p>}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            Kategori ini akan tersedia untuk arah{" "}
            <span className="font-medium">{direction ? DIRECTION_LABELS[direction] : ""}</span>.
          </p>
        )}

        <TextInput
          label="Nama Kategori"
          placeholder="Masukkan nama kategori"
          value={name}
          onChange={onNameChange}
          required
        />

        <div className="flex flex-col gap-y-2">
          <SearchCombobox<LedgerAccountOption>
            label="Akun"
            options={accountOptions}
            value={selectedAccount}
            onChange={(option) => onAccountChange(option ? option.entity : null)}
            placeholder="Pilih akun"
            required
            disabled={accountsLoading || !!accountsError}
            emptyMessage={
              accountsError
                ? accountsErrorTone === "notice"
                  ? accountsError
                  : "Akun tidak dapat dimuat"
                : accountsLoading
                  ? "Memuat akun..."
                  : "Tidak ditemukan"
            }
          />
          {accountsError && (
            <span
              className={clsx(
                "text-xs leading-4 font-normal",
                accountsErrorTone === "notice" ? "text-neutral-500" : "text-red-500",
              )}
            >
              {accountsError}
            </span>
          )}
        </div>

        {formError && (
          <div className="border-error-300 bg-error-50 rounded-lg border px-4 py-3">
            <p className="text-error-500 text-sm">{formError}</p>
          </div>
        )}

        <DialogFooter>
          <SecondaryButton outlined type="button" label="Batal" disabled={loading} onClick={onClose} />
          <PrimaryButton
            type="button"
            label="Simpan"
            loading={loading}
            loadingLabel="Menyimpan..."
            disabled={!name.trim() || !account || loading}
            onClick={onSubmit}
            className="px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
