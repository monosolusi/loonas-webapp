import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { PartnerRepository } from "@/features/partner/domain/repositories/partner";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

interface UpdatePartnerUseCaseParamsFields {
  name?: string;
  email?: string;
  phone?: string;
}

export class UpdatePartnerUseCaseParams {
  public id: string;
  public name?: string;
  public email?: string;
  public phone?: string;

  constructor(filter: { id: string }, fields: UpdatePartnerUseCaseParamsFields) {
    this.id = filter.id;
    this.name = fields.name;
    this.email = fields.email;
    this.phone = fields.phone;
  }
}

export class UpdatePartnerUseCase implements UseCase<DataState<PartnerEntity>, UpdatePartnerUseCaseParams> {
  constructor(
    public readonly partnerRepository: PartnerRepository,
    public readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: UpdatePartnerUseCaseParams): Promise<DataState<PartnerEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

      const updateFields = {
        ...(params.name && { name: params.name }),
        ...(params.email && { email: params.email }),
        ...(params.phone && { phone: params.phone })
      };

      const uPartner = await this.partnerRepository.update(
        { id: params.id },
        updateFields,
        session.data
      );

      if (uPartner instanceof DataFailed) return uPartner;
      if (!uPartner.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return new DataSuccess(uPartner.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
