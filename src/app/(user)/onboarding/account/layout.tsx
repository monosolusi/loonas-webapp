"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateAccountProvider } from "@/app/(user)/onboarding/account/_providers/create-account";
import { useAuth, useOrganizationList } from "@clerk/nextjs";

type AccountOnboardingLayoutProps = {
  accountType: React.ReactNode;
  personalAccount: React.ReactNode;
  businessAccount: React.ReactNode;
};

export default function AccountOnboardingLayout(props: AccountOnboardingLayoutProps) {
  const router = useRouter();
  const { isLoaded, userMemberships } = useOrganizationList();
  const { isLoaded: authLoaded, isSignedIn, signOut } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (userMemberships.count > 1) router.replace("/home");
    else if (userMemberships.count === 1) {
      const accountId = userMemberships.data[0].id;
      if (!accountId) return;
      router.replace(`/onboarding/kyc-summary/${accountId}`);
    }
  }, [isLoaded, userMemberships]);

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) router.replace("/sign-in");
  }, [authLoaded, isSignedIn]);

  if (!isLoaded) return null;
  return (
    <CreateAccountProvider>
      {props.accountType}
      {props.personalAccount}
      {props.businessAccount}
    </CreateAccountProvider>
  );
}
