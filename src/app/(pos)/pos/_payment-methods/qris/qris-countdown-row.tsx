"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { ClockIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { DateTime } from "luxon";
import { useCountdown } from "@/core/presentations/hooks/use-countdown";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";

type QrisCountdownRowProps = {
  expirationTime: DateTime;
  status: PayInStatus;
};

export function QrisCountdownRow({ expirationTime, status }: QrisCountdownRowProps) {
  const { remainingMs } = useCountdown(expirationTime);
  const safeRemainingMs = remainingMs ?? 0;

  const [announcement, setAnnouncement] = useState<string>("");
  const warningAnnouncedRef = useRef<boolean>(false);

  // Reset the warning announcement guard when expirationTime changes (new QR generated).
  useEffect(() => {
    warningAnnouncedRef.current = false;
    setAnnouncement("");
  }, [expirationTime]);

  const remainingSeconds = useMemo(() => Math.floor(safeRemainingMs / 1000), [safeRemainingMs]);
  const minutes = useMemo(() => Math.floor(remainingSeconds / 60), [remainingSeconds]);
  const seconds = useMemo(() => remainingSeconds % 60, [remainingSeconds]);

  const isFrozen = safeRemainingMs <= 0;
  const isWarning = !isFrozen && remainingSeconds <= 30;
  const isPendingPayment = status === PayInStatus.PENDING_PAYMENT;

  // Fire one-shot warning announcement.
  useEffect(() => {
    if (isWarning && !warningAnnouncedRef.current) {
      warningAnnouncedRef.current = true;
      setAnnouncement("Peringatan: QR akan kedaluwarsa dalam 30 detik");
    }
  }, [isWarning]);

  const formattedTime = useMemo(
    () => `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    [minutes, seconds],
  );

  const ariaLabel = useMemo(
    () =>
      isFrozen
        ? "Waktu tersisa: 0 menit 0 detik"
        : `Waktu tersisa: ${minutes} menit ${seconds} detik`,
    [isFrozen, minutes, seconds],
  );

  const showWarningStyle = isWarning || (isFrozen && isPendingPayment);

  const microLabel = useMemo(() => {
    if (isFrozen && isPendingPayment) return "Memeriksa...";
    if (isWarning) return "segera kedaluwarsa";
    return "tersisa";
  }, [isFrozen, isPendingPayment, isWarning]);

  return (
    <div className="flex flex-row items-center gap-x-2">
      {showWarningStyle ? (
        <ExclamationCircleIcon className="size-4 text-warning-400" aria-hidden="true" />
      ) : (
        <ClockIcon className="size-4 text-neutral-300" aria-hidden="true" />
      )}

      <time
        dateTime={expirationTime.toISO() ?? undefined}
        aria-label={ariaLabel}
        className={clsx(
          "tabular-nums text-2xl font-semibold",
          showWarningStyle ? "text-warning-500" : "text-neutral-400",
        )}
      >
        {formattedTime}
      </time>

      <span className={clsx("text-sm", showWarningStyle ? "text-warning-400" : "text-neutral-300")}>
        {microLabel}
      </span>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
