"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";

type SignInContextProps = {
  email: string;
  password: string;
  loading: boolean;
  showInvalidCred: boolean;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  login?: () => Promise<void>;
};

const SignInContext = createContext<SignInContextProps>({
  email: "",
  password: "",
  loading: true,
  showInvalidCred: false,
});

export function SignInProvider({ children }: { children: any }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogginIn, setIsLoggingIn] = useState<boolean>(false);
  const [showInvalidCred, setShowInvalidCred] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, setActive } = useSignIn();
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
    if (!isLoaded) return;
    if (isSignedIn) router.replace("/home");
  }, [isLoaded, isSignedIn]);

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
      const isClean = checkCleanInput();
      if (!isClean) throw new ServerError(ErrorCodes.VALIDATION_FAILED);
      if (!isLoaded || !signIn || !setActive) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

      const { createdSessionId } = await signIn.create({
        strategy: "password",
        identifier: email,
        password: password,
      });

      if (!createdSessionId) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
      await setActive({ session: createdSessionId, redirectUrl: "/home" });
    } catch (err: any) {
      setError(err);
      setIsLoggingIn(false);
    }
  }

  const isLoading = useMemo(() => {
    return isLogginIn || !isLoaded;
  }, [isLoaded, isLogginIn]);

  return (
    <SignInContext.Provider
      value={{ email, password, loading: isLoading, setEmail, setPassword, login, showInvalidCred }}
    >
      {children}
    </SignInContext.Provider>
  );
}

export function useSignInProvider() {
  return useContext(SignInContext);
}
