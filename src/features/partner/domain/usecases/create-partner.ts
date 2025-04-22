import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PartnerRepository } from "@/features/partner/domain/repositories/partner";

export class CreatePartnerUseCaseParams {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string
  ) {
  }
}

export class CreatePartnerUseCase implements UseCase<DataState<boolean>, CreatePartnerUseCaseParams> {

  constructor(
    public readonly partnerRepository: PartnerRepository,
    public readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: CreatePartnerUseCaseParams): Promise<DataState<boolean>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    return this.partnerRepository.create(
      params.name,
      params.email,
      params.phone,
      session.data
    );
  }

}