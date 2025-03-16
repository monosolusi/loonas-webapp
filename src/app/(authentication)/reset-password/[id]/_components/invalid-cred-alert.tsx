"use client";

import { XCircleIcon } from "@heroicons/react/20/solid";

export function InvalidCredAlert({ show, error }: { show: boolean, error?: Error }) {
  if (!show) return <></>;
  return (
    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">
              {error?.message || "Ops! Terjadi kesalahan."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}