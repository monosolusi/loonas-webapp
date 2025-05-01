import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentGatewayEntity } from "../entities/payment-gateway";

export interface PaymentGatewayRepository {
  listPaymentGateways(session: SessionEntity): Promise<DataState<PaymentGatewayEntity[]>>;
}