"use client";

import { AccountAvatar } from "@/app/(authenticated)/_components/account-avatar";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function HeaderAvatar() {
  const { account } = useGetCurrentAccount();

  return <AccountAvatar type={account?.type ?? AccountType.PERSONAL} size={10} name={account?.fullName} />;
}
