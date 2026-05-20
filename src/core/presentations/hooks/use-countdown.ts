"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";

type CountdownResult = {
  remainingMs: number | null;
  isExpired: boolean;
};

export function useCountdown(expirationTime: DateTime | null): CountdownResult {
  const [remainingMs, setRemainingMs] = useState<number | null>(() => {
    if (!expirationTime) return null;
    return Math.max(0, expirationTime.diff(DateTime.now()).milliseconds);
  });

  useEffect(() => {
    if (!expirationTime) {
      setRemainingMs(null);
      return;
    }

    const compute = () => Math.max(0, expirationTime.diff(DateTime.now()).milliseconds);
    setRemainingMs(compute());

    const id = setInterval(() => {
      const ms = compute();
      setRemainingMs(ms);
      if (ms <= 0) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [expirationTime]);

  const isExpired = remainingMs !== null && remainingMs <= 0;

  return { remainingMs, isExpired };
}
