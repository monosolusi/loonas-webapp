import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";

export interface InvoiceRepositoryFilter {
  id?: string;
}

export interface InvoiceRepositoryFilterParams {
  limit?: number;
  includes?: string;
}

export abstract class InvoiceRepository {
  public abstract list(
    filter: InvoiceRepositoryFilter,
    params: InvoiceRepositoryFilterParams,
    session: SessionEntity
  ): Promise<DataState<InvoiceEntity[]>>

  public abstract get(
    filter: InvoiceRepositoryFilter,
    params: Pick<InvoiceRepositoryFilterParams, "includes">,
    session: SessionEntity
  ): Promise<DataState<InvoiceEntity>>
}
