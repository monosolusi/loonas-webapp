import { UserRepositoryImpl } from "@/features/user/data/repositories/user";
import { UserServiceImpl } from "@/features/user/data/sources/user";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";
import useSWR from "swr";
import { GetUserStatusFetcherParams } from "@/features/user/presentation/hooks/use-get-user-status.types";
import { UserStatusEntity } from "@/features/user/domain/entities/user-status.entity";
import { GetUserStatusUseCase } from "@/features/user/domain/usecases/get-user-status.usecase";

async function GetUserStatusFetcher([_, params]: [string, GetUserStatusFetcherParams]): Promise<UserStatusEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const userRepository = new UserRepositoryImpl(new UserServiceImpl(new HttpRequest()));
  const get = new GetUserStatusUseCase(userRepository, sessionRepository);
  const status = await get.execute();
  if (status instanceof DataFailed) throw status.error;
  if (!status.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return status.data;
}

export function useGetUserStatus() {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["get-user-status", { clerk }], GetUserStatusFetcher);

  return {
    status: data,
    loading: isLoading,
    error: error,
  };
}
