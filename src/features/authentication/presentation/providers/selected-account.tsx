"use client";

import { createContext, useContext, useEffect } from "react";
import {
  SelectedAccountContextProps,
  SelectedAccountProviderProps,
} from "@/features/authentication/presentation/providers/selected-account.types";
import { usePathname, useRouter } from "next/navigation";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { resolveAccountRedirect } from "@/features/authentication/presentation/helpers/resolve-account-redirect";

const SelectedAccountContext = createContext<SelectedAccountContextProps>({});

/**
 * @deprecated This provider no longer manages account selection. The redirect logic it contains
 * should be migrated elsewhere. Use `useGetCurrentAccount()` from
 * `@/features/account/presentation/hooks/use-get-current-account` for account data instead.
 */
export function SelectedAccountProvider(props: SelectedAccountProviderProps) {
  const { accounts, error: listError, loading: listLoading } = useListAccount();
  const { account, error: currentAccountError, loading: currentAccountLoading } = useGetCurrentAccount();
  const { verificationWork } = useGetAccountVerificationWork({ enabled: account?.id ?? null });
  const router = useRouter();
  const pathname = usePathname();

  const isCurrentAccountNotFound =
    !currentAccountLoading &&
    currentAccountError instanceof ServerError &&
    currentAccountError.code === ErrorCodes.NOT_FOUND.code;

  /**
   * Sends the user to whichever step their account state requires: account creation (no
   * memberships at all), the accounts list (a stale/non-existent current account), or the KYC
   * summary (verification awaiting or rejected) — resolved by a single pure helper so the
   * precedence between those rules lives in one place instead of three independent effects.
   *
   * Uses `router.replace` rather than `router.push`: a `push`-based redirect stacks a history
   * entry, so the browser Back button would walk the user straight back into whatever state
   * triggered it.
   */
  useEffect(() => {
    const redirect = resolveAccountRedirect({
      pathname,
      accountsReady: !listLoading && !listError,
      accountCount: accounts?.length ?? 0,
      isCurrentAccountNotFound,
      verification: verificationWork
        ? {
            isAwaitingVerification: verificationWork.isAwaitingVerification,
            isRejected: verificationWork.isRejected,
          }
        : null,
    });

    if (redirect) router.replace(redirect);
  }, [pathname, accounts, listLoading, listError, isCurrentAccountNotFound, verificationWork, router]);

  return <SelectedAccountContext value={{}}>{props.children}</SelectedAccountContext>;
}

/**
 * @deprecated Use `useGetCurrentAccount()` from `@/features/account/presentation/hooks/use-get-current-account` instead.
 */
export function useSelectedAccountProvider() {
  return useContext(SelectedAccountContext);
}
