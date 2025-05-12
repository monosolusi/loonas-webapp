import { DataFailed, DataState } from "@/core/resources/data-state";
import { UseCase } from "@/core/resources/use-case";
import { PaymentRequestEntity } from "@/features/invoice/domain/entities/payment-request";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaymentRequestRepository } from "@/features/invoice/domain/repositories/payment-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class RetrievePaymentRequestUseCaseParams {
  public requestId: string;
  public includes?: string;

  constructor(args: { requestId: string, includes?: string }) {
    this.requestId = args.requestId;
    this.includes = args.includes;
  }
}

export class RetrievePaymentRequestUseCase implements UseCase<DataState<PaymentRequestEntity>, RetrievePaymentRequestUseCaseParams> {

  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly paymentRequestRepository: PaymentRequestRepository
  ) {
  }

  public async execute(params: RetrievePaymentRequestUseCaseParams): Promise<DataState<PaymentRequestEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

      return this.paymentRequestRepository.get({ id: params.requestId, includes: params.includes }, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

}