import { XCircleIcon } from "@heroicons/react/20/solid";
import React from "react";

export function ErrorCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">{children}</p>
        </div>
      </div>
    </div>
  );
}