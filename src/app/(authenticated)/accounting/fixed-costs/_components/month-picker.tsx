"use client";

import { useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { DateTime } from "luxon";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

type MonthPickerProps = {
  year: number;
  month: number;
  label: string;
  onChange: (year: number, month: number) => void;
};

export function MonthPicker({ year, month, label, onChange }: MonthPickerProps) {
  const now = DateTime.now();
  const [pickerYear, setPickerYear] = useState(year);

  return (
    <Popover className="relative">
      <PopoverButton
        className="flex h-11 min-w-[160px] cursor-pointer items-center justify-center rounded-lg border border-neutral-100 px-4 text-sm font-semibold capitalize text-neutral-500 transition-colors hover:bg-neutral-50"
        onClick={() => setPickerYear(year)}
      >
        {label}
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="z-10 mt-2 w-[260px] rounded-lg border border-neutral-100 bg-white p-4 shadow-lg"
      >
        {({ close }) => (
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-row items-center justify-between">
              <button
                type="button"
                onClick={() => setPickerYear((y) => y - 1)}
                className="flex size-7 items-center justify-center rounded-md text-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-500"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <span className="text-sm font-semibold text-neutral-500">{pickerYear}</span>
              <button
                type="button"
                onClick={() => setPickerYear((y) => y + 1)}
                className="flex size-7 items-center justify-center rounded-md text-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-500"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {MONTH_LABELS.map((monthLabel, index) => {
                const m = index + 1;
                const isSelected = pickerYear === year && m === month;
                const isCurrent = pickerYear === now.year && m === now.month;

                return (
                  <button
                    key={monthLabel}
                    type="button"
                    onClick={() => {
                      onChange(pickerYear, m);
                      close();
                    }}
                    className={clsx(
                      "rounded-md px-2 py-2 text-sm transition-colors",
                      isSelected
                        ? "bg-primary-300 font-semibold text-white"
                        : isCurrent
                          ? "font-medium text-primary-300 hover:bg-primary-50"
                          : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-500",
                    )}
                  >
                    {monthLabel}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                onChange(now.year, now.month);
                close();
              }}
              className="w-full rounded-md border border-neutral-100 py-1.5 text-center text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-500"
            >
              Hari Ini
            </button>
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
}
