"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateTime } from "luxon";

const TZ = "Asia/Jakarta";
const LOCAL_STORAGE_KEY = "lns_dashboard_range";
const LOCAL_STORAGE_KEY_LEGACY = "lns_festival_date_range";

type DateRange = {
  from: string;
  to: string;
};

type DashboardRangeContextValue = {
  from: string;
  to: string;
  setRange: (next: DateRange) => void;
  isRangeInvalid: boolean;
};

const DashboardRangeContext = createContext<DashboardRangeContextValue | null>(null);

export function useDashboardRange(): DashboardRangeContextValue {
  const context = useContext(DashboardRangeContext);
  if (!context) throw new Error("useDashboardRange must be used within DashboardRangeProvider");
  return context;
}

function resolveDefaultRange(today: DateTime): DateRange {
  const rangeStart = DateTime.fromISO("2026-06-02", { zone: TZ });
  const rangeEnd = DateTime.fromISO("2026-06-04", { zone: TZ });
  if (today >= rangeStart && today <= rangeEnd) {
    return { from: "2026-06-02", to: "2026-06-04" };
  }
  return {
    from: today.minus({ days: 6 }).toFormat("yyyy-MM-dd"),
    to: today.toFormat("yyyy-MM-dd"),
  };
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(s: string): boolean {
  if (!ISO_DATE_RE.test(s)) return false;
  return DateTime.fromISO(s, { zone: TZ }).isValid;
}

function validateRange(range: DateRange): boolean {
  if (!isValidIsoDate(range.from) || !isValidIsoDate(range.to)) return false;
  const from = DateTime.fromISO(range.from, { zone: TZ });
  const to = DateTime.fromISO(range.to, { zone: TZ });
  if (from > to) return false;
  const spanDays = to.diff(from, "days").days + 1;
  if (spanDays > 31) return false;
  return true;
}

function parseStorageValue(raw: string | null): DateRange | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.from === "string" && typeof parsed.to === "string") {
      const range: DateRange = { from: parsed.from, to: parsed.to };
      if (validateRange(range)) return range;
    }
  } catch {
    // ignore
  }
  return null;
}

function writeToLocalStorage(range: DateRange) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(range));
  } catch {
    // ignore
  }
}

type DashboardRangeProviderProps = {
  children: React.ReactNode;
};

export function DashboardRangeProvider({ children }: DashboardRangeProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const resolveInitialRange = useCallback((): DateRange => {
    // 1. URL search params
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    if (urlFrom && urlTo) {
      const candidate: DateRange = { from: urlFrom, to: urlTo };
      if (validateRange(candidate)) return candidate;
    }

    // 2. New localStorage key
    const newStored = parseStorageValue(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (newStored) return newStored;

    // 3. Legacy key migration (lns_festival_date_range → lns_dashboard_range)
    try {
      const legacy = parseStorageValue(localStorage.getItem(LOCAL_STORAGE_KEY_LEGACY));
      if (legacy) {
        writeToLocalStorage(legacy);
        localStorage.removeItem(LOCAL_STORAGE_KEY_LEGACY);
        return legacy;
      }
    } catch {
      // ignore
    }

    // 4. Default
    return resolveDefaultRange(DateTime.now().setZone(TZ));
  }, [searchParams]);

  const [range, setRangeState] = useState<DateRange>(resolveInitialRange);

  const setRange = useCallback(
    (next: DateRange) => {
      if (!validateRange(next)) return;
      setRangeState(next);
      writeToLocalStorage(next);

      const params = new URLSearchParams(searchParams.toString());
      params.set("from", next.from);
      params.set("to", next.to);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Sync URL on mount if URL is empty but we have a range from storage/default.
  // useRef guard makes the intent explicit and avoids stale-closure lint complaints.
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

  const isRangeInvalid = !validateRange(range);

  const contextValue = useMemo<DashboardRangeContextValue>(
    () => ({ from: range.from, to: range.to, setRange, isRangeInvalid }),
    [range.from, range.to, setRange, isRangeInvalid],
  );

  return <DashboardRangeContext.Provider value={contextValue}>{children}</DashboardRangeContext.Provider>;
}
