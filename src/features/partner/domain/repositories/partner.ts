import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { PartnerEntity } from "../entities/partner";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";


export interface PartnerRepositorySearchParams {
  limit?: number;
}

export abstract class PartnerRepository {
  public abstract create(
    name: string,
    email: string,
    phone: string,
    session: SessionEntity
  ): Promise<DataState<boolean>>;

  public abstract list(
    session: SessionEntity
  ): Promise<DataState<PartnerEntity[]>>;

  public abstract listInvoice(
    filter: { partnerId: string },
    params: PartnerRepositorySearchParams,
    session: SessionEntity
  ): Promise<DataState<InvoiceEntity[]>>
}
