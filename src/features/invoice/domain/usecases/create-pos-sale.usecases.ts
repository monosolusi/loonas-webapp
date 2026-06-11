import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoiceRepository } from "@/features/invoice/domain/repositories/invoice";

export type CreatePosSaleUseCaseItem = {
  variantId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

export class CreatePosSaleUseCaseParams {
  constructor(
    public readonly date: string,
    public readonly paymentGatewayId: string,
    public readonly discount: number,
    public readonly note: string | undefined,
    public readonly tenderedAmount: number | undefined,
    public readonly items: CreatePosSaleUseCaseItem[],
    public readonly idempotencyKey: string,
  ) {}
}

export class CreatePosSaleUseCase implements UseCase<DataState<OutgoingInvoiceEntity>, CreatePosSaleUseCaseParams> {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreatePosSaleUseCaseParams): Promise<DataState<OutgoingInvoiceEntity>> {
    try {
      const session = await this.resolveSession();
      const invoice = await this.createSale(params, session);
      return new DataSuccess(invoice);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async createSale(
    params: CreatePosSaleUseCaseParams,
    session: SessionEntity,
  ): Promise<OutgoingInvoiceEntity> {
    const result = await this.invoiceRepository.createPosSale(
      {
        date: params.date,
        paymentGatewayId: params.paymentGatewayId,
        discount: params.discount,
        note: params.note,
        tenderedAmount: params.tenderedAmount,
        items: params.items,
        idempotencyKey: params.idempotencyKey,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
