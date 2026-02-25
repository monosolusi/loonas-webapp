import {
  GetCreditCardFullRedirectPayInDetailFetcherParams,
  UseGetCreditCardFullRedirectPayInDetailProps,
} from "@/features/payment/presentations/hooks/use-get-credit-card-full-redirect-pay-in-detail.types";
import { CreditCardFullRedirectPayInDetailEntity } from "@/features/payment/domain/entities/cc-full-redirect-pay-in-detail";
import { CreditCardFullRedirectPayInRepository } from "@/features/payment/data/repositories/cc-full-redirect-pay-in";
import { CreditCardFullRedirectPayInService } from "@/features/payment/data/sources/cc-full-redirect-pay-in";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import {
  RetrieveCreditCardFullRedirectPayInDetailUseCase,
  RetrieveCreditCardFullRedirectPayInDetailUseCaseParams,
} from "@/features/payment/domain/usecases/retrieve-cc-full-redirect-pay-in-detail";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import useSWR from "swr";

async function GetCreditCardFullRedirectPayInDetailFetcher([, params]: [
  string,
  GetCreditCardFullRedirectPayInDetailFetcherParams,
]): Promise<CreditCardFullRedirectPayInDetailEntity> {
  const payInRepository = new CreditCardFullRedirectPayInRepository(
    new CreditCardFullRedirectPayInService(new HttpRequest()),
  );
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const get = new RetrieveCreditCardFullRedirectPayInDetailUseCase(sessionRepository, payInRepository);
  const getParams = new RetrieveCreditCardFullRedirectPayInDetailUseCaseParams({ requestId: params.invoice.id });

  const result = await get.execute(getParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetCreditCardFullRedirectPayInDetail(props: UseGetCreditCardFullRedirectPayInDetailProps) {
  const clerk = useClerk();
  return useSWR(
    ["get-credit-card-full-redirect-pay-in-detail", { ...props, clerk }],
    GetCreditCardFullRedirectPayInDetailFetcher,
    {},
  );
}
