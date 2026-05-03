"use client";

import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";

function resolveAccountName(account: ReturnType<typeof useGetCurrentAccount>["account"]): string {
  if (!account) return "";
  if (account instanceof BusinessAccountEntity) return account.company.name;
  if ("fullName" in account && typeof account.fullName === "string") return account.fullName;
  return "";
}

export function PosTopBarBrand() {
  const { account } = useGetCurrentAccount();
  const accountName = resolveAccountName(account);

  return (
    <div className="flex flex-row items-baseline gap-x-3">
      <span className="text-base leading-6 font-semibold text-primary-300">Loonas POS</span>
      {accountName && (
        <>
          <span className="text-neutral-200">·</span>
          <span className="text-sm leading-5 text-neutral-400">{accountName}</span>
        </>
      )}
    </div>
  );
}
