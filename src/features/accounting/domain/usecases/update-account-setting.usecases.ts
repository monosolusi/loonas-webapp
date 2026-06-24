import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { LegalForm } from "@/features/accounting/domain/enums/legal-form";
import { AccountSettingRepository } from "@/features/accounting/domain/repositories/account-setting";
import { AccountSettingEntity } from "@/features/accounting/domain/entities/account-setting";

export type UpdateAccountSettingInput = {
  legalForm?: LegalForm;
  npwp?: string | null;
  nppkp?: string | null;
  pkpEffectiveDate?: string | null;
  isPphFinalUmkm?: boolean;
  pphFinalEligibilityStart?: string | null;
  sektorKlbi?: string | null;
};

export class UpdateAccountSettingUseCaseParams {
  constructor(public readonly params: UpdateAccountSettingInput) {}
}

export class UpdateAccountSettingUseCase implements UseCase<DataState<AccountSettingEntity>, UpdateAccountSettingUseCaseParams> {
  constructor(
    private readonly repo: AccountSettingRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: UpdateAccountSettingUseCaseParams): Promise<DataState<AccountSettingEntity>> {
    try {
      const session = await this.resolveSession();
      return this.repo.update(params.params, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
