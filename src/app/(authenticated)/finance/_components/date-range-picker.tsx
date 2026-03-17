"use client";

import { Fragment, useEffect, useState } from "react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/16/solid";
import { DayPicker, DateRange } from "react-day-picker";
import { id } from "react-day-picker/locale";
import { DateTime } from "luxon";
import clsx from "clsx";
import "react-day-picker/style.css";

type DateRangeValue = { from: Date | undefined; to: Date | undefined };

type DateRangePickerProps = {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  maxSpanDays?: number;
};

const PRESETS = [
  { label: "Bulan ini", getRange: () => ({ from: DateTime.now().startOf("month").toJSDate(), to: DateTime.now().toJSDate() }) },
  { label: "Bulan lalu", getRange: () => ({ from: DateTime.now().minus({ months: 1 }).startOf("month").toJSDate(), to: DateTime.now().minus({ months: 1 }).endOf("month").toJSDate() }) },
  { label: "30 hari terakhir", getRange: () => ({ from: DateTime.now().minus({ days: 30 }).toJSDate(), to: DateTime.now().toJSDate() }) },
  { label: "3 bulan terakhir", getRange: () => ({ from: DateTime.now().minus({ months: 3 }).toJSDate(), to: DateTime.now().toJSDate() }) },
  { label: "Tahun ini", getRange: () => ({ from: DateTime.now().startOf("year").toJSDate(), to: DateTime.now().toJSDate() }) },
];

export function DateRangePicker({ value, onChange, maxSpanDays = 365 }: DateRangePickerProps) {
  const [draft, setDraft] = useState<DateRangeValue>(value);
  const [month, setMonth] = useState(value.from ?? new Date());

  useEffect(() => {
    setDraft(value);
  }, [value.from?.getTime(), value.to?.getTime()]);

  const formatLabel = () => {
    if (!value.from) return "Pilih periode";
    const from = DateTime.fromJSDate(value.from).setLocale("id").toFormat("dd MMM yyyy");
    if (!value.to) return from;
    const to = DateTime.fromJSDate(value.to).setLocale("id").toFormat("dd MMM yyyy");
    return `${from} — ${to}`;
  };

  const formatDraftLabel = () => {
    if (!draft.from) return null;
    const from = DateTime.fromJSDate(draft.from).setLocale("id").toFormat("dd MMM yyyy");
    if (!draft.to) return from;
    const to = DateTime.fromJSDate(draft.to).setLocale("id").toFormat("dd MMM yyyy");
    return `${from} — ${to}`;
  };

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      setDraft({ from: undefined, to: undefined });
      return;
    }
    setDraft({ from: range.from, to: range.to });
  };

  const handlePreset = (preset: (typeof PRESETS)[number], close: () => void) => {
    const range = preset.getRange();
    onChange(range);
    setDraft(range);
    setMonth(range.from);
    close();
  };

  const handleApply = (close: () => void) => {
    onChange(draft);
    close();
  };

  const handleCancel = (close: () => void) => {
    setDraft(value);
    close();
  };

  const canApply = draft.from && draft.to;
  const today = new Date();

  return (
    <Popover className="relative">
      <PopoverButton
        className={clsx(
          "flex flex-row items-center gap-x-2 rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
          value.from ? "border-primary-300/30 bg-primary-300/5 text-primary-300" : "border-neutral-200 text-neutral-400 hover:border-neutral-300",
        )}
      >
        <CalendarIcon className="size-4" />
        <span className="whitespace-nowrap">{formatLabel()}</span>
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute left-0 z-30 mt-2 w-max rounded-lg border border-neutral-200 bg-white shadow-lg">
          {({ close }) => (
            <div className="flex flex-col">
              <div className="flex flex-row">
                <div className="flex w-[140px] shrink-0 flex-col gap-y-1 border-r border-neutral-100 px-3 py-4">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePreset(preset, close)}
                      className="whitespace-nowrap rounded-md px-3 py-1.5 text-left text-sm text-neutral-500 transition-colors hover:bg-primary-300/5 hover:text-primary-300"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="p-3">
                  <DayPicker
                    mode="range"
                    locale={id}
                    selected={{ from: draft.from, to: draft.to }}
                    onSelect={handleSelect}
                    month={month}
                    onMonthChange={setMonth}
                    disabled={{ after: today }}
                    numberOfMonths={2}
                    pagedNavigation
                    max={maxSpanDays}
                  />
                </div>
              </div>

              <div className="flex flex-row items-center justify-between border-t border-neutral-100 px-4 py-3">
                <span className="text-sm text-neutral-300">{formatDraftLabel() ?? "Pilih tanggal mulai dan selesai"}</span>
                <div className="flex flex-row gap-x-2">
                  <button
                    type="button"
                    onClick={() => handleCancel(close)}
                    className="rounded-lg border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={!canApply}
                    onClick={() => handleApply(close)}
                    className="rounded-lg bg-primary-300 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-300/90 disabled:opacity-50"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
