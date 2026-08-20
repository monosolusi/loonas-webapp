import { UserRepositoryImpl } from "@/features/user/data/repositories/user";
import { UserServiceImpl } from "@/features/user/data/sources/user";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";
import useSWR from "swr";
import {
  GetUserStatusFetcherParams,
  UseGetUserStatusReturnType,
} from "@/features/user/presentation/hooks/use-get-user-status.types";
import { UserStatusEntity } from "@/features/user/domain/entities/user-status.entity";
import { GetUserStatusUseCase } from "@/features/user/domain/usecases/get-user-status.usecase";
import { USER_SWR_KEYS } from "@/features/user/presentation/constants/swr-keys";

const INITIAL_STATE: UseGetUserStatusReturnType = {
  status: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetUserStatusFetcher([_, params]: [string, GetUserStatusFetcherParams]): Promise<UserStatusEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const userRepository = new UserRepositoryImpl(new UserServiceImpl(new HttpRequest()));
  const get = new GetUserStatusUseCase(userRepository, sessionRepository);
  const status = await get.execute();
  if (status instanceof DataFailed) throw status.error;
  if (!status.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return status.data;
}

export function useGetUserStatus(): UseGetUserStatusReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [USER_SWR_KEYS.GET_USER_STATUS, { clerk }],
    GetUserStatusFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      status: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: null,
    };
  }
  if (!data) return INITIAL_STATE;
  return { status: data, loading: false, error: null, refresh: mutate };
}
