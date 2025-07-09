"use client";

import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

interface TimeLeft {
  hours: number,
  minutes: number,
  seconds: number,
}

export function RemainingPaymentTime(props: { deadline: DateTime }) {
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
          seconds: Math.floor(diff.seconds ?? 0)
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
    <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 font-medium mb-1">Batas Waktu Pembayaran</p>
        <p className="text-red-700 text-2xl font-bold">
          {generateTimeLeftString(timeLeft)}
        </p>
      </div>
    </div>
  );
}