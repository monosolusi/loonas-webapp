"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { SelectInput } from "@/core/presentations/components/select-input";
import {
  usePersonalAccountData
} from "@/app/(user)/onboarding/account/@personalAccount/_providers/use-create-personal-account-data";

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

const MIN_YEAR = 1900;
const MAX_YEAR = DateTime.now().year;

export function DateOfBirthInput() {
  const { data, update } = usePersonalAccountData();

  const currentDate = data.dateOfBirth;
  const selectedDay = currentDate?.day?.toString();
  const selectedMonth = currentDate?.month?.toString();
  const selectedYear = currentDate?.year?.toString();

  const years = useMemo(() => {
    return Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => {
      const year = MAX_YEAR - i;
      return { value: year.toString(), label: year.toString() };
    });
  }, []);

  const days = useMemo(() => {
    const daysInMonth =
      selectedYear && selectedMonth
        ? (DateTime.local(parseInt(selectedYear), parseInt(selectedMonth)).daysInMonth ?? 31)
        : 31;

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return { value: day.toString(), label: day.toString() };
    });
  }, [selectedYear, selectedMonth]);

  const updateDate = (field: "day" | "month" | "year", value: string) => {
    const day = field === "day" ? parseInt(value) : (currentDate?.day ?? 1);
    const month = field === "month" ? parseInt(value) : (currentDate?.month ?? 1);
    const year = field === "year" ? parseInt(value) : (currentDate?.year ?? MAX_YEAR);

    const newDate = DateTime.local(year, month, day);

    if (newDate.isValid) {
      update?.({ dateOfBirth: newDate });
    } else {
      const correctedDate = DateTime.local(year, month, 1).endOf("month").startOf("day");
      update?.({ dateOfBirth: correctedDate });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-base">Tanggal Lahir</span>
      <div className="flex flex-row gap-2">
        <div className="flex-1">
          <SelectInput
            options={days}
            placeholder="Tanggal"
            value={selectedDay}
            onChange={(value) => updateDate("day", value)}
            noLabel
          />
        </div>
        <div className="flex-1">
          <SelectInput
            options={MONTHS}
            placeholder="Bulan"
            value={selectedMonth}
            onChange={(value) => updateDate("month", value)}
            noLabel
          />
        </div>
        <div className="flex-1">
          <SelectInput
            options={years}
            placeholder="Tahun"
            value={selectedYear}
            onChange={(value) => updateDate("year", value)}
            noLabel
          />
        </div>
      </div>
    </div>
  );
}
