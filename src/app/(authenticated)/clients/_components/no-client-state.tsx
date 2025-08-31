import { Card } from "@/core/presentations/components/card";
import React from "react";

export function NoClientState() {
  return (
    <Card>
      <div className="flex flex-col items-center space-y-2 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="mx-auto size-12 text-red-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <div className="flex w-1/2 flex-col space-y-1">
          <h3 className="text-sm font-semibold text-gray-900">Belum Ada Klien</h3>
          <p className="text-sm text-gray-500">Kamu belum punya klien nih, yuk tambahkan klien baru untuk mulai!</p>
        </div>
      </div>
    </Card>
  );
}
