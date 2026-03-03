import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PaymentGatewayServiceImpl } from "@/features/payment/data/sources/payment-gateway";
import { PaymentGatewayRepositoryImpl } from "@/features/payment/data/repositories/payment-gateway";
import { ListPaymentGatewaysUseCase } from "@/features/payment/domain/usecases/list-payment-gateways";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import useSWR from "swr";

type ListPaymentMethodFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};

async function listPaymentMethodFetcher([_, params]: [string, ListPaymentMethodFetcherParams]) {
  const sessionService = new ClerkSessionService({ clerk: params.clerk });
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
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    ["list-payment-method", { clerk }],
    listPaymentMethodFetcher,
  );

  return {
    paymentMethods: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
