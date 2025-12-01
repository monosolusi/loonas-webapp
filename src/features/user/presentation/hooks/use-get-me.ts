import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { UserRepositoryImpl } from "@/features/user/data/repositories/user";
import { CheckSessionUseCase } from "@/features/authentication/domain/usecases/check-session";
import { UserServiceImpl } from "@/features/user/data/sources/user";
import { DataFailed } from "@/core/resources/data-state";
import { UserEntity } from "@/features/user/domain/entities/user";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";

async function GetMeFetcher(_: string): Promise<UserEntity> {
  const sessionRepository = new SessionRepositoryImpl(new LocalStorageSessionService());
  const userRepository = new UserRepositoryImpl(new UserServiceImpl());
  const checkSession = new CheckSessionUseCase(sessionRepository, userRepository);
  const me = await checkSession.execute();
  if (me instanceof DataFailed) throw me.error;
  if (!me.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return me.data;
}

export function useGetMe() {
  const { data, isLoading, error } = useSWR("get-me", GetMeFetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    me: data,
    loading: isLoading,
    error: error,
  };
}
