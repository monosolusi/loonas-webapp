"use client";

import { Fragment } from "react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { DateRange, isRangeValid } from "@/features/accounting/presentations/helpers/report-range";

type ComparePeriodControlProps = {
  readonly compareRange: DateRange | null;
  readonly onCompareChange: (range: DateRange | null) => void;
};

export function ComparePeriodControl({ compareRange, onCompareChange }: ComparePeriodControlProps) {
  const isActive = compareRange !== null && isRangeValid(compareRange);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompareChange(null);
  };

  if (isActive && compareRange) {
    const fromLabel = compareRange.from
      ? compareRange.from.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
      : "";
    const toLabel = compareRange.to
      ? compareRange.to.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
      : "";
    const label = fromLabel && toLabel ? `${fromLabel} – ${toLabel}` : fromLabel;

    return (
      <Popover className="relative">
        <PopoverButton
          className={clsx(
            "flex h-11 flex-row items-center gap-x-2 rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
            "border-primary-300/30 bg-primary-300/5 text-primary-300",
          )}
        >
          <span className="whitespace-nowrap">{label}</span>
          <button
            type="button"
            onClick={handleClear}
            className="ml-1 rounded-md p-0.5 hover:bg-primary-300/10"
            aria-label="Hapus periode pembanding"
          >
            <XMarkIcon className="size-3.5" />
          </button>
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
            <DateRangePicker
              value={compareRange}
              onChange={(range) => onCompareChange(range)}
              disableFutureDates={false}
            />
          </PopoverPanel>
        </Transition>
      </Popover>
    );
  }

  return (
    <Popover className="relative">
      <PopoverButton
        className={clsx(
          "flex h-11 flex-row items-center gap-x-2 rounded-lg border px-3 py-2 text-sm font-medium outline-none transition-colors",
          "border-neutral-200 text-neutral-400 hover:border-neutral-300",
        )}
      >
        Bandingkan periode
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
          <DateRangePicker
            value={compareRange ?? { from: undefined, to: undefined }}
            onChange={(range) => onCompareChange(range)}
            disableFutureDates={false}
          />
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
