import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import {
  PartnerRepository,
  PartnerRepositoryFilter,
  PartnerRepositorySearchParams,
  PartnerRepositoryUpdateFields,
} from "../../domain/repositories/partner";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PartnerEntity } from "../../domain/entities/partner";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { PartnerService } from "@/features/partner/domain/sources/partner";

export class PartnerRepositoryImpl implements PartnerRepository {
  constructor(private partnerService: PartnerService) {}

  public async update(
    filter: Pick<PartnerRepositoryFilter, "id">,
    updateData: PartnerRepositoryUpdateFields,
    session: SessionEntity,
  ): Promise<DataState<PartnerEntity>> {
    try {
      const uPartner = await this.partnerService.update(filter, updateData, session);
      return new DataSuccess(uPartner.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async get(filter: PartnerRepositoryFilter, session: SessionEntity): Promise<DataState<PartnerEntity>> {
    try {
      const partner = await this.partnerService.get(filter, session);
      return new DataSuccess(partner.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async listInvoice(
    filter: { partner: { id: string } },
    params: PartnerRepositorySearchParams,
    session: SessionEntity,
  ): Promise<DataState<IncomingInvoiceEntity[]>> {
    try {
      const invoices = await this.partnerService.listInvoice({ partnerId: filter.partner.id }, params, session);

      return new DataSuccess(invoices.map((invoice) => invoice.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(name: string, email: string, phone: string, session: SessionEntity): Promise<DataState<boolean>> {
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
      return new DataSuccess(partners.map((partner) => partner.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
