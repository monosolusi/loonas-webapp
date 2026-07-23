"use client";

import { CoaMappingLineEntity } from "@/features/accounting/domain/entities/coa-mapping-line";

type CoaMappingLineDisplayProps = {
  line: CoaMappingLineEntity;
};

export function CoaMappingLineDisplay({ line }: CoaMappingLineDisplayProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-x-2">
        <span className="text-primary-500 font-mono text-sm font-semibold tracking-tight">{line.account.code}</span>
        <span className="truncate text-sm text-neutral-400">{line.account.name}</span>
      </div>
      {line.label && <span className="text-xs text-neutral-300 italic">{line.label}</span>}
    </div>
  );
}
