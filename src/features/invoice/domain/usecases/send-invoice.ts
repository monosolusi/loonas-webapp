import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";

export class SendInvoiceUseCaseParams {
  public readonly invoice: { id: string };
  public readonly sendChannel: NotificationChannel[];
  public readonly idempotencyKey: string;

  constructor(args: { invoice: { id: string }; sendChannel: NotificationChannel[]; idempotencyKey: string }) {
    this.invoice = args.invoice;
    this.sendChannel = args.sendChannel;
    this.idempotencyKey = args.idempotencyKey;
    Object.freeze(this);
  }
}

export class SendInvoiceUseCase implements UseCase<DataState<boolean>, SendInvoiceUseCaseParams> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: SendInvoiceUseCaseParams): Promise<DataState<boolean>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.invoiceRepository.send(
        { id: params.invoice.id, sendChannel: params.sendChannel, idempotencyKey: params.idempotencyKey },
        session.data,
      );
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
