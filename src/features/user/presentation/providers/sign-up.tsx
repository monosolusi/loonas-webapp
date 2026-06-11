"use client";

import React, { useContext, useEffect } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import { AuthServiceImpl } from "@/features/authentication/data/sources/auth";
import { AuthRepositoryImpl } from "@/features/authentication/data/repositories/auth";
import { UserSignInUseCase, UserSignInUseCaseParams } from "@/features/authentication/domain/usecases/user-sign-in";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { SaveSessionUseCase, SaveSessionUseCaseParams } from "@/features/authentication/domain/usecases/save-session";
import { useRouter } from "next/navigation";
import { UserSignUpUseCase, UserSignUpUseCaseParams } from "@/features/user/domain/usecases/sign-up";
import { UserServiceImpl } from "@/features/user/data/sources/user";
import { UserRepositoryImpl } from "@/features/user/data/repositories/user";
import { UserSignOutUseCase } from "@/features/authentication/domain/usecases/user-sign-out";
import { HttpRequest } from "@/core/helpers/http-request";

type SignUpContextProps = {
  email: string;
  password: string;
  rePassword: string;
  loading: boolean;
  showInvalidCred: boolean;
  agree: boolean;
  error?: Error;
  setAgree?: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  setRePassword?: React.Dispatch<React.SetStateAction<string>>;
  signUp?: () => Promise<void>;
};

const SignUpContext = React.createContext<SignUpContextProps>({
  email: "",
  password: "",
  rePassword: "",
  agree: false,
  loading: true,
  showInvalidCred: false,
});

export function SignUpProvider({ children }: { children: any }) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [rePassword, setRePassword] = React.useState<string>("");
  const [agree, setAgree] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error>();
  const [showInvalidCred, setShowInvalidCred] = React.useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      if (error instanceof ServerError) {
        if (error.code === ErrorCodes.INVALID_RE_PASSWORD.code) setShowInvalidCred(true);
        else if (error.code === ErrorCodes.EMPTY_PASSWORD.code) setShowInvalidCred(true);
        else if (error.code === ErrorCodes.INVALID_PASSWORD.code) setShowInvalidCred(true);
        else if (error.code === ErrorCodes.DUPLICATE_ENTRY.code) setShowInvalidCred(true);
        else if (error.code === ErrorCodes.NOT_AGREED.code) setShowInvalidCred(true);
        else throw error;
      } else throw error;
    }
  }, [error]);

  useEffect(() => {
    forceLogOut();
  }, []);

  async function forceLogOut() {
    try {
      setLoading(true);
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const logOut = new UserSignOutUseCase(sessionRepository);
      const result = await logOut.execute();
      if (result instanceof DataFailed) throw result.error;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function signUp() {
    try {
      setLoading(true);
      if (!agree) throw new ServerError(ErrorCodes.NOT_AGREED);

      if (password !== rePassword) throw new ServerError(ErrorCodes.INVALID_RE_PASSWORD);
      if (password.trim() === "") throw new ServerError(ErrorCodes.EMPTY_PASSWORD);
      if (password.length < 8) throw new ServerError(ErrorCodes.INVALID_PASSWORD);

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
      if (!passwordRegex.test(password)) throw new ServerError(ErrorCodes.INVALID_PASSWORD);

      const userService = new UserServiceImpl(new HttpRequest());
      const userRepository = new UserRepositoryImpl(userService);
      const signUp = new UserSignUpUseCase(userRepository);
      const params = new UserSignUpUseCaseParams(email, password);
      const result = await signUp.execute(params);
      if (result instanceof DataFailed) throw result.error;

      // Sign up is successful. Now we need to automatically log in to the account
      // instead of showing a login screen
      const authService = new AuthServiceImpl();
      const authRepository = new AuthRepositoryImpl(authService);
      const login = new UserSignInUseCase(authRepository);
      const loginParams = new UserSignInUseCaseParams(email, password);
      const session = await login.execute(loginParams);
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // Save the login session to the local storage for easy access
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const saveSession = new SaveSessionUseCase(sessionRepository);
      const saveSessionParams = new SaveSessionUseCaseParams(session.data.accessToken);
      const savedSession = await saveSession.execute(saveSessionParams);
      if (savedSession instanceof DataFailed) throw savedSession.error;

      router.replace("/home");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SignUpContext.Provider
      value={{
        error,
        email,
        password,
        rePassword,
        agree,
        loading,
        showInvalidCred,
        setAgree,
        setEmail,
        setPassword,
        setRePassword,
        signUp,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}

export function useSignUpProvider() {
  return useContext(SignUpContext);
}
