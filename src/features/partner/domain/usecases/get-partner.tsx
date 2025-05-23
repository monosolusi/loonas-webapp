import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { PartnerRepository } from "@/features/partner/domain/repositories/partner";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class GetPartnerUseCaseParams {
  public id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
  }
}

export class GetPartnerUseCase implements UseCase<DataState<PartnerEntity>, GetPartnerUseCaseParams> {
  constructor(
    public readonly partnerRepository: PartnerRepository,
    public readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: GetPartnerUseCaseParams): Promise<DataState<PartnerEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

      const partner = await this.partnerRepository.get({ id: params.id }, session.data);
      if (partner instanceof DataFailed) return partner;
      if (!partner.data) throw new ServerError(ErrorCodes.NOT_FOUND);
      return new DataSuccess(partner.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

}
