"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateAccountProvider } from "@/app/(user)/onboarding/account/_providers/create-account";
import { useOrganizationList } from "@clerk/nextjs";

type AccountOnboardingLayoutProps = {
  accountType: React.ReactNode;
  personalAccount: React.ReactNode;
};

export default function AccountOnboardingLayout(props: AccountOnboardingLayoutProps) {
  const router = useRouter();
  const { isLoaded, userMemberships } = useOrganizationList();

  useEffect(() => {
    if (!isLoaded) return;

    if (userMemberships.count > 1) router.replace("/home");
    else if (userMemberships.count === 1) {
      const accountId = userMemberships.data[0].id;
      if (!accountId) return;
      router.replace(`/onboarding/kyc-summary/${accountId}`);
    }
  }, [isLoaded, userMemberships]);

  if (!isLoaded) return null;
  return (
    <CreateAccountProvider>
      {props.accountType}
      {props.personalAccount}
    </CreateAccountProvider>
  );
}
