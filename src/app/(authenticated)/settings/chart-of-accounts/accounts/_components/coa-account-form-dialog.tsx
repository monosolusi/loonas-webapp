"use client";

import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountType, ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";
import { getCodeRangeHint } from "@/features/accounting/presentations/helpers/reserved-code-range";

type CоаAccountFormDialogMode = "create" | "edit";

type CоаAccountFormValues = {
  code: string;
  name: string;
  type: AccountType | "";
  parentAccount: LedgerAccountEntity | null;
};

type CoaAccountFormDialogProps = {
  open: boolean;
  mode: CоаAccountFormDialogMode;
  values: CоаAccountFormValues;
  isSystem: boolean;
  submitting: boolean;
  fieldError: string | null;
  excludeIds?: string[];
  onChangeCode: (v: string) => void;
  onChangeName: (v: string) => void;
  onChangeType: (v: string) => void;
  onChangeParent: (v: LedgerAccountEntity | null) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const ACCOUNT_TYPE_OPTIONS = (Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]).map((t) => ({
  value: t,
  label: ACCOUNT_TYPE_LABELS[t],
}));

export function CoaAccountFormDialog(props: CoaAccountFormDialogProps) {

  const isCreate = props.mode === "create";
  const title = isCreate ? "Tambah Akun" : "Ubah Akun";
  const submitLabel = isCreate ? "Simpan" : "Simpan Perubahan";

  const codeDisabled = props.submitting || props.isSystem;
  const typeDisabled = props.submitting || props.isSystem;

  // Advisory code range hint for the selected type — server 400 CODE_RESERVED is the authoritative gate
  const codeRangeHint = props.values.type ? getCodeRangeHint(props.values.type as AccountType) : null;

  const isSubmitDisabled =
    props.submitting ||
    !props.values.code.trim() ||
    !props.values.name.trim() ||
    !props.values.type;

  const indukDescription = isCreate
    ? "Kosongkan jika ini adalah akun utama tanpa induk."
    : "Pilih akun induk baru, atau kosongkan untuk menjadikan akun ini sebagai akun utama.";

  return (
    <LoonasDialog
      title={title}
      width="lg"
      open={props.open}
      onClose={props.onClose}
      allowDismiss={!props.submitting}
    >
      <div className="mt-4 flex flex-col gap-y-5">
        {props.isSystem && (
          <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3">
            <p className="text-sm text-warning-500">
              Kode dan tipe akun bawaan tidak dapat diubah untuk menjaga integritas jurnal.
            </p>
          </div>
        )}

        {/* Row 1: Kode + Tipe — each column is its own div so the hint stacks under Kode without displacing Tipe */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex flex-col gap-y-1">
            <TextInput
              label="Kode Akun"
              autoFocus={!codeDisabled}
              required
              value={props.values.code}
              onChange={props.onChangeCode}
              disabled={codeDisabled}
              error={props.fieldError}
              aria-describedby={
                codeRangeHint && !props.fieldError ? "coa-code-range-hint" : props.fieldError ? "coa-code-error" : undefined
              }
              description={codeDisabled && props.isSystem ? "Kolom ini tidak dapat diubah pada akun bawaan." : undefined}
            />
            {codeRangeHint && !codeDisabled && !props.fieldError && (
              <p id="coa-code-range-hint" className="text-xs leading-4 text-neutral-300">
                {codeRangeHint}
              </p>
            )}
          </div>
          <div>
            <SelectInput
              label="Tipe Akun"
              required
              value={props.values.type}
              options={ACCOUNT_TYPE_OPTIONS}
              onChange={props.onChangeType}
              placeholder="Pilih tipe akun"
              disabled={typeDisabled}
              tooltip={
                typeDisabled && props.isSystem
                  ? "Kolom ini tidak dapat diubah pada akun bawaan."
                  : undefined
              }
            />
          </div>
        </div>

        {/* Row 2: Nama (full width) */}
        <TextInput
          label="Nama Akun"
          required
          value={props.values.name}
          onChange={props.onChangeName}
          disabled={props.submitting}
        />

        {/* Row 3: Induk (full width) */}
        <LedgerAccountCombobox
          label="Akun Induk"
          placeholder="Pilih akun induk (opsional)"
          value={props.values.parentAccount}
          onChange={props.onChangeParent}
          disabled={props.submitting}
          excludeIds={props.excludeIds}
        />
        <p className="text-xs leading-4 text-neutral-200">{indukDescription}</p>

        {props.fieldError && (
          <p id="coa-code-error" className="text-xs leading-4 text-red-500" role="alert">
            {props.fieldError}
          </p>
        )}

        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={props.onClose} disabled={props.submitting} />
          <PrimaryButton
            label={submitLabel}
            disabled={isSubmitDisabled}
            loading={props.submitting}
            onClick={props.onSubmit}
            className="w-auto px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
