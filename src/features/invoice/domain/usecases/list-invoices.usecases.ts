import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaginatedData } from "@/core/resources/paginated";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { InvoiceListItemEntity } from "@/features/invoice/domain/types/invoice-list-item";

export class ListInvoicesUseCaseParams {
  public type?: InvoiceType;
  public channel?: InvoiceChannel;
  public page: number;
  public limit: number;
  public includes?: string;
  public filter?: string;
  public from?: string;
  public to?: string;

  constructor(args: {
    type?: InvoiceType;
    channel?: InvoiceChannel;
    page?: number;
    limit?: number;
    includes?: string;
    filter?: string;
    from?: string;
    to?: string;
  }) {
    this.type = args.type;
    this.channel = args.channel;
    this.page = args.page ?? 1;
    this.limit = args.limit ?? DEFAULT_PAGE_SIZE;
    this.includes = args.includes;
    this.filter = args.filter;
    this.from = args.from;
    this.to = args.to;
  }
}

export class ListInvoicesUseCase
  implements UseCase<DataState<PaginatedData<InvoiceListItemEntity>>, ListInvoicesUseCaseParams>
{
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListInvoicesUseCaseParams): Promise<DataState<PaginatedData<InvoiceListItemEntity>>> {
    try {
      const session = await this.retrieveSession();
      return this.invoiceRepository.list(
        {
          type: params.type,
          channel: params.channel,
          page: params.page,
          limit: params.limit,
          includes: params.includes,
          filter: params.filter,
          from: params.from,
          to: params.to,
        },
        session,
      );
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async retrieveSession() {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return session.data;
  }
}
