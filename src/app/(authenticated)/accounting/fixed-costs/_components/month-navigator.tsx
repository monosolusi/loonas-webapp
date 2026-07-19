"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { DateTime } from "luxon";
import { MonthPicker } from "@/app/(authenticated)/accounting/fixed-costs/_components/month-picker";

type MonthNavigatorProps = {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
};

export function MonthNavigator({ year, month, onChange }: MonthNavigatorProps) {
  const current = DateTime.local(year, month);
  const now = DateTime.now();
  const label = current.setLocale("id").toFormat("MMMM yyyy");
  const isCurrentMonth = year === now.year && month === now.month;

  const goBack = () => {
    const prev = current.minus({ months: 1 });
    onChange(prev.year, prev.month);
  };

  const goForward = () => {
    const next = current.plus({ months: 1 });
    onChange(next.year, next.month);
  };

  return (
    <div className="flex flex-row flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={goBack}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 text-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-500"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      <MonthPicker year={year} month={month} label={label} onChange={onChange} />
      <button
        type="button"
        onClick={goForward}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 text-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-500"
      >
        <ChevronRightIcon className="size-4" />
      </button>
      {!isCurrentMonth && (
        <button
          type="button"
          onClick={() => onChange(now.year, now.month)}
          className="flex h-11 items-center rounded-lg border border-neutral-100 px-4 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-500"
        >
          Hari Ini
        </button>
      )}
    </div>
  );
}
