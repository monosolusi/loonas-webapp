import React from "react";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";

export type CreatePartnerBankAccountContextProps = {
  bank?: BankEntity;
  accountNumber?: string;
  accountHolderName?: string;
  isVerified: boolean;
  isCreating: boolean;
  setIsVerified?: React.Dispatch<React.SetStateAction<boolean>>;
  setAccountNumber?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setBank?: React.Dispatch<React.SetStateAction<BankEntity | undefined>>;
  setAccountHolderName?: React.Dispatch<React.SetStateAction<string | undefined>>;
  createBankAccount?: () => Promise<BankAccountEntity>;
};

export type CreatePartnerBankAccountProviderProps = {
  children: React.ReactNode;
  partner?: PartnerEntity;
};
