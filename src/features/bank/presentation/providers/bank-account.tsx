"use client";

import React, { useEffect, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { DataFailed } from "@/core/resources/data-state";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import {
  ListBankAccountsUseCase,
  ListBankAccountsUseCaseParams
} from "@/features/bank/domain/usecases/list-bank-accounts";
import { BankRepositoryImpl } from "@/features/bank/data/repositories/bank";
import {
  VerifyAccountHolderUseCase,
  VerifyAccountHolderUseCaseParams
} from "@/features/bank/domain/usecases/verify-account-holder";
import {
  CreateBankAccountUseCase,
  CreateBankAccountUseCaseParams
} from "@/features/bank/domain/usecases/create-bank-account";

interface BankAccountProviderProps {
  children: React.ReactNode;
  receiver?: PartnerEntity;
  receiverId?: string;
}

interface BankAccountContextProps {
  bankAccounts: BankAccountEntity[];
  loading: boolean;
  verifying: boolean;
  creating: boolean;
  error?: ServerError;
  refreshBankAccounts?: (partnerId: string) => Promise<void>;
  verifyAccountHolder?: (bankId: string, accountNumber: string) => Promise<AccountInquiryResultEntity | undefined>;
  createBankAccount?: (bankId: string, accountNumber: string, accountHolderName: string, partnerId: string) => Promise<boolean>;
}

const BankAccountContext = React.createContext<BankAccountContextProps>({
  bankAccounts: [],
  loading: false,
  verifying: false,
  creating: false
});

export function BankAccountProvider(props: BankAccountProviderProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccountEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<ServerError>();

  useEffect(() => {
    if (props.receiver) fetchBankAccounts(props.receiver.id);
    else if (props.receiverId) fetchBankAccounts(props.receiverId);
  }, [props.receiver, props.receiverId]);

  async function fetchBankAccounts(partnerId: string) {
    setLoading(true);
    setError(undefined);

    try {
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const bankService = new BankServiceImpl();
      const bankRepository = new BankRepositoryImpl(bankService);
      const listBankAccounts = new ListBankAccountsUseCase(bankRepository, sessionRepository);
      const params = new ListBankAccountsUseCaseParams(partnerId);

      const result = await listBankAccounts.execute(params);
      if (result instanceof DataFailed) throw result.error;
      if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      setBankAccounts(result.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  async function verifyAccount(bankId: string, accountNumber: string): Promise<AccountInquiryResultEntity | undefined> {
    setVerifying(true);
    setError(undefined);

    try {
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const bankService = new BankServiceImpl();
      const bankRepository = new BankRepositoryImpl(bankService);
      const verifyAccountHolder = new VerifyAccountHolderUseCase(bankRepository, sessionRepository);
      const params = new VerifyAccountHolderUseCaseParams(bankId, accountNumber);

      const result = await verifyAccountHolder.execute(params);
      if (result instanceof DataFailed) throw result.error;
      if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setVerifying(false);
      return result.data;
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      else setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  async function createAccount(bankId: string, accountNumber: string, holderName: string, partnerId: string): Promise<boolean> {
    setCreating(true);
    setError(undefined);

    try {
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const bankService = new BankServiceImpl();
      const bankRepository = new BankRepositoryImpl(bankService);
      const createBankAccount = new CreateBankAccountUseCase(bankRepository, sessionRepository);
      const params = new CreateBankAccountUseCaseParams(bankId, accountNumber, holderName, partnerId);

      const result = await createBankAccount.execute(params);
      if (result instanceof DataFailed) throw result.error;
      if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      setCreating(false);
      return true;
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      else setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
      return false;
    }
  }

  return (
    <BankAccountContext.Provider
      value={{
        bankAccounts,
        loading,
        verifying,
        creating,
        error,
        refreshBankAccounts: fetchBankAccounts,
        verifyAccountHolder: verifyAccount,
        createBankAccount: createAccount
      }}
    >
      {props.children}
    </BankAccountContext.Provider>
  );
}

export function useBankAccount() {
  return React.useContext(BankAccountContext);
}
