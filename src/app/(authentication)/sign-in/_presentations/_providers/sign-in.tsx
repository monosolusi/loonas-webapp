"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import { UserSignInUseCase, UserSignInUseCaseParams } from "@/app/(authentication)/_domain/_usecases/user-sign-in";
import { AuthRepositoryImpl } from "@/app/(authentication)/_data/_repositories/auth";
import { AuthServiceImpl } from "@/app/(authentication)/_data/_sources/auth";
import { SaveSessionUseCase, SaveSessionUseCaseParams } from "@/app/(authentication)/_domain/_usecases/save-session";
import { SessionRepositoryImpl } from "@/app/(authentication)/_data/_repositories/session";
import { LocalStorageSessionService } from "@/app/(authentication)/_data/_sources/local-storage-session";
import { UserRepositoryImpl } from "@/app/(user)/_data/_repositories/user";
import { UserServiceImpl } from "@/app/(user)/_data/_data/user";
import { useRouter } from "next/navigation";
import { CheckSessionUseCase } from "@/app/(authentication)/_domain/_usecases/check-session";

type SignInContextProps = {
  email: string;
  password: string;
  loading: boolean;
  showInvalidCred: boolean;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  login?: () => Promise<void>;
}

const SignInContext = createContext<SignInContextProps>({
  email: "",
  password: "",
  loading: true,
  showInvalidCred: false
});

export function SignInProvider({ children }: { children: any }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showInvalidCred, setShowInvalidCred] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      if (error instanceof ServerError) {
        if (error.code === ErrorCodes.FORBIDDEN.code) setShowInvalidCred(true);
        else if (error.code === ErrorCodes.NO_VALID_SESSION.code) console.log("No valid session");
      } else throw error;
    }
  }, [error]);

  useEffect(() => {
    checkSession();
  }, []);

  function checkCleanInput() {
    if (email === "") return false;
    if (password === "") return false;
    if (password.length < 8) return false;

    // Lastly check the email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function checkSession(): Promise<void> {
    try {
      setLoading(true);

      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const userService = new UserServiceImpl();
      const userRepository = new UserRepositoryImpl(userService);
      const checkSession = new CheckSessionUseCase(sessionRepository, userRepository);
      const me = await checkSession.execute();
      if (me instanceof DataFailed) throw me.error;

      // We have a valid access token and session, we can redirect to protected page
      router.replace("/invoices");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    try {
      setLoading(true);
      const isClean = checkCleanInput();
      if (!isClean) throw new ServerError(ErrorCodes.VALIDATION_FAILED);

      const authService = new AuthServiceImpl();
      const authRepository = new AuthRepositoryImpl(authService);
      const useCase = new UserSignInUseCase(authRepository);
      const params = new UserSignInUseCaseParams(email, password);
      const result = await useCase.execute(params);
      if (result instanceof DataFailed) throw result.error;
      if (result.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // This time, the login success, and we will save the session to the local storage for easy access
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const saveSession = new SaveSessionUseCase(sessionRepository);
      const saveSessionParams = new SaveSessionUseCaseParams(result.data.accessToken);
      const savedSession = await saveSession.execute(saveSessionParams);
      if (savedSession instanceof DataFailed) throw savedSession.error;

      router.replace("/invoices");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SignInContext.Provider
      value={{ email, password, loading, setEmail, setPassword, login, showInvalidCred }}
    >
      {children}
    </SignInContext.Provider>
  );
}

export function useSignInProvider() {
  return useContext(SignInContext);
}