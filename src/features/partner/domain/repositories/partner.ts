import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { PartnerEntity } from "../entities/partner";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";

export interface PartnerRepositorySearchParams {
  limit?: number;
}

export interface PartnerRepositoryFilter {
  id?: string;
  partnerId?: string;
}

export interface PartnerRepositoryUpdateFields {
  name?: string;
  email?: string;
  phone?: string;
}

export interface PartnerRepository {
  create(name: string, email: string, phone: string, session: SessionEntity): Promise<DataState<boolean>>;

  list(session: SessionEntity): Promise<DataState<PartnerEntity[]>>;

  listInvoice(
    filter: { partner: { id: string } },
    params: PartnerRepositorySearchParams,
    session: SessionEntity,
  ): Promise<DataState<IncomingInvoiceEntity[]>>;

  get(filter: PartnerRepositoryFilter, session: SessionEntity): Promise<DataState<PartnerEntity>>;

  update(
    filter: Pick<PartnerRepositoryFilter, "id">,
    updateData: PartnerRepositoryUpdateFields,
    session: SessionEntity,
  ): Promise<DataState<PartnerEntity>>;
}
