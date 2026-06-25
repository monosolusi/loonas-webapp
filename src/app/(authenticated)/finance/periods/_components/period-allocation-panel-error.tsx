"use client";

import { ServerError } from "@/core/resources/server-error";

type PeriodAllocationPanelErrorProps = {
  error: ServerError;
};

export function PeriodAllocationPanelError({ error }: PeriodAllocationPanelErrorProps) {
  return (
    <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-4">
      <p className="text-sm text-error-500">{error.message}</p>
    </div>
  );
}
