"use client";

import { LockClosedIcon } from "@heroicons/react/20/solid";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import clsx from "clsx";

type CoaMappingRowProps = {
  mapping: CoaMappingEntity;
};

function formatAccount(account: { code: string; name: string }): string {
  return `${account.code} ${account.name}`;
}

export function CoaMappingRow({ mapping }: CoaMappingRowProps) {
  return (
    <div
      className={clsx(
        "grid grid-cols-3 items-center border-b border-neutral-100 px-6 py-4 last:border-b-0",
        mapping.isSystem && "bg-background",
      )}
    >
      <div className="flex items-center gap-x-2">
        {mapping.isSystem && <LockClosedIcon className="size-4 shrink-0 text-neutral-200" />}
        <span className="text-sm font-medium text-neutral-500">
          {mapping.entityId ? mapping.entityId : "Default"}
        </span>
      </div>

      <span className="truncate text-sm text-neutral-500">{formatAccount(mapping.debitAccount)}</span>

      <span className="truncate text-sm text-neutral-500">{formatAccount(mapping.creditAccount)}</span>
    </div>
  );
}
