import useSWRMutation from "swr/mutation";
import { UserRepositoryImpl } from "@/features/user/data/repositories/user";
import { UserServiceImpl } from "@/features/user/data/sources/user";
import { UserSignUpUseCase, UserSignUpUseCaseParams } from "@/features/user/domain/usecases/sign-up";
import { DataFailed } from "@/core/resources/data-state";
import { AuthRepositoryImpl } from "@/features/authentication/data/repositories/auth";
import { AuthServiceImpl } from "@/features/authentication/data/sources/auth";
import { UserSignInUseCase, UserSignInUseCaseParams } from "@/features/authentication/domain/usecases/user-sign-in";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SaveSessionUseCase, SaveSessionUseCaseParams } from "@/features/authentication/domain/usecases/save-session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { HttpRequest } from "@/core/helpers/http-request";

type SignUpAndSignIneFetcherParams = {
  arg: {
    email: string;
    password: string;
  };
};

async function SignUpAndSignInFetcher(_: string, { arg }: SignUpAndSignIneFetcherParams) {
  const userRepository = new UserRepositoryImpl(new UserServiceImpl(new HttpRequest()));
  const signUp = new UserSignUpUseCase(userRepository);
  const signUpParams = new UserSignUpUseCaseParams(arg.email, arg.password);
  const signUpResult = await signUp.execute(signUpParams);
  if (signUpResult instanceof DataFailed) throw signUpResult.error;

  // Sign up is successful. Now we need to automatically log in to the account
  // instead of showing a login screen
  const authRepository = new AuthRepositoryImpl(new AuthServiceImpl());
  const signIn = new UserSignInUseCase(authRepository);
  const signInParams = new UserSignInUseCaseParams(arg.email, arg.password);
  const session = await signIn.execute(signInParams);
  if (session instanceof DataFailed) throw session.error;
  if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  // Save the login session to the local storage for easy access
  const sessionRepository = new SessionRepositoryImpl(new LocalStorageSessionService());
  const saveSession = new SaveSessionUseCase(sessionRepository);
  const saveSessionParams = new SaveSessionUseCaseParams(session.data.accessToken);
  const saveSessionResult = await saveSession.execute(saveSessionParams);
  if (saveSessionResult instanceof DataFailed) throw saveSessionResult.error;
}

export function useSignUpAndSignIn() {
  return useSWRMutation("sign-in-and-sign-up", SignUpAndSignInFetcher);
}
