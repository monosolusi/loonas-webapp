import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { BankRepository } from "@/features/bank/domain/repositories/bank";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { AccountBankAccountEntity } from "@/features/account/domain/entities/account-bank-account";
import { BankService } from "@/features/bank/domain/sources/bank";

export class BankRepositoryImpl implements BankRepository {
  constructor(private bankService: BankService) {}

  public async createBankAccountForAccount(
    params: {
      bankId: string;
      accountNumber: string;
    },
    session: SessionEntity,
  ): Promise<DataState<AccountBankAccountEntity>> {
    try {
      const bankAccount = await this.bankService.createBankAccountForAccount(
        {
          bankId: params.bankId,
          accountNumber: params.accountNumber,
        },
        session,
      );

      return new DataSuccess(bankAccount.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  async listBanks(session: SessionEntity): Promise<DataState<BankEntity[]>> {
    try {
      const banks = await this.bankService.listBanks(session);
      return new DataSuccess(banks.map((bank) => bank.toEntity()));
    } catch (error) {
      if (error instanceof ServerError) return new DataFailed(error);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: error as Error }));
    }
  }

  async listBankAccounts(partnerId: string, session: SessionEntity): Promise<DataState<BankAccountEntity[]>> {
    try {
      const bankAccounts = await this.bankService.listBankAccounts(partnerId, session);
      return new DataSuccess(bankAccounts.map((bankAccount) => bankAccount.toEntity()));
    } catch (error) {
      if (error instanceof ServerError) return new DataFailed(error);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: error as Error }));
    }
  }

  async verifyAccountHolder(
    bankId: string,
    accountNumber: string,
    session: SessionEntity,
  ): Promise<DataState<AccountInquiryResultEntity>> {
    try {
      const inquiryResult = await this.bankService.verifyAccountHolder(bankId, accountNumber, session);
      return new DataSuccess(inquiryResult.toEntity());
    } catch (error) {
      if (error instanceof ServerError) return new DataFailed(error);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: error as Error }));
    }
  }

  async createBankAccount(
    bankId: string,
    accountNumber: string,
    accountHolderName: string,
    partnerId: string,
    session: SessionEntity,
  ): Promise<DataState<BankAccountEntity>> {
    try {
      const bankAccount = await this.bankService.createBankAccount(
        bankId,
        accountNumber,
        accountHolderName,
        partnerId,
        session,
      );
      return new DataSuccess(bankAccount.toEntity());
    } catch (error) {
      if (error instanceof ServerError) return new DataFailed(error);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: error as Error }));
    }
  }
}
