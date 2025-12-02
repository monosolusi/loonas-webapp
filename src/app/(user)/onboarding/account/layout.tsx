"use client";

import React, { useEffect } from "react";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";
import { useRouter } from "next/navigation";
import { CreateAccountProvider } from "@/app/(user)/onboarding/account/_providers/create-account";

type AccountOnboardingLayoutProps = {
  accountType: React.ReactNode;
  personalAccount: React.ReactNode;
};

export default function AccountOnboardingLayout(props: AccountOnboardingLayoutProps) {
  const router = useRouter();
  const { accounts, loading } = useListAccount();

  useEffect(() => {
    if (loading || !accounts) return;

    // If the user already has more than 1 account, we will redirect to somewhere
    if (accounts.length > 1) return router.replace("/home");
    else if (accounts.length === 1) {
      const accountId = accounts[0].id;
      return router.replace(`/onboarding/${accountId}/result`);
    }
  }, [accounts, loading]);

  return (
    <CreateAccountProvider>
      {props.accountType}
      {props.personalAccount}
    </CreateAccountProvider>
  );
}
