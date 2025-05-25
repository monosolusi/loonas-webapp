import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BankModel } from "@/features/bank/data/models/bank";
import { BankAccountModel } from "@/features/bank/data/models/bank-account";
import { AccountInquiryResultModel } from "@/features/bank/data/models/account-inquiry-result";
import { AccountBankAccountModel } from "@/features/account/data/models/account-bank-account";

export interface BankService {
  /**
   * Retrieves a list of available banks
   * @param session Current user session
   * @returns Promise resolving to array of BankModel
   */
  listBanks(session: SessionEntity): Promise<BankModel[]>;

  /**
   * Retrieves bank accounts for a specific partner
   * @param partnerId ID of the partner
   * @param session Current user session
   * @returns Promise resolving to an array of BankAccountModel
   */
  listBankAccounts(partnerId: string, session: SessionEntity): Promise<BankAccountModel[]>;

  getBankAccount(params: {
    partnerId: string,
    id: string
  }, session: SessionEntity): Promise<BankAccountModel>;

  /**
   * Verifies the holder of a bank account
   * @param bankId ID of the bank
   * @param accountNumber Account number to verify
   * @param session Current user session
   * @returns Promise resolving to AccountInquiryResultModel
   */
  verifyAccountHolder(bankId: string, accountNumber: string, session: SessionEntity): Promise<AccountInquiryResultModel>;

  /**
   * Creates a new bank account for a partner
   * @param bankId ID of the bank
   * @param accountNumber Account number
   * @param accountHolderName Name of the account holder
   * @param partnerId ID of the partner
   * @param session Current user session
   * @returns Promise resolving to created BankAccountModel
   */
  createBankAccount(bankId: string, accountNumber: string, accountHolderName: string, partnerId: string, session: SessionEntity): Promise<BankAccountModel>;


  createBankAccountForAccount(params: {
    bankId: string,
    accountNumber: string,
    accountId: string
  }, session: SessionEntity): Promise<AccountBankAccountModel>;
}
