"use client";

import { useState, useCallback } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { JournalLineEditorProps, JournalLineDraft } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor.types";
import { JournalLineRow } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-row";
import { JournalLineErrorBlock } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-error-block";
import { JournalLineTotalsFooter } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-totals-footer";
import { useJournalLineBalance } from "@/features/accounting/presentations/hooks/use-journal-line-balance";

export function JournalLineEditor({ lines, onChange, accountFilter, disabled, error }: JournalLineEditorProps) {
  const [keys, setKeys] = useState<string[]>(() => lines.map(() => crypto.randomUUID()));
  const [autoFocusKey, setAutoFocusKey] = useState<string | null>(null);

  const balance = useJournalLineBalance(lines);

  const handleLineChange = useCallback(
    (index: number, next: JournalLineDraft) => {
      const nextLines = lines.map((l, i) => (i === index ? next : l));
      onChange(nextLines);
    },
    [lines, onChange],
  );

  const handleRemove = useCallback(
    (index: number) => {
      if (lines.length <= 2) return;
      const nextLines = lines.filter((_, i) => i !== index);
      const nextKeys = keys.filter((_, i) => i !== index);
      setKeys(nextKeys);
      onChange(nextLines);
    },
    [lines, keys, onChange],
  );

  const handleAddLine = useCallback(() => {
    const newKey = crypto.randomUUID();
    const newLine: JournalLineDraft = { account_id: null, debit: 0, credit: 0 };
    setKeys((prev) => [...prev, newKey]);
    setAutoFocusKey(newKey);
    onChange([...lines, newLine]);
  }, [lines, onChange]);

  const clearAutoFocus = useCallback((key: string) => {
    setAutoFocusKey((prev) => (prev === key ? null : prev));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Header row (desktop only) */}
      <div className="hidden grid-cols-[1fr_1fr_1fr_auto] gap-3 sm:grid">
        <span className="text-sm font-medium text-neutral-300">Akun</span>
        <span className="text-sm font-medium text-neutral-300">Debit</span>
        <span className="text-sm font-medium text-neutral-300">Kredit</span>
        <div className="size-8" aria-hidden="true" />
      </div>

      {/* Line rows */}
      <div className="flex flex-col gap-3">
        {lines.map((line, index) => {
          const key = keys[index] ?? index.toString();
          const isAutoFocus = autoFocusKey === key;
          return (
            <JournalLineRow
              key={key}
              line={line}
              lineNumber={index + 1}
              accountFilter={accountFilter}
              disabled={disabled}
              isRemovable={lines.length > 2}
              autoFocus={isAutoFocus}
              onAutoFocusMounted={isAutoFocus ? () => clearAutoFocus(key) : undefined}
              onLineChange={(next) => handleLineChange(index, next)}
              onRemove={() => handleRemove(index)}
            />
          );
        })}
      </div>

      {/* Error block (Zone D) */}
      <JournalLineErrorBlock error={error} />

      {/* Separator */}
      <div className="border-t border-neutral-100" />

      {/* Totals footer */}
      <JournalLineTotalsFooter balance={balance} />

      {/* Add line button */}
      <SecondaryButton
        outlined
        type="button"
        label="Tambah Baris"
        leftIcon={<PlusIcon className="size-4" />}
        onClick={handleAddLine}
        disabled={disabled}
      />
    </div>
  );
}
