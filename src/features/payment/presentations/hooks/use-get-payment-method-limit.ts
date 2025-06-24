import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import useSWR from "swr";
import {
  GetPaymentMethodLimitUseCase,
  GetPaymentMethodLimitUseCaseParams,
} from "../../domain/usecases/get-payment-method-limit";
import { LimitRepositoryImpl } from "@/features/transaction-monitoring/data/repositories/limit";
import { LimitServiceImpl } from "@/features/transaction-monitoring/data/sources/limit";
import { HttpRequest } from "@/core/helpers/http-request";

interface GetPaymentMethodLimitFetcherParams {
  id: string;
}

async function GetPaymentMethodLimitFetcher([_, params]: [string, GetPaymentMethodLimitFetcherParams]) {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const http = new HttpRequest();
  const limitService = new LimitServiceImpl(http);
  const limitRepository = new LimitRepositoryImpl(limitService);
  const get = new GetPaymentMethodLimitUseCase(limitRepository, sessionRepository);
  const getParams = new GetPaymentMethodLimitUseCaseParams({ id: params.id });

  const limit = await get.execute(getParams);
  if (limit instanceof DataFailed) throw limit.error;
  if (!limit.data) throw new ServerError(ErrorCodes.NOT_FOUND);
  return limit.data;
}

export function useGetPaymentMethodLimit(props: GetPaymentMethodLimitFetcherParams) {
  const { data, isLoading, error } = useSWR(["get-payment-method-limit", props], GetPaymentMethodLimitFetcher);

  return {
    limit: data,
    loading: isLoading,
    error: error,
  };
}
