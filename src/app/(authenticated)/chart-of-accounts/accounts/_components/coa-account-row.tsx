"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";
import { useCoaAccounts } from "@/app/(authenticated)/chart-of-accounts/accounts/_providers/coa-accounts-provider";

const ROW_GRID = "grid-cols-[100px_1fr_160px_160px_80px_48px]";

type CoaAccountRowProps = {
  account: LedgerAccountEntity;
  parentName: string | undefined;
};

export function CoaAccountRow({ account, parentName }: CoaAccountRowProps) {
  const { setEditingItem, setDeletingItem } = useCoaAccounts();

  const menuOptions = useMemo<ActionMenuOption[]>(() => {
    const options: ActionMenuOption[] = [{ label: "Ubah", onClick: () => setEditingItem(account) }];
    if (!account.isSystem) {
      options.push({ label: "Hapus", onClick: () => setDeletingItem(account), variant: "danger" });
    }
    return options;
  }, [account, setEditingItem, setDeletingItem]);

  return (
    <div
      className={clsx(
        "grid",
        ROW_GRID,
        "items-center gap-x-4 border-b border-neutral-100 px-6 py-3.5 transition-colors last:border-b-0 hover:bg-neutral-50/40",
      )}
    >
      <span className="font-mono text-sm font-semibold text-primary-500">{account.code}</span>
      <span className="truncate text-sm text-neutral-500">{account.name}</span>
      <span className="text-sm text-neutral-400">{ACCOUNT_TYPE_LABELS[account.type]}</span>
      <span className={clsx("text-sm", parentName ? "text-neutral-400" : "text-neutral-200 italic")}>
        {parentName ?? "—"}
      </span>
      <div>
        {account.isSystem && <StatusChip label="Bawaan" variant="neutral" compact />}
      </div>
      <div className="flex justify-end">
        <ActionMenu
          options={menuOptions}
        />
      </div>
    </div>
  );
}
