"use client";

import { useState, useMemo } from "react";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { SearchCombobox } from "@/core/presentations/components/search-combobox";
import { CHANGE_REASON_CATEGORY_OPTIONS } from "@/features/accounting/presentations/helpers/change-reason-category-labels";
import { useJournalDetail } from "@/app/(authenticated)/finance/journals/[id]/_providers/journal-detail-provider";

const MIN_DETAIL_LENGTH = 10;
const MAX_DETAIL_LENGTH = 1000;

export function JournalReverseForm() {
  const { isReversing, reverseFormError, handleSubmitReverse, closeReverseDialog } = useJournalDetail();

  const [category, setCategory] = useState("");
  const [detail, setDetail] = useState("");
  const [touched, setTouched] = useState(false);

  const selectedCategory = useMemo(
    () => CHANGE_REASON_CATEGORY_OPTIONS.find((opt) => opt.id === category) ?? null,
    [category],
  );

  const detailError = useMemo((): string | null => {
    if (!touched) return null;
    if (detail.trim().length === 0) return "Detail alasan tidak boleh kosong.";
    if (detail.trim().length < MIN_DETAIL_LENGTH) return `Minimal ${MIN_DETAIL_LENGTH} karakter.`;
    return null;
  }, [detail, touched]);

  const isValid = useMemo(
    () =>
      category.trim().length > 0 &&
      detail.trim().length >= MIN_DETAIL_LENGTH &&
      detail.trim().length <= MAX_DETAIL_LENGTH,
    [category, detail],
  );

  const handleClose = () => {
    if (isReversing) return;
    setCategory("");
    setDetail("");
    setTouched(false);
    closeReverseDialog();
  };

  const handleSubmit = async () => {
    setTouched(true);
    if (!isValid || isReversing) return;
    const ok = await handleSubmitReverse(category.trim(), detail.trim());
    if (ok) {
      setCategory("");
      setDetail("");
      setTouched(false);
    }
  };

  return (
    <>
      <SearchCombobox
        label="Kategori alasan"
        required
        placeholder="Cari atau pilih kategori alasan..."
        options={CHANGE_REASON_CATEGORY_OPTIONS}
        value={selectedCategory}
        onChange={(opt) => setCategory(opt?.id ?? "")}
        disabled={isReversing}
      />

      <div className="flex flex-col gap-y-1.5">
        <label htmlFor="reverse-detail" className="text-sm font-medium text-neutral-500">
          Detail alasan <span className="text-error-300">*</span>
        </label>
        <textarea
          id="reverse-detail"
          rows={4}
          maxLength={MAX_DETAIL_LENGTH}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Tuliskan detail alasan pembalikan jurnal (min. 10 karakter)..."
          disabled={isReversing}
          className="w-full resize-none rounded-lg border border-neutral-100 px-3 py-2 text-sm text-neutral-500 placeholder:text-neutral-200 focus:border-primary-300 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-300"
        />
        {detailError && <p className="text-xs text-error-300">{detailError}</p>}
      </div>

      {reverseFormError && (
        <div className="rounded-lg border border-error-300 bg-error-50 px-4 py-3">
          <p className="text-sm text-error-500">{reverseFormError}</p>
        </div>
      )}

      <DialogFooter>
        <SecondaryButton outlined type="button" label="Batal" disabled={isReversing} onClick={handleClose} />
        <PrimaryButton
          type="button"
          label="Balik Jurnal"
          loading={isReversing}
          disabled={!isValid || isReversing}
          onClick={handleSubmit}
        />
      </DialogFooter>
    </>
  );
}
