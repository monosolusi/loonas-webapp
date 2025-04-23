import { BankAccountEntity, BankEntity } from "../entities/bank";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";

export interface BankRepository {
  listBanks(session: SessionEntity): Promise<DataState<BankEntity[]>>;

  listBankAccounts(partnerId: string, session: SessionEntity): Promise<DataState<BankAccountEntity[]>>;

  verifyAccountHolder(bankId: string, accountNumber: string, session: SessionEntity): Promise<DataState<AccountInquiryResultEntity>>;

  createBankAccount(bankId: string, accountNumber: string, accountHolderName: string, partnerId: string, session: SessionEntity): Promise<DataState<BankAccountEntity>>;
}