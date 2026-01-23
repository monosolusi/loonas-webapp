import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import useSWR from "swr";
import {
  GetPaymentMethodLimitUseCase,
  GetPaymentMethodLimitUseCaseParams,
} from "../../domain/usecases/get-payment-method-limit";
import { LimitRepositoryImpl } from "@/features/transaction-monitoring/data/repositories/limit";
import { LimitServiceImpl } from "@/features/transaction-monitoring/data/sources/limit";
import { HttpRequest } from "@/core/helpers/http-request";
import {
  GetPaymentMethodLimitFetcherParams,
  UseGetPaymentMethodLimitProps,
} from "@/features/payment/presentations/hooks/use-get-payment-method-limit.types";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";

async function GetPaymentMethodLimitFetcher([_, params]: [string, GetPaymentMethodLimitFetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const limitRepository = new LimitRepositoryImpl(new LimitServiceImpl(new HttpRequest()));
  const get = new GetPaymentMethodLimitUseCase(limitRepository, sessionRepository);
  const getParams = new GetPaymentMethodLimitUseCaseParams({ id: params.id });

  const limit = await get.execute(getParams);
  if (limit instanceof DataFailed) throw limit.error;
  if (!limit.data) throw new ServerError(ErrorCodes.NOT_FOUND);
  return limit.data;
}

export function useGetPaymentMethodLimit(props: UseGetPaymentMethodLimitProps) {
  const clerk = useClerk();
  return useSWR(["get-payment-method-limit", { ...props, clerk }], GetPaymentMethodLimitFetcher);
}
