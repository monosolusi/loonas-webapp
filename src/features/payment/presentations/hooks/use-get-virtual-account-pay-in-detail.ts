import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { VirtualAccountPayInService } from "@/features/payment/data/sources/va-pay-in";
import { VirtualAccountPayInRepository } from "@/features/payment/data/repositories/va-pay-in";
import {
  RetrieveVirtualAccountPayInDetailUseCase,
  RetrieveVirtualAccountPayInDetailUseCaseParams,
} from "@/features/payment/domain/usecases/retrieve-virtual-account-pay-in-detail";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import useSWR from "swr";
import { HttpRequest } from "@/core/helpers/http-request";

interface GetVirtualAccountPayInDetailParams {
  requestId: string;
  clerk: ReturnType<typeof useClerk>;
}

async function GetVirtualAccountPayInDetailFetcher([, params]: [string, GetVirtualAccountPayInDetailParams]) {
  const http = new HttpRequest();
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const payInService = new VirtualAccountPayInService(http);
  const payInRepository = new VirtualAccountPayInRepository(payInService);
  const retrieve = new RetrieveVirtualAccountPayInDetailUseCase(sessionRepository, payInRepository);
  const retrieveParams = new RetrieveVirtualAccountPayInDetailUseCaseParams({ requestId: params.requestId });

  const result = await retrieve.execute(retrieveParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useGetVirtualAccountPayInDetail(params: { requestId: string }) {
  const clerk = useClerk();
  const { data, error, isLoading } = useSWR(
    ["get-virtual-account-pay-in-detail", { ...params, clerk }],
    GetVirtualAccountPayInDetailFetcher,
  );

  return {
    payIn: data,
    loading: isLoading,
    error: error,
  };
}
