import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PartnerRepository } from "@/features/partner/domain/repositories/partner";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";

interface ListPartnerInvoiceUseCaseParamsConstructor {
  partnerId: string;
  searchParams?: { limit?: number };
}

export class ListPartnerInvoiceUseCaseParams {
  public partnerId: string;
  public searchParams?: { limit?: number };

  constructor(args: ListPartnerInvoiceUseCaseParamsConstructor) {
    this.partnerId = args.partnerId;
    this.searchParams = args.searchParams;
  }
}


export class ListPartnerInvoiceUseCase implements UseCase<DataState<InvoiceEntity[]>, ListPartnerInvoiceUseCaseParams> {
  constructor(
    private readonly partnerRepository: PartnerRepository,
    private readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: ListPartnerInvoiceUseCaseParams): Promise<DataState<InvoiceEntity[]>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

      return this.partnerRepository.listInvoice(
        { partnerId: params.partnerId },
        { limit: params.searchParams?.limit },
        session.data
      );
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

}
