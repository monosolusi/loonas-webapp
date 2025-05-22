import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  InvoiceRepository,
  InvoiceRepositoryFilter,
  InvoiceRepositoryFilterParams
} from "@/features/invoice/domain/repositories/invoice";
import { InvoiceEntity } from "../../domain/entities/invoice";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceService } from "@/features/invoice/data/services/invoice";

export class InvoiceRepositoryImpl implements InvoiceRepository {

  constructor(
    private readonly invoiceService: InvoiceService
  ) {
  }

  public async get(filter: InvoiceRepositoryFilter, params: Pick<InvoiceRepositoryFilterParams, "includes">, session: SessionEntity): Promise<DataState<InvoiceEntity>> {
    try {
      const invoice = await this.invoiceService.get(filter, params, session);
      return new DataSuccess(invoice.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async list(filter: InvoiceRepositoryFilter, params: InvoiceRepositoryFilterParams, session: SessionEntity): Promise<DataState<InvoiceEntity[]>> {
    try {
      const invoices = await this.invoiceService.list(filter, params, session);
      return new DataSuccess(invoices.map(invoice => invoice.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

}
