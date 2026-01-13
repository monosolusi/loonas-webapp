"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateAccountProvider } from "@/app/(user)/onboarding/account/_providers/create-account";
import { useAuth } from "@clerk/nextjs";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";

type AccountOnboardingLayoutProps = {
  accountType: React.ReactNode;
  personalAccount: React.ReactNode;
  businessAccount: React.ReactNode;
};

export default function AccountOnboardingLayout(props: AccountOnboardingLayoutProps) {
  const router = useRouter();
  const { accounts, loading, error } = useListAccount();
  const { isLoaded: authLoaded, isSignedIn, signOut } = useAuth();

  useEffect(() => {
    if (loading || error) return;
    if (accounts.length > 1) router.replace("/home");
    else if (accounts.length === 1) router.replace(`/onboarding/kyc-summary`);
  }, [error, loading, accounts]);

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) router.replace("/sign-in");
  }, [authLoaded, isSignedIn]);

  if (loading) return null;
  return (
    <CreateAccountProvider>
      {props.accountType}
      {props.personalAccount}
      {props.businessAccount}
    </CreateAccountProvider>
  );
}
