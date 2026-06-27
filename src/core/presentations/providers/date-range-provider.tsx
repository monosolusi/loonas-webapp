"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateTime } from "luxon";

const TZ = "Asia/Jakarta";
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type DateRange = {
  from: string;
  to: string;
};

type DateRangeContextValue = {
  from: string;
  to: string;
  setRange: (next: DateRange) => void;
  isRangeInvalid: boolean;
};

const DateRangeContext = createContext<DateRangeContextValue | null>(null);

export function useDateRange(): DateRangeContextValue {
  const context = useContext(DateRangeContext);
  if (!context) throw new Error("useDateRange must be used within DateRangeProvider");
  return context;
}

function resolveDefaultRange(today: DateTime): DateRange {
  return {
    from: today.startOf("month").toFormat("yyyy-MM-dd"),
    to: today.toFormat("yyyy-MM-dd"),
  };
}

function isValidIsoDate(s: string): boolean {
  if (!ISO_DATE_RE.test(s)) return false;
  return DateTime.fromISO(s, { zone: TZ }).isValid;
}

function validateRange(range: DateRange, maxSpanDays: number): boolean {
  if (!isValidIsoDate(range.from) || !isValidIsoDate(range.to)) return false;
  const from = DateTime.fromISO(range.from, { zone: TZ });
  const to = DateTime.fromISO(range.to, { zone: TZ });
  if (from > to) return false;
  const spanDays = Math.round(to.diff(from, "days").days) + 1;
  return spanDays <= maxSpanDays;
}

function parseStorageValue(raw: string | null, maxSpanDays: number): DateRange | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.from === "string" && typeof parsed.to === "string") {
      const range: DateRange = { from: parsed.from, to: parsed.to };
      if (validateRange(range, maxSpanDays)) return range;
    }
  } catch {
    // ignore
  }
  return null;
}

function writeToLocalStorage(key: string, range: DateRange) {
  try {
    localStorage.setItem(key, JSON.stringify(range));
  } catch {
    // ignore
  }
}

type DateRangeProviderProps = {
  children: React.ReactNode;
  localStorageKey: string;
  maxSpanDays: number;
};

export function DateRangeProvider({ children, localStorageKey, maxSpanDays }: DateRangeProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const resolveInitialRange = useCallback((): DateRange => {
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    if (urlFrom && urlTo) {
      const candidate: DateRange = { from: urlFrom, to: urlTo };
      if (validateRange(candidate, maxSpanDays)) return candidate;
    }

    const stored = parseStorageValue(localStorage.getItem(localStorageKey), maxSpanDays);
    if (stored) return stored;

    return resolveDefaultRange(DateTime.now().setZone(TZ));
  }, [searchParams, localStorageKey, maxSpanDays]);

  const [range, setRangeState] = useState<DateRange>(resolveInitialRange);

  const setRange = useCallback(
    (next: DateRange) => {
      if (!validateRange(next, maxSpanDays)) return;
      setRangeState(next);
      writeToLocalStorage(localStorageKey, next);

      const params = new URLSearchParams(searchParams.toString());
      params.set("from", next.from);
      params.set("to", next.to);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, localStorageKey, maxSpanDays],
  );

  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    if (!urlFrom || !urlTo) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("from", range.from);
      params.set("to", range.to);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, []);

  const isRangeInvalid = useMemo(() => !validateRange(range, maxSpanDays), [range, maxSpanDays]);

  const contextValue = useMemo<DateRangeContextValue>(
    () => ({ from: range.from, to: range.to, setRange, isRangeInvalid }),
    [range.from, range.to, setRange, isRangeInvalid],
  );

  return <DateRangeContext.Provider value={contextValue}>{children}</DateRangeContext.Provider>;
}
