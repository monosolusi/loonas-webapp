import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentMethodRepository } from "@/features/payment/domain/repositories/payment-method.repository";
import { PaymentMethodCategoryEntity } from "../../domain/entities/payment-method-category.entity";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaymentMethodService } from "@/features/payment/domain/sources/payment-method.service";

export class PaymentMethodRepositoryImpl implements PaymentMethodRepository {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  public async listDisplay(session: SessionEntity): Promise<DataState<PaymentMethodCategoryEntity[]>> {
    try {
      const data = await this.paymentMethodService.listDisplay(session);
      const entities = data.map((method) => method.toEntity());
      return new DataSuccess(entities);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
