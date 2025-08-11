import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PartnerModel } from "@/features/partner/data/models/partner";
import { InvoiceModel } from "@/features/invoice/data/models/invoice";

export type PartnerServiceFilter = {
  partnerId?: string;
  id?: string;
};

export type PartnerServiceSearchParams = {
  limit?: number;
};

export type PartnerServiceUpdateFields = {
  name?: string;
  email?: string;
  phone?: string;
};

export interface PartnerService {
  create(name: string, email: string, phone: string, session: SessionEntity): Promise<boolean>;

  list(session: SessionEntity): Promise<PartnerModel[]>;

  listInvoice(
    filter: PartnerServiceFilter,
    params: PartnerServiceSearchParams,
    session: SessionEntity,
  ): Promise<InvoiceModel[]>;

  get(params: PartnerServiceFilter, session: SessionEntity): Promise<PartnerModel>;

  update(
    filter: Pick<PartnerServiceFilter, "id">,
    updateData: PartnerServiceUpdateFields,
    session: SessionEntity,
  ): Promise<PartnerModel>;
}
