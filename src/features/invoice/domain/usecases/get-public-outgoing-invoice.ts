import { DataFailed, DataState } from "@/core/resources/data-state";
import { UseCase } from "@/core/resources/use-case";
import { InvoiceRepository } from "../repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PublicOutgoingInvoiceEntity } from "../entities/public-outgoing-invoice";

export class GetPublicOutgoingInvoiceUseCaseParams {
  public readonly invoiceId: string;

  constructor(props: { invoiceid: string }) {
    this.invoiceId = props.invoiceid;
  }
}

export class GetPublicOutgoingInvoiceUseCase
  implements UseCase<DataState<PublicOutgoingInvoiceEntity>, GetPublicOutgoingInvoiceUseCaseParams>
{
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetPublicOutgoingInvoiceUseCaseParams): Promise<DataState<PublicOutgoingInvoiceEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.invoiceRepository.getPublicOutgoing({ invoiceId: params.invoiceId }, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
