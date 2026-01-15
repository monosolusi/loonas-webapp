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
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

// const SelectedAccountContext = createContext<SelectedAccountContextProps>({
//   states: [true],
// });

// export function SelectedAccountProvider(props: SelectedAccountProviderProps) {
//   const [rejectedDialog, setRejectedDialog] = useState<boolean>(false);
//   const [selectedAccount, setSelectedAccount] = useState<AccountTypeEntity>();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error>();
//   const { isLoaded: isOrganizationListLoaded, setActive } = useOrganizationList();
//   const { loading: isGetAccountLoading, account } = useGetCurrentAccount();
//
//   useEffect(() => {
//     if (error) {
//       if (error instanceof ServerError && error.code === ErrorCodes.ACCOUNT_VERIFICATION_REJECTED.code) {
//         setRejectedDialog(true);
//       } else throw error;
//     }
//   }, [error]);
//
//   useEffect(() => {
//     if (isGetAccountLoading) return;
//     setSelectedAccount(account);
//   }, [isGetAccountLoading, account]);
//
//   async function changeAccount(newAccount: AccountTypeEntity) {
//     if (!isOrganizationListLoaded) return;
//     await setActive({ organization: newAccount.metadata.clerkId });
//   }
//   /**
//    * This function will do dumb select only and will not check the account ownership.
//    * However, the backend will be able to check the account ownership.
//    * It Should be a good thing for a moment until we release the MVP.
//    * @param newAccount
//    * @param reload
//    */
//   async function changeAccount(newAccount: AccountTypeEntity, reload: boolean = true) {
//     try {
//       const sessionService = new LocalStorageSessionService();
//       const sessionRepository = new SessionRepositoryImpl(sessionService);
//       const selectAccount = new SelectSessionAccountUseCase(sessionRepository);
//       const selectAccountParams = new SelectSessionAccountUseCaseParams(newAccount);
//
//       // Also, we need to check if the account verification is rejected or not
//       const http = new HttpRequest();
//       const accountService = new AccountServiceImpl(http);
//       const accountRepository = new AccountRepositoryImpl(accountService);
//       const retrieveVerification = new RetrieveAccountVerificationWorkUseCase(accountRepository, sessionRepository);
//       const retrieveVerificationParams = new RetrieveAccountVerificationWorkUseCaseParams(newAccount.id);
//       const verification = await retrieveVerification.execute(retrieveVerificationParams);
//       if (verification instanceof DataFailed) throw verification.error;
//       if (!verification.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
//
//       if (verification.data.latestStatus !== VerificationStatus.COMPLETED) {
//         // Still not yet completed the verification, so we still allow the use to change the account
//         const selectedAccount = await selectAccount.execute(selectAccountParams);
//         if (selectedAccount instanceof DataFailed) throw selectedAccount.error;
//         if (!selectedAccount.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
//
//         setSelectedAccount(selectedAccount.data);
//         if (reload) window.location.reload();
//       } else {
//         // This is where the latest status is completed, so we need to check the verification outcome
//         if (verification.data.verificationOutcome === VerificationOutcome.REJECTED) {
//           // If the verification outcome is rejected, we need to throw an error
//           throw new ServerError(ErrorCodes.ACCOUNT_VERIFICATION_REJECTED);
//         } else {
//           const selectedAccount = await selectAccount.execute(selectAccountParams);
//           if (selectedAccount instanceof DataFailed) throw selectedAccount.error;
//           if (!selectedAccount.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
//
//           setSelectedAccount(selectedAccount.data);
//           if (reload) window.location.reload();
//         }
//       }
//     } catch (err: any) {
//       setError(err);
//     }
//   }
//   return (
//     <SelectedAccountContext.Provider value={{ selectedAccount, changeAccount, states: [loading] }}>
//       <RejectedDialog open={rejectedDialog} setOpen={setRejectedDialog} />
//       {children}
//     </SelectedAccountContext.Provider>
//   );
//   return (
//     <SelectedAccountContext.Provider value={{ states: [false] }}>{props.children}</SelectedAccountContext.Provider>
//   );
// }

const SelectedAccountContext = createContext<SelectedAccountContextProps>({});

export function SelectedAccountProvider(props: SelectedAccountProviderProps) {
  const { accounts, error, loading } = useListAccount();
  const { account, error: currentAccountError, loading: currentAccountLoading } = useGetCurrentAccount();
  const { verificationWork } = useGetAccountVerificationWork({ accountId: account?.id ?? null });
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Redirects users without any organization memberships to the onboarding flow.
   *
   * This effect runs on every route change (pathname dependency) to ensure users
   * who haven't joined or created an account are always redirected to complete
   * the onboarding process.
   *
   * - Waits for an organization list to be loaded before checking
   * - If a user has no memberships (count === 0), redirects to account creation
   */
  useEffect(() => {
    if (loading || error) return;
    if (accounts.length === 0) router.push("/onboarding/account");
  }, [accounts, pathname, loading, error]);

  /**
   * Redirects users to the accounts page if they try to access a non-existent account.
   */
  useEffect(() => {
    if (currentAccountLoading) return;
    if (!currentAccountError) return;

    const isAccountNotFound =
      currentAccountError instanceof ServerError && currentAccountError.code === ErrorCodes.NOT_FOUND.code;

    if (isAccountNotFound) router.push("/accounts");
  }, [account, currentAccountLoading, currentAccountError, pathname]);

  /**
   * Redirects users to the KYC summary page if their account verification status is not pending.
   */
  useEffect(() => {
    if (!verificationWork) return;
    const routeMap: Record<string, string> = {
      [`${VerificationStatus.NEW}.${VerificationOutcome.PENDING}`]: "/onboarding/kyc-summary",
      [`${VerificationStatus.PROCESSING}.${VerificationOutcome.PENDING}`]: "/onboarding/kyc-summary",
      [`${VerificationStatus.COMPLETED}.${VerificationOutcome.REJECTED}`]: "/onboarding/kyc-summary",
    };

    const redirectRoute = routeMap[`${verificationWork.latestStatus}.${verificationWork.verificationOutcome}`];
    if (redirectRoute) router.push(redirectRoute);
  }, [verificationWork]);

  return <SelectedAccountContext value={{}}>{props.children}</SelectedAccountContext>;
}

export function useSelectedAccountProvider() {
  return useContext(SelectedAccountContext);
}
