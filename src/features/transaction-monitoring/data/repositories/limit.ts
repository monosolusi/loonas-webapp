import { PaymentMethodLimitEntity } from "@/features/payment/domain/entities/payment-method-limit";
import { LimitRepository } from "../../domain/repositories/limit";
import { LimitService } from "../../domain/sources/limit";
import { DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export class LimitRepositoryImpl implements LimitRepository {
  constructor(private readonly limitService: LimitService) {}

  public async getPaymentMethodLimit(
    params: { id: string },
    session: SessionEntity,
  ): Promise<DataState<PaymentMethodLimitEntity>> {
    const limit = await this.limitService.getPaymentMethodLimit({ id: params.id }, session);
    return new DataSuccess(limit.toEntity());
  }
}
