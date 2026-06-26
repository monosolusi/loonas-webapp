import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  LedgerAccountRepository,
  ListLedgerAccountsParams,
  ListLedgerAccountsResult,
  GetAccountBalanceParams,
  ListLedgerEntriesParams,
  ListLedgerEntriesResult,
  CreateLedgerAccountParams,
  UpdateLedgerAccountParams,
  DeleteLedgerAccountParams,
} from "@/features/accounting/domain/repositories/ledger-account";
import { AccountBalanceEntity } from "@/features/accounting/domain/entities/account-balance";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { LedgerAccountService } from "@/features/accounting/domain/sources/ledger-account";

export class LedgerAccountRepositoryImpl implements LedgerAccountRepository {
  constructor(private readonly service: LedgerAccountService) {}

  public async list(params: ListLedgerAccountsParams, session: SessionEntity): Promise<DataState<ListLedgerAccountsResult>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({ accounts: result.data.map((m) => m.toEntity()), meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getBalance(params: GetAccountBalanceParams, session: SessionEntity): Promise<DataState<AccountBalanceEntity>> {
    try {
      const model = await this.service.getBalance(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async listEntries(params: ListLedgerEntriesParams, session: SessionEntity): Promise<DataState<ListLedgerEntriesResult>> {
    try {
      const result = await this.service.listEntries(params, session);
      return new DataSuccess({ entries: result.data.map((m) => m.toEntity()), meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreateLedgerAccountParams, session: SessionEntity): Promise<DataState<LedgerAccountEntity>> {
    try {
      const model = await this.service.create(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(params: UpdateLedgerAccountParams, session: SessionEntity): Promise<DataState<LedgerAccountEntity>> {
    try {
      const model = await this.service.update(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async delete(params: DeleteLedgerAccountParams, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.service.delete(params, session);
      return new DataSuccess();
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
