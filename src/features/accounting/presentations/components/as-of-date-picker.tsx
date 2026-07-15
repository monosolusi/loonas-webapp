"use client";

import { Fragment } from "react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/16/solid";
import { DayPicker } from "react-day-picker";
import { id } from "react-day-picker/locale";
import { DateTime } from "luxon";
import clsx from "clsx";
import "react-day-picker/style.css";

type AsOfDatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
};

export function AsOfDatePicker({ value, onChange }: AsOfDatePickerProps) {
  const today = new Date();

  const formatLabel = (): string => {
    if (!value) return "Pilih tanggal";
    return `Per ${DateTime.fromJSDate(value).setLocale("id").toFormat("dd MMM yyyy")}`;
  };

  const isActive = !!value;

  return (
    <Popover className="relative">
      <PopoverButton
        className={clsx(
          "flex h-11 flex-row items-center gap-x-2 rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
          isActive
            ? "border-primary-300/30 bg-primary-300/5 text-primary-300"
            : "border-neutral-200 text-neutral-400 hover:border-neutral-300",
        )}
      >
        <CalendarIcon className="size-4" aria-hidden="true" />
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
        <PopoverPanel
          anchor={{ to: "bottom end", gap: 8 }}
          className="z-30 w-max rounded-lg border border-neutral-200 bg-white shadow-lg"
        >
          {({ close }) => (
            <div className="p-3">
              <DayPicker
                mode="single"
                locale={id}
                selected={value}
                onSelect={(date) => {
                  onChange(date);
                  close();
                }}
                disabled={{ after: today }}
              />
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
