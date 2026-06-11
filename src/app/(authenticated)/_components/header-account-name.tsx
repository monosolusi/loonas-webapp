"use client";

import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { useMemo } from "react";

export function HeaderAccountName() {
  const { account, loading, error } = useGetCurrentAccount();

  const accountName = useMemo(() => {
    if (loading || error) return "";
    else return account.fullName;
  }, [account, loading, error]);

  return <div className="text-right leading-5 font-bold">{accountName}</div>;
}
