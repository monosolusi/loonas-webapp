"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { RetrieveSessionAccountUseCase } from "@/features/authentication/domain/usecases/retrieve-session-account";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  SelectSessionAccountUseCase,
  SelectSessionAccountUseCaseParams
} from "@/features/authentication/domain/usecases/select-session-account";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import {
  RetrieveAccountVerificationWorkUseCase,
  RetrieveAccountVerificationWorkUseCaseParams
} from "@/features/account/domain/usecases/retrieve-account-verification-work";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface SelectedAccountContextProps {
  states: [boolean]; // loading
  selectedAccount?: PersonalAccountEntity;
  changeAccount?: (account: PersonalAccountEntity) => (void | Promise<void>);
}

const SelectedAccountContext = createContext<SelectedAccountContextProps>({
  states: [true]
});

export function SelectedAccountProvider({ children }: { children: any }) {
  const [rejectedDialog, setRejectedDialog] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<PersonalAccountEntity>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) {
      if (error instanceof ServerError && error.code === ErrorCodes.ACCOUNT_VERIFICATION_REJECTED.code) {
        setRejectedDialog(true);
      } else throw error;
    }
  }, [error]);

  useEffect(() => {
    setLoading(true);

    const sessionService = new LocalStorageSessionService();
    const sessionRepository = new SessionRepositoryImpl(sessionService);
    const retrieveAccount = new RetrieveSessionAccountUseCase(sessionRepository);
    retrieveAccount
      .execute()
      .then((account) => {
        if (account instanceof DataFailed) throw account.error;
        if (!account.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
        setSelectedAccount(account.data);
      })
      .catch((err: any) => {
        // Ignore if the account is not found
        if (err instanceof ServerError && err.code === ErrorCodes.NOT_FOUND.code) return;
        else setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * This function will do dumb select only and will not check the account ownership.
   * However, the backend will be able to check the account ownership.
   * It Should be a good thing for a moment until we release the MVP.
   * @param newAccount
   */
  async function changeAccount(newAccount: PersonalAccountEntity) {
    try {
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const selectAccount = new SelectSessionAccountUseCase(sessionRepository);
      const selectAccountParams = new SelectSessionAccountUseCaseParams(newAccount);
      const selectedAccount = await selectAccount.execute(selectAccountParams);
      if (selectedAccount instanceof DataFailed) throw selectedAccount.error;
      if (!selectedAccount.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // Also, we need to check if the account verification is rejected or not
      const accountService = new AccountServiceImpl();
      const accountRepository = new AccountRepositoryImpl(accountService);
      const retrieveVerification = new RetrieveAccountVerificationWorkUseCase(accountRepository, sessionRepository);
      const retrieveVerificationParams = new RetrieveAccountVerificationWorkUseCaseParams(selectedAccount.data.id);
      const verification = await retrieveVerification.execute(retrieveVerificationParams);
      if (verification instanceof DataFailed) throw verification.error;
      if (!verification.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);


      if (verification.data.latestStatus !== VerificationStatus.COMPLETED) {
        // Still not yet completed the verification, so we still allow the use to change the account
        setSelectedAccount(selectedAccount.data);
      } else {
        // This is where the latest status is completed, so we need to check the verification outcome
        if (verification.data.verificationOutcome === VerificationOutcome.REJECTED) {
          // If the verification outcome is rejected, we need to throw an error
          throw new ServerError(ErrorCodes.ACCOUNT_VERIFICATION_REJECTED);
        } else setSelectedAccount(selectedAccount.data);
      }


    } catch (err: any) {
      setError(err);
    }
  }

  return (
    <SelectedAccountContext.Provider
      value={{ selectedAccount, changeAccount, states: [loading] }}
    >
      <RejectedDialog open={rejectedDialog} setOpen={setRejectedDialog} />
      {children}
    </SelectedAccountContext.Provider>
  );
}

export function useSelectedAccountProvider() {
  return useContext(SelectedAccountContext);
}

function RejectedDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
                <XMarkIcon aria-hidden="true" className="size-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  Akun Tidak Bisa Dipilih
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Maaf ya, akun ini nggak bisa kamu pilih karena sudah ditolak sebelumnya.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default"
              >
                Mengerti
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}