"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { TrashIcon } from "@heroicons/react/24/outline";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { JournalLineDraft, AccountFilter } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor.types";
import { JournalLineAccountCombobox } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-account-combobox";
import { JournalLineMoneyCell } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-money-cell";

type JournalLineRowProps = {
  line: JournalLineDraft;
  lineNumber: number;
  accountFilter?: AccountFilter;
  disabled?: boolean;
  isRemovable: boolean;
  autoFocus?: boolean;
  onAutoFocusMounted?: () => void;
  onLineChange: (next: JournalLineDraft) => void;
  onRemove: () => void;
};

export function JournalLineRow({
  line,
  lineNumber,
  accountFilter,
  disabled,
  isRemovable,
  autoFocus,
  onAutoFocusMounted,
  onLineChange,
  onRemove,
}: JournalLineRowProps) {
  // SSR-safe mobile detection — default false so the desktop branch renders on first paint (SSR + hydration).
  // Switches to true immediately after mount if the actual viewport is <640px.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Clear the parent's autoFocusKey after this row mounts so re-renders never re-steal focus.
  // Runs once on mount only; isMobile has already resolved by the time a user adds a row.
  useEffect(() => {
    if (autoFocus && onAutoFocusMounted) {
      onAutoFocusMounted();
    }
  }, []); // intentional mount-only effect

  const debitDeEmphasized = line.debit === 0 && line.credit > 0;
  const creditDeEmphasized = line.credit === 0 && line.debit > 0;

  const handleAccountChange = (account: LedgerAccountEntity | null) => {
    onLineChange({ ...line, account_id: account?.id ?? null });
  };

  const handleDebitChange = (value: number) => {
    if (value > 0) {
      onLineChange({ ...line, debit: value, credit: 0 });
    } else {
      onLineChange({ ...line, debit: 0 });
    }
  };

  const handleCreditChange = (value: number) => {
    if (value > 0) {
      onLineChange({ ...line, debit: 0, credit: value });
    } else {
      onLineChange({ ...line, credit: 0 });
    }
  };

  const removeAriaLabel = isRemovable
    ? `Hapus baris ${lineNumber}`
    : `Hapus baris ${lineNumber} (minimal 2 baris)`;

  const removeButton = (extraClassName?: string) => (
    <button
      type="button"
      onClick={isRemovable ? onRemove : undefined}
      aria-label={removeAriaLabel}
      aria-disabled={!isRemovable}
      className={clsx(
        "flex size-8 items-center justify-center rounded-lg transition-colors",
        isRemovable
          ? "text-neutral-400 hover:bg-neutral-100/50 hover:text-neutral-500"
          : "cursor-default text-neutral-200",
        extraClassName,
      )}
    >
      <TrashIcon className="size-4" aria-hidden="true" />
    </button>
  );

  // Conditional render: exactly ONE layout branch is in the DOM at a time,
  // which guarantees exactly ONE <input autofocus> when autoFocus is true.
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-neutral-100 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="mb-1 block text-sm text-neutral-300">Akun</span>
            <JournalLineAccountCombobox
              value={line.account_id}
              onChange={handleAccountChange}
              accountFilter={accountFilter}
              disabled={disabled}
              ariaLabel={`Akun baris ${lineNumber}`}
              autoFocus={autoFocus}
            />
          </div>
          {removeButton("mt-6 shrink-0")}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="mb-1 block text-sm text-neutral-300">Debit</span>
            <JournalLineMoneyCell
              value={line.debit}
              onChange={handleDebitChange}
              ariaLabel={`Debit baris ${lineNumber}`}
              disabled={disabled}
              deEmphasized={debitDeEmphasized}
            />
          </div>
          <div>
            <span className="mb-1 block text-sm text-neutral-300">Kredit</span>
            <JournalLineMoneyCell
              value={line.credit}
              onChange={handleCreditChange}
              ariaLabel={`Kredit baris ${lineNumber}`}
              disabled={disabled}
              deEmphasized={creditDeEmphasized}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-start gap-3">
      <JournalLineAccountCombobox
        value={line.account_id}
        onChange={handleAccountChange}
        accountFilter={accountFilter}
        disabled={disabled}
        ariaLabel={`Akun baris ${lineNumber}`}
        autoFocus={autoFocus}
      />
      <JournalLineMoneyCell
        value={line.debit}
        onChange={handleDebitChange}
        ariaLabel={`Debit baris ${lineNumber}`}
        disabled={disabled}
        deEmphasized={debitDeEmphasized}
      />
      <JournalLineMoneyCell
        value={line.credit}
        onChange={handleCreditChange}
        ariaLabel={`Kredit baris ${lineNumber}`}
        disabled={disabled}
        deEmphasized={creditDeEmphasized}
      />
      <div className="flex h-11 items-center">
        {removeButton()}
      </div>
    </div>
  );
}
