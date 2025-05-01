import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentGatewayEntity } from "../../domain/entities/payment-gateway";
import { PaymentGatewayRepository } from "../../domain/repositories/payment-gateway";
import { PaymentGatewayService } from "../sources/payment-gateway";

export class PaymentGatewayRepositoryImpl implements PaymentGatewayRepository {
  constructor(private paymentGatewayService: PaymentGatewayService) {}

  async listPaymentGateways(session: SessionEntity): Promise<DataState<PaymentGatewayEntity[]>> {
    try {
      const paymentGateways = await this.paymentGatewayService.listPaymentGateways(session);
      return new DataSuccess(paymentGateways.map(gateway => gateway.toEntity()));
    } catch (error) {
      if (error instanceof ServerError) return new DataFailed(error);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: error as Error }));
    }
  }
}