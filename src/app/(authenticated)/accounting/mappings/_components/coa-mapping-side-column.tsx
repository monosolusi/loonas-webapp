"use client";

import clsx from "clsx";
import { CoaMappingLineEntity } from "@/features/accounting/domain/entities/coa-mapping-line";
import { CoaMappingLineDisplay } from "@/app/(authenticated)/accounting/mappings/_components/coa-mapping-line-display";

type CoaMappingSideColumnProps = {
  lines: CoaMappingLineEntity[];
  accent: "debit" | "credit";
};

export function CoaMappingSideColumn({ lines, accent }: CoaMappingSideColumnProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-y-3 border-l-2 pl-4",
        accent === "debit" ? "border-primary-200" : "border-warning-200",
      )}
    >
      {lines.length > 0 ? (
        lines.map((line) => <CoaMappingLineDisplay key={line.id} line={line} />)
      ) : (
        <span className="text-sm text-neutral-200 italic">—</span>
      )}
    </div>
  );
}
