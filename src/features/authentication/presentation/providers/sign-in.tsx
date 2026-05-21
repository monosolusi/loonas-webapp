"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";

export type SignInError =
  | "wrong_credentials"
  | "too_many_requests"
  | "network"
  | "fallback"
  | null;

function classifyClerkError(err: unknown): SignInError {
  if (err instanceof TypeError) return "network";
  const clerkErr = (err as any)?.errors?.[0];
  if (!clerkErr) return "network";
  switch (clerkErr.code) {
    case "form_password_incorrect":
    case "form_identifier_not_found":
      return "wrong_credentials";
    case "too_many_requests":
    case "user_locked":
      return "too_many_requests";
    default:
      return "fallback";
  }
}

type SignInContextProps = {
  email: string;
  password: string;
  loading: boolean;
  signInError: SignInError;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  login?: () => Promise<void>;
};

const SignInContext = createContext<SignInContextProps>({
  email: "",
  password: "",
  loading: true,
  signInError: null,
  setEmail: () => {},
  setPassword: () => {},
});

export function SignInProvider({ children }: { children: any }) {
  const [email, setEmailRaw] = useState<string>("");
  const [password, setPasswordRaw] = useState<string>("");
  const [isLogginIn, setIsLoggingIn] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<SignInError>(null);
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? "/home";

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) router.replace(redirectUrl);
  }, [isLoaded, isSignedIn]);

  function setEmail(value: string) {
    setSignInError(null);
    setEmailRaw(value);
  }

  function setPassword(value: string) {
    setSignInError(null);
    setPasswordRaw(value);
  }

  function checkCleanInput() {
    if (email === "") return false;
    if (password === "") return false;
    if (password.length < 8) return false;

    // Lastly check the email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function login() {
    try {
      setIsLoggingIn(true);
      setSignInError(null);
      const isClean = checkCleanInput();
      if (!isClean) throw new ServerError(ErrorCodes.VALIDATION_FAILED);
      if (!isLoaded || !signIn || !setActive) {
        console.warn("[sign-in]", { signInError: "network", clerkCode: "clerk_not_loaded" });
        setSignInError("network");
        setIsLoggingIn(false);
        return;
      }

      const { createdSessionId } = await signIn.create({
        strategy: "password",
        identifier: email,
        password: password,
      });

      if (!createdSessionId) {
        console.warn("[sign-in]", { signInError: "network", clerkCode: "no_session_id" });
        setSignInError("network");
        setIsLoggingIn(false);
        return;
      }

      await setActive({ session: createdSessionId, redirectUrl });
    } catch (err: unknown) {
      setIsLoggingIn(false);

      if (err instanceof ServerError && err.code === ErrorCodes.VALIDATION_FAILED.code) {
        setSignInError("wrong_credentials");
        return;
      }

      const classified = classifyClerkError(err);
      const clerkCode = (err as any)?.errors?.[0]?.code ?? null;
      console.warn("[sign-in]", { signInError: classified, clerkCode });
      setSignInError(classified);
    }
  }

  const isLoading = useMemo(() => {
    return isLogginIn || !isLoaded;
  }, [isLoaded, isLogginIn]);

  return (
    <SignInContext.Provider
      value={{ email, password, loading: isLoading, setEmail, setPassword, login, signInError }}
    >
      {children}
    </SignInContext.Provider>
  );
}

export function useSignInProvider() {
  return useContext(SignInContext);
}
