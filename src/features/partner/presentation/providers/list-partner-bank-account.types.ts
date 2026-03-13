import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";

export type ListPartnerBankAccountContextProps = {
  banks: BankAccountEntity[];
};

export type ListPartnerBankAccountProviderProps = {
  children: React.ReactNode;
};
