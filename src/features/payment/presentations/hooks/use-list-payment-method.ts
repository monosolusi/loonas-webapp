import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PaymentGatewayServiceImpl } from "@/features/payment/data/sources/payment-gateway";
import { PaymentGatewayRepositoryImpl } from "@/features/payment/data/repositories/payment-gateway";
import { ListPaymentGatewaysUseCase } from "@/features/payment/domain/usecases/list-payment-gateways";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";

async function listPaymentMethodFetcher() {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const paymentGatewayService = new PaymentGatewayServiceImpl();
  const paymentGatewayRepository = new PaymentGatewayRepositoryImpl(paymentGatewayService);
  const list = new ListPaymentGatewaysUseCase(paymentGatewayRepository, sessionRepository);

  const result = await list.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useListPaymentMethod() {
  const { data, isLoading, error, mutate } = useSWR("list-payment-method", listPaymentMethodFetcher);

  return {
    paymentMethods: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
