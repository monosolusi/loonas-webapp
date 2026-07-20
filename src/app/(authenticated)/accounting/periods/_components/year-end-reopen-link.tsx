"use client";

import { usePeriods } from "@/app/(authenticated)/accounting/periods/_providers/periods-provider";

export function YearEndReopenLink() {
  const { openReopenYearDialog } = usePeriods();

  return (
    <button
      type="button"
      onClick={openReopenYearDialog}
      className="w-fit text-sm text-primary-500 hover:underline"
    >
      Buka kembali →
    </button>
  );
}
