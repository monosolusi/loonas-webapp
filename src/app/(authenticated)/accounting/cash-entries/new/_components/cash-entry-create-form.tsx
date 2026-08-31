"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { SectionCard } from "@/core/presentations/components/section-card";
import { TabFilter } from "@/core/presentations/components/tab-filter";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";
import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import { TextAreaInput } from "@/core/presentations/components/text-area-input";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { useCashEntryCreate } from "@/app/(authenticated)/accounting/cash-entries/new/_providers/cash-entry-create-provider";
import { CashEntryCategoryPicker } from "@/app/(authenticated)/accounting/cash-entries/new/_components/cash-entry-category-picker";

// TabFilter is index-based, so the tab labels and the direction values they represent are kept
// as parallel tuples, mirroring the list page's DIRECTION_TABS/DIRECTION_VALUES.
const DIRECTION_TABS = ["Kas Masuk", "Kas Keluar"] as const;
const DIRECTION_VALUES = [CashEntryDirection.In, CashEntryDirection.Out] as const;

const MAX_NOTE_LENGTH = 1000;

export function CashEntryCreateForm() {
  const {
    direction,
    amount,
    date,
    note,
    fieldErrors,
    formError,
    isSubmitting,
    isFormComplete,
    changeDirection,
    setAmount,
    setDate,
    setNote,
    handleSubmit,
  } = useCashEntryCreate();

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader
        title="Catat Kas"
        backHref="/accounting/cash-entries"
        action={
          <PrimaryButton
            label="Simpan"
            loadingLabel="Menyimpan..."
            loading={isSubmitting}
            disabled={!isFormComplete || isSubmitting}
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          />
        }
      />

      <SectionCard title="Detail Entri Kas">
        <div className="flex flex-col gap-y-4">
          <div role="group" aria-labelledby="cash-entry-direction-label" className="flex flex-col gap-y-2">
            <span id="cash-entry-direction-label" className="text-base">
              Arah Kas<span className="text-red-500"> *</span>
            </span>
            <TabFilter
              tabs={DIRECTION_TABS}
              selectedIndex={DIRECTION_VALUES.indexOf(direction)}
              onChange={(index) => changeDirection(DIRECTION_VALUES[index])}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <CurrencyInput
              label="Nominal (Rp)"
              placeholder="0"
              value={amount}
              onChange={setAmount}
              error={fieldErrors.amount ?? null}
            />

            {/* DatePickerInput has no `error` prop, so the message renders as a sibling —
                same shape as the journal create form. */}
            <div className="flex flex-col gap-y-1">
              <DatePickerInput label="Tanggal" required value={date} onChange={setDate} />
              {fieldErrors.date && (
                <span className="text-xs leading-4 font-normal text-red-500">{fieldErrors.date}</span>
              )}
            </div>
          </div>

          <CashEntryCategoryPicker />

          <TextAreaInput
            label="Catatan"
            placeholder="Tuliskan catatan (opsional)"
            value={note}
            onChange={setNote}
            maxLength={MAX_NOTE_LENGTH}
          />

          {formError && (
            <div className="border-error-300 bg-error-50 rounded-lg border px-4 py-3">
              <p className="text-error-500 text-sm">{formError}</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
