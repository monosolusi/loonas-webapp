import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { PartnerRepository } from "../../domain/repositories/partner";
import { PartnerService } from "../sources/partner";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PartnerEntity } from "../../domain/entities/partner";
import { PartnerModel } from "../models/partner";

export class PartnerRepositoryImpl implements PartnerRepository {
  constructor(private partnerService: PartnerService) {
  }

  public async create(
    name: string,
    email: string,
    phone: string,
    session: SessionEntity
  ): Promise<DataState<boolean>> {
    try {
      await this.partnerService.create(name, email, phone, session);
      return new DataSuccess(true);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async list(session: SessionEntity): Promise<DataState<PartnerEntity[]>> {
    try {
      const partners = await this.partnerService.list(session);
      return new DataSuccess(partners.map(partner => partner.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}