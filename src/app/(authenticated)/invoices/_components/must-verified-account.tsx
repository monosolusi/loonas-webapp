"use client";

import { useEffect } from "react";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useRouter } from "next/navigation";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";

export function MustVerifiedAccount(props: { children: React.ReactNode }) {
  const router = useRouter();
  const { selectedAccount } = useSelectedAccountProvider();
  const { verificationWork, loading, error } = useGetAccountVerificationWork({ accountId: selectedAccount?.id });
  
  useEffect(() => {
    if (!verificationWork) return;
    if (verificationWork.latestStatus !== VerificationStatus.COMPLETED) {
      router.replace(`/invoices/account-not-verified`);
    }
  }, [verificationWork]);

  useEffect(() => {
    if (!error) return;
    if (error instanceof ServerError) {
      if (error.code === ErrorCodes.ACCOUNT_NOT_VERIFIED.code) {
        router.replace(`/invoices/account-not-verified`);
      } else if (error.code === ErrorCodes.NOT_FOUND.code) router.replace("invoices/no-account");
    } else throw error;
  }, [error]);

  if (!verificationWork || loading) return null;
  if (verificationWork.latestStatus !== VerificationStatus.COMPLETED) return null;
  return <>{props.children}</>;
}
