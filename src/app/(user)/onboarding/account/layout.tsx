"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateAccountProvider } from "@/app/(user)/onboarding/account/_providers/create-account";
import { useAuth } from "@clerk/nextjs";

type AccountOnboardingLayoutProps = {
  accountType: React.ReactNode;
  personalAccount: React.ReactNode;
  businessAccount: React.ReactNode;
};

export default function AccountOnboardingLayout(props: AccountOnboardingLayoutProps) {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) router.replace("/sign-in");
  }, [authLoaded, isSignedIn]);

  return (
    <CreateAccountProvider>
      {props.accountType}
      {props.personalAccount}
      {props.businessAccount}
    </CreateAccountProvider>
  );
}
