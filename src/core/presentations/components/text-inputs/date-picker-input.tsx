"use client";

import { useState } from "react";
import Image from "next/image";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { DayPicker } from "react-day-picker";
import { id as idLocale } from "react-day-picker/locale";
import { DateTime } from "luxon";
import clsx from "clsx";
import "react-day-picker/style.css";

type DatePickerInputProps = {
  label: string;
  value?: DateTime;
  onChange?: (value: DateTime | undefined) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

export function DatePickerInput({
  label,
  value,
  onChange,
  required,
  placeholder = "Pilih tanggal",
  disabled,
}: DatePickerInputProps) {
  const [month, setMonth] = useState(value?.toJSDate() ?? new Date());
  const displayValue = value?.setLocale("id").toFormat("dd MMM yyyy") ?? "";

  const handleSelect = (date: Date | undefined, close: () => void) => {
    if (date) {
      onChange?.(DateTime.fromJSDate(date));
      close();
    } else {
      onChange?.(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {label && (
        <span className="text-sm font-medium text-neutral-500">
          {label}
          {required && <span className="text-error-300"> *</span>}
        </span>
      )}
      <Popover className="relative">
        {({ close }) => (
          <>
            <PopoverButton
              disabled={disabled}
              className={clsx(
                "flex h-11 w-full flex-row items-center gap-x-2 rounded-lg border px-3 text-left text-sm outline-none transition-colors",
                disabled
                  ? "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-200"
                  : "border-neutral-100 text-neutral-500 hover:border-neutral-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20",
                !displayValue && "text-neutral-200",
              )}
            >
              <Image src="/assets/images/calendar-icon-neutral-400-w16-h16.svg" alt="" width={16} height={16} />
              <span>{displayValue || placeholder}</span>
            </PopoverButton>
            <PopoverPanel className="absolute left-0 z-30 mt-1 rounded-lg border border-neutral-200 bg-white p-3 shadow-lg">
              <DayPicker
                mode="single"
                locale={idLocale}
                selected={value?.toJSDate()}
                onSelect={(date) => handleSelect(date, close)}
                month={month}
                onMonthChange={setMonth}
              />
            </PopoverPanel>
          </>
        )}
      </Popover>
    </div>
  );
}
