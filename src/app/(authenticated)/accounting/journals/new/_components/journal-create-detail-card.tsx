"use client";

import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";
import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useJournalCreate } from "@/app/(authenticated)/accounting/journals/new/_providers/journal-create-provider";

export function JournalCreateDetailCard() {
  const { postingDate, memo, fieldErrors, setPostingDate, setMemo } = useJournalCreate();

  return (
    <SectionCard
      iconSrc="/assets/images/document-icon-primary-300-w16-h16.svg"
      title="Detail Jurnal"
    >
      <div className={clsx("grid grid-cols-2 gap-4 max-sm:grid-cols-1")}>
        <div className="flex flex-col gap-y-1">
          <DatePickerInput
            label="Tanggal Posting"
            required
            value={postingDate}
            onChange={setPostingDate}
            placeholder="Pilih tanggal"
          />
          {fieldErrors.date && (
            <span className="text-xs leading-4 font-normal text-red-500">{fieldErrors.date}</span>
          )}
        </div>

        <TextInput
          label="Memo"
          value={memo}
          onChange={setMemo}
          placeholder="Keterangan jurnal (opsional)"
          maxLength={500}
          error={fieldErrors.memo}
        />
      </div>
    </SectionCard>
  );
}
