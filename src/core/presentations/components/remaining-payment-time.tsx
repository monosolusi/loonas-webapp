"use client";

import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface RemainingPaymentTimeProps {
  deadline: DateTime;
}

export function RemainingPaymentTime(props: RemainingPaymentTimeProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = DateTime.now();
      const diff = props.deadline.diff(now, ["hours", "minutes", "seconds"]).toObject();

      if (props.deadline < now) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          hours: Math.floor(diff.hours ?? 0),
          minutes: Math.floor(diff.minutes ?? 0),
          seconds: Math.floor(diff.seconds ?? 0),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [props.deadline]);

  const generateTimeLeftString = (timeLeft: TimeLeft) => {
    const hours = String(timeLeft.hours).padStart(2, "0");
    const minutes = String(timeLeft.minutes).padStart(2, "0");
    const seconds = String(timeLeft.seconds).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center justify-center rounded-lg border border-red-100 bg-red-50 p-4">
      <div className="text-center">
        <p className="mb-1 font-medium text-red-600">Batas Waktu Pembayaran</p>
        <p className="text-2xl font-bold text-red-700">{generateTimeLeftString(timeLeft)}</p>
      </div>
    </div>
  );
}
