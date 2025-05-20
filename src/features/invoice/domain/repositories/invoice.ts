import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";

export interface InvoiceRepositoryFilter {
}

export interface InvoiceRepositoryFilterParams {
  limit?: number;
}

export abstract class InvoiceRepository {
  public abstract list(
    filter: InvoiceRepositoryFilter,
    params: InvoiceRepositoryFilterParams,
    session: SessionEntity
  ): Promise<DataState<InvoiceEntity[]>>
}
