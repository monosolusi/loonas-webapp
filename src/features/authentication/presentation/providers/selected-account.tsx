"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  SelectedAccountContextProps,
  SelectedAccountProviderProps,
} from "@/features/authentication/presentation/providers/selected-account.types";
import { useOrganizationList } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

const SelectedAccountContext = createContext<SelectedAccountContextProps>({
  states: [true],
});

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

export function SelectedAccountProvider(props: SelectedAccountProviderProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoaded: isOrganizationListLoaded, userMemberships } = useOrganizationList({ userMemberships: true });
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
    if (!isOrganizationListLoaded) return;
    if (userMemberships.count === 0) router.push("/onboarding/account");
  }, [isOrganizationListLoaded, userMemberships, pathname]);

  return <SelectedAccountContext value={{ states: [loading] }}>{props.children}</SelectedAccountContext>;
}

export function useSelectedAccountProvider() {
  return useContext(SelectedAccountContext);
}
