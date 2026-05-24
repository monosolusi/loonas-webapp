import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PartnerRepository } from "@/features/partner/domain/repositories/partner";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";

export class ListPartnerUseCase implements UseCase<DataState<PartnerEntity[]>, void> {
  constructor(
    public readonly partnerRepository: PartnerRepository,
    public readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(): Promise<DataState<PartnerEntity[]>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    return this.partnerRepository.list(session.data);
  }
}