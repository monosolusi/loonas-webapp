import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { VirtualAccountPayInService } from "../../data/sources/va-pay-in";
import { VirtualAccountPayInRepository } from "../../data/repositories/va-pay-in";
import {
  RetrieveVirtualAccountPayInDetailUseCase,
  RetrieveVirtualAccountPayInDetailUseCaseParams,
} from "../../domain/usecases/retrieve-virtual-account-pay-in-detail";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";

interface GetVirtualAccountPayInDetailParams {
  requestId: string;
}

async function GetVirtualAccountPayInDetailFetcher([_, params]: [string, GetVirtualAccountPayInDetailParams]) {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const payInService = new VirtualAccountPayInService();
  const payInRepository = new VirtualAccountPayInRepository(payInService);
  const retrieve = new RetrieveVirtualAccountPayInDetailUseCase(sessionRepository, payInRepository);
  const retrieveParams = new RetrieveVirtualAccountPayInDetailUseCaseParams({ requestId: params.requestId });

  const result = await retrieve.execute(retrieveParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useGetVirtualAccountPayInDetail(params: GetVirtualAccountPayInDetailParams) {
  const { data, error, isLoading } = useSWR(
    ["get-virtual-account-pay-in-detail", params],
    GetVirtualAccountPayInDetailFetcher,
  );

  return {
    payIn: data,
    loading: isLoading,
    error: error,
  };
}
