import { BankRepository } from "../../domain/repositories/bank";
import { BankAccountEntity, BankEntity } from "../../domain/entities/bank";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BankService } from "../sources/bank";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";

export class BankRepositoryImpl implements BankRepository {
  constructor(private bankService: BankService) {
  }

  async listBanks(session: SessionEntity): Promise<DataState<BankEntity[]>> {
    try {
      const banks = await this.bankService.listBanks(session);
      return new DataSuccess(banks.map(bank => bank.toEntity()));
    } catch (error) {
      if (error instanceof ServerError) return new DataFailed(error);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: error as Error }));
    }
  }

  async listBankAccounts(partnerId: string, session: SessionEntity): Promise<DataState<BankAccountEntity[]>> {
    try {
      const bankAccounts = await this.bankService.listBankAccounts(partnerId, session);
      return new DataSuccess(bankAccounts.map(bankAccount => bankAccount.toEntity()));
    } catch (error) {
      if (error instanceof ServerError) return new DataFailed(error);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: error as Error }));
    }
  }

  async verifyAccountHolder(bankId: string, accountNumber: string, session: SessionEntity): Promise<DataState<AccountInquiryResultEntity>> {
    try {
      const inquiryResult = await this.bankService.verifyAccountHolder(bankId, accountNumber, session);
      return new DataSuccess(inquiryResult.toEntity());
    } catch (error) {
      if (error instanceof ServerError) return new DataFailed(error);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: error as Error }));
    }
  }

  async createBankAccount(bankId: string, accountNumber: string, accountHolderName: string, partnerId: string, session: SessionEntity): Promise<DataState<BankAccountEntity>> {
    try {
      const bankAccount = await this.bankService.createBankAccount(bankId, accountNumber, accountHolderName, partnerId, session);
      return new DataSuccess(bankAccount.toEntity());
    } catch (error) {
      if (error instanceof ServerError) return new DataFailed(error);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: error as Error }));
    }
  }
}