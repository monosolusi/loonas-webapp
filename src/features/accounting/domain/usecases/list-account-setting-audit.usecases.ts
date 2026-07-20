import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountSettingAuditRepository } from "@/features/accounting/domain/repositories/account-setting-audit";
import { AccountSettingAuditEntity } from "@/features/accounting/domain/entities/account-setting-audit";

export class ListAccountSettingAuditUseCaseParams {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}

export class ListAccountSettingAuditUseCase implements UseCase<DataState<PaginatedData<AccountSettingAuditEntity>>, ListAccountSettingAuditUseCaseParams> {
  constructor(
    private readonly repo: AccountSettingAuditRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListAccountSettingAuditUseCaseParams): Promise<DataState<PaginatedData<AccountSettingAuditEntity>>> {
    try {
      const session = await this.resolveSession();
      return this.repo.list({ page: params.page, limit: params.limit }, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession() {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
