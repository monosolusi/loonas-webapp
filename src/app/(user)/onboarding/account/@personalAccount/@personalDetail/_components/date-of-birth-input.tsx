"use client";

import { useId, useMemo, useState } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_providers/personal-account-provider";
import {
  DateOfBirthParts,
  dateOfBirthErrorCopy,
  daysInMonth,
  EARLIEST_SELECTABLE_YEAR,
  latestSelectableYear,
} from "@/app/(user)/onboarding/account/_utils/date-of-birth";

const MONTHS = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

export function DateOfBirthInput() {
  const { data, update, dateOfBirthResolution, showFieldErrors } = usePersonalAccountData();
  const [isTouched, setIsTouched] = useState(false);
  const groupLabelId = useId();
  const errorId = useId();

  const parts: DateOfBirthParts = data.dateOfBirth ?? {};

  const years = useMemo(() => {
    const latest = latestSelectableYear();
    return Array.from({ length: latest - EARLIEST_SELECTABLE_YEAR + 1 }, (_, i) => {
      const year = latest - i;
      return { value: year.toString(), label: year.toString() };
    });
  }, []);

  const days = useMemo(() => {
    const limit = daysInMonth(parts.month, parts.year);
    return Array.from({ length: limit }, (_, i) => {
      const day = i + 1;
      return { value: day.toString(), label: day.toString() };
    });
  }, [parts.month, parts.year]);

  // Tracks the "day was just cleared because the month/year no longer supports it" state
  // (e.g. 31 → Februari). This is distinct from `dateOfBirthResolution` — it's feedback
  // about an edit the user just made, not a submit-time validation error, so it is shown
  // immediately rather than being gated behind isTouched/submitAttempted. It resolves as
  // soon as the user picks a day again.
  const [dayWasCleared, setDayWasCleared] = useState(false);

  // Each select edits ONLY its own part — never fills in the other two. Changing month
  // or year may CLEAR an already-picked day if it no longer exists in the new month,
  // forcing the user to re-pick explicitly rather than silently clamping to end-of-month.
  // Because the day option list is always bounds-checked against the current month/year
  // AND an out-of-range day is cleared the moment it happens, the three selects can never
  // compose an impossible calendar date — `resolveDateOfBirth`'s "invalid" status stays in
  // the union as a defensive-only fallback, not a state this UI can actually reach.
  const updatePart = (part: keyof DateOfBirthParts, rawValue: string) => {
    const parsed = parseInt(rawValue, 10);
    const nextParts: DateOfBirthParts = { ...parts, [part]: parsed };

    if (part === "day") {
      setDayWasCleared(false);
    } else if (nextParts.day !== undefined) {
      const limit = daysInMonth(nextParts.month, nextParts.year);
      if (nextParts.day > limit) {
        nextParts.day = undefined;
        setDayWasCleared(true);
      }
    }

    update?.({ dateOfBirth: nextParts });
  };

  const handleBlur = () => setIsTouched(true);

  const errorCopy = dateOfBirthErrorCopy({
    resolution: dateOfBirthResolution,
    dayWasCleared,
    showError: isTouched || !!showFieldErrors,
  });
  const hasError = !!errorCopy;

  return (
    <div
      className="flex flex-col gap-2"
      role="group"
      aria-labelledby={groupLabelId}
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
    >
      <span id={groupLabelId} className="flex items-center gap-x-1.5 text-base">
        Tanggal Lahir
        <span className="text-red-500"> *</span>
      </span>
      <div className="flex flex-row gap-2">
        <div className="flex-1">
          <SelectInput
            options={days}
            placeholder="Tanggal"
            value={parts.day?.toString()}
            onChange={(value) => updatePart("day", value)}
            onBlur={handleBlur}
            aria-label="Tanggal"
            noLabel
          />
        </div>
        <div className="flex-1">
          <SelectInput
            options={MONTHS}
            placeholder="Bulan"
            value={parts.month?.toString()}
            onChange={(value) => updatePart("month", value)}
            onBlur={handleBlur}
            aria-label="Bulan"
            noLabel
          />
        </div>
        <div className="flex-1">
          <SelectInput
            options={years}
            placeholder="Tahun"
            value={parts.year?.toString()}
            onChange={(value) => updatePart("year", value)}
            onBlur={handleBlur}
            aria-label="Tahun"
            noLabel
          />
        </div>
      </div>
      {hasError && (
        <span id={errorId} className="text-xs leading-4 font-normal text-red-500">
          {errorCopy}
        </span>
      )}
    </div>
  );
}
