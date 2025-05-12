import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { UseCase } from "@/core/resources/use-case";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { PayInRepository } from "@/features/payment/domain/repositories/pay-in";
import { VirtualAccountPayInRepository } from "@/features/payment/data/repositories/va-pay-in";

export class RetrieveVirtualAccountPayInDetailUseCaseParams {
  public requestId: string;

  constructor(args: { requestId: string }) {
    this.requestId = args.requestId;
  }
}

export class RetrieveVirtualAccountPayInDetailUseCase implements UseCase<DataState<VirtualAccountPayInDetailEntity>, RetrieveVirtualAccountPayInDetailUseCaseParams> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly payInRepository: PayInRepository
  ) {
  }

  public async execute(params: RetrieveVirtualAccountPayInDetailUseCaseParams): Promise<DataState<VirtualAccountPayInDetailEntity>> {
    try {
      if (!(this.payInRepository instanceof VirtualAccountPayInRepository)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.payInRepository.getDetail({ requestId: params.requestId }, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err as Error }));
    }
  }
}