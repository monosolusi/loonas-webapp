"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/16/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
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
  disableFutureDates?: boolean;
};

const TZ = "Asia/Jakarta";

const PRESETS = [
  {
    label: "Bulan ini",
    getRange: () => ({
      from: DateTime.now().setZone(TZ).startOf("month").toJSDate(),
      to: DateTime.now().setZone(TZ).toJSDate(),
    }),
  },
  {
    label: "7 hari terakhir",
    getRange: () => ({
      from: DateTime.now().setZone(TZ).minus({ days: 6 }).toJSDate(),
      to: DateTime.now().setZone(TZ).toJSDate(),
    }),
  },
  {
    label: "14 hari terakhir",
    getRange: () => ({
      from: DateTime.now().setZone(TZ).minus({ days: 13 }).toJSDate(),
      to: DateTime.now().setZone(TZ).toJSDate(),
    }),
  },
  {
    label: "30 hari terakhir",
    getRange: () => ({
      from: DateTime.now().setZone(TZ).minus({ days: 29 }).toJSDate(),
      to: DateTime.now().setZone(TZ).toJSDate(),
    }),
  },
];

function formatDate(date: Date | undefined): string | null {
  if (!date) return null;
  return DateTime.fromJSDate(date).setLocale("id").toFormat("d MMM yyyy");
}

function computeSpanDays(from: Date | undefined, to: Date | undefined): number {
  if (!from || !to) return 0;
  return Math.round(
    DateTime.fromJSDate(to).diff(DateTime.fromJSDate(from), "days").days,
  ) + 1;
}

type PickerInnerProps = {
  draft: DateRangeValue;
  month: Date;
  maxSpanDays: number;
  disableFutureDates: boolean;
  onSelect: (range: DateRange | undefined) => void;
  onMonthChange: (month: Date) => void;
  onPreset: (preset: (typeof PRESETS)[number]) => void;
  onApply: () => void;
  onCancel: () => void;
};

function PickerInner({
  draft,
  month,
  maxSpanDays,
  disableFutureDates,
  onSelect,
  onMonthChange,
  onPreset,
  onApply,
  onCancel,
}: PickerInnerProps) {
  const spanDays = computeSpanDays(draft.from, draft.to);
  const spanExceeds = draft.from && draft.to && spanDays > maxSpanDays;
  const canApply = draft.from && draft.to && !spanExceeds;
  const today = new Date();

  const draftLabel = (() => {
    const from = formatDate(draft.from);
    if (!from) return null;
    const to = formatDate(draft.to);
    if (!to) return from;
    return `${from} — ${to}`;
  })();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="hidden w-[140px] shrink-0 flex-col gap-y-1 border-r border-neutral-100 px-3 py-4 sm:flex">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPreset(preset)}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-left text-sm text-neutral-500 transition-colors hover:bg-primary-300/5 hover:text-primary-300"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto p-3">
          <DayPicker
            mode="range"
            locale={id}
            selected={{ from: draft.from, to: draft.to }}
            onSelect={onSelect}
            month={month}
            onMonthChange={onMonthChange}
            disabled={disableFutureDates ? { after: today } : undefined}
            numberOfMonths={2}
            pagedNavigation
            max={maxSpanDays}
          />
        </div>
      </div>

      {spanExceeds && (
        <p className="px-4 pb-2 text-xs text-error-400">
          Rentang terlalu panjang, pilih maksimum {maxSpanDays} hari.
        </p>
      )}

      <div className="flex flex-row items-center justify-between border-t border-neutral-100 px-4 py-3">
        <span className="text-sm text-neutral-300">{draftLabel ?? "Pilih tanggal mulai dan selesai"}</span>
        <div className="flex flex-row gap-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!canApply}
            onClick={onApply}
            className="rounded-lg bg-primary-300 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-300/90 disabled:opacity-50"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}

export function DateRangePicker({ value, onChange, maxSpanDays = 365, disableFutureDates = false }: DateRangePickerProps) {
  const [draft, setDraft] = useState<DateRangeValue>(value);
  const [month, setMonth] = useState(value.from ?? new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    setIsMobile(mq.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    setDraft(value);
  }, [value.from?.getTime(), value.to?.getTime()]);

  const resolveLabel = () => {
    if (!value.from || !value.to) return "Pilih periode";
    const fromDt = DateTime.fromJSDate(value.from).setZone(TZ);
    const toDt = DateTime.fromJSDate(value.to).setZone(TZ);
    const matchedPreset = PRESETS.find((preset) => {
      const range = preset.getRange();
      const presetFrom = DateTime.fromJSDate(range.from).setZone(TZ);
      const presetTo = DateTime.fromJSDate(range.to).setZone(TZ);
      return fromDt.toISODate() === presetFrom.toISODate() && toDt.toISODate() === presetTo.toISODate();
    });
    if (matchedPreset) return matchedPreset.label;
    const from = formatDate(value.from);
    if (!from) return "Pilih periode";
    const to = formatDate(value.to);
    if (!to) return from;
    return `${from} — ${to}`;
  };

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      setDraft({ from: undefined, to: undefined });
      return;
    }
    setDraft({ from: range.from, to: range.to });
  };

  const handlePreset = (preset: (typeof PRESETS)[number]) => {
    const range = preset.getRange();
    onChange(range);
    setDraft(range);
    setMonth(range.from);
    setDialogOpen(false);
  };

  const handleApply = (close?: () => void) => {
    onChange(draft);
    if (close) close();
    else setDialogOpen(false);
  };

  const handleCancel = (close?: () => void) => {
    setDraft(value);
    if (close) close();
    else setDialogOpen(false);
  };

  const triggerClasses = clsx(
    "flex h-11 flex-row items-center gap-x-2 rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
    value.from
      ? "border-primary-300/30 bg-primary-300/5 text-primary-300"
      : "border-neutral-200 text-neutral-400 hover:border-neutral-300",
  );

  if (isMobile) {
    return (
      <>
        <button type="button" onClick={() => setDialogOpen(true)} className={triggerClasses}>
          <CalendarIcon className="size-4 shrink-0" />
          <span className="whitespace-nowrap">{resolveLabel()}</span>
        </button>

        <Dialog open={dialogOpen} onClose={() => handleCancel()} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-neutral-500/50 transition-opacity data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in" transition />
          <div className="fixed inset-x-0 bottom-0 z-50">
            <DialogPanel
              className="w-full overflow-hidden rounded-t-2xl bg-white shadow-xl transition-all data-closed:translate-y-full data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
              transition
            >
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <span className="text-sm font-semibold text-neutral-400">Pilih periode</span>
                <button
                  type="button"
                  onClick={() => handleCancel()}
                  className="rounded-md p-1 text-neutral-300 hover:bg-neutral-50"
                  aria-label="Tutup pemilih tanggal"
                >
                  <XMarkIcon className="size-5" />
                </button>
              </div>
              <PickerInner
                draft={draft}
                month={month}
                maxSpanDays={maxSpanDays}
                disableFutureDates={disableFutureDates}
                onSelect={handleSelect}
                onMonthChange={setMonth}
                onPreset={handlePreset}
                onApply={() => handleApply()}
                onCancel={() => handleCancel()}
              />
            </DialogPanel>
          </div>
        </Dialog>
      </>
    );
  }

  return (
    <Popover className="relative">
      <PopoverButton className={triggerClasses}>
        <CalendarIcon className="size-4 shrink-0" />
        <span className="whitespace-nowrap">{resolveLabel()}</span>
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
            <PickerInner
              draft={draft}
              month={month}
              maxSpanDays={maxSpanDays}
              disableFutureDates={disableFutureDates}
              onSelect={handleSelect}
              onMonthChange={setMonth}
              onPreset={(preset) => {
                const range = preset.getRange();
                onChange(range);
                setDraft(range);
                setMonth(range.from);
                close();
              }}
              onApply={() => handleApply(close)}
              onCancel={() => handleCancel(close)}
            />
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
