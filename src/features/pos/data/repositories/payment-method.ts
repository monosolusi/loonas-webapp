import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  ListPaymentMethodsParams,
  ListPaymentMethodsResult,
  PaymentMethodRepository,
} from "@/features/pos/domain/repositories/payment-method";
import { PaymentMethodService } from "@/features/pos/domain/sources/payment-method";

export class PaymentMethodRepositoryImpl implements PaymentMethodRepository {
  constructor(private readonly service: PaymentMethodService) {}

  public async list(
    params: ListPaymentMethodsParams,
    session: SessionEntity,
  ): Promise<DataState<ListPaymentMethodsResult>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        paymentMethods: result.data.map((m) => m.toEntity()),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
