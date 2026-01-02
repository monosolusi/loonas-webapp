import useSWRMutation from "swr/mutation";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { UserSignOutUseCase } from "@/features/authentication/domain/usecases/user-sign-out";
import { DataFailed } from "@/core/resources/data-state";

type SignOutFetcherParams = { arg?: {} };

async function SignOutFetcher(_: string, { arg }: SignOutFetcherParams) {
  const sessionRepository = new SessionRepositoryImpl(new LocalStorageSessionService());
  const signOut = new UserSignOutUseCase(sessionRepository);
  const result = await signOut.execute();
  if (result instanceof DataFailed) throw result.error;
  return;
}

export function useSignOut() {
  return useSWRMutation("sign-out", SignOutFetcher);
}
