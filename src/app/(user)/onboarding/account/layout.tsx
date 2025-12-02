"use client";

import React, { useEffect, useMemo } from "react";
import { FullscreenLoadingOverlay } from "@/core/presentations/components/full-screen-loading-overlay";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";
import { useRouter } from "next/navigation";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { CreateAccountProvider } from "@/app/(user)/onboarding/account/_providers/create-account";

type AccountOnboardingLayoutProps = {
  accountType: React.ReactNode;
  personalAccount: React.ReactNode;
};

export default function AccountOnboardingLayout(props: AccountOnboardingLayoutProps) {
  const router = useRouter();
  const { accounts, loading, error } = useListAccount();

  useEffect(() => {
    if (loading || !accounts) return;

    // If the user already has more than 1 account, we will redirect to somewhere
    if (accounts.length > 1) return router.replace("/home");
    else if (accounts.length === 1) {
      const accountId = accounts[0].id;
      return router.replace(`/onboarding/${accountId}/result`);
    }
  }, [accounts, loading]);

  const isOverlayVisible = useMemo(() => {
    if (loading) return true;
    if (error instanceof ServerError && error.code === ErrorCodes.NOT_FOUND.code) return false;
    else return true;
  }, [loading, error]);

  return (
    <>
      <FullscreenLoadingOverlay isVisible={isOverlayVisible} />
      <CreateAccountProvider>
        {props.accountType}
        {props.personalAccount}
      </CreateAccountProvider>
    </>
  );
}
