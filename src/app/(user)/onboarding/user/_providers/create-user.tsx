"use client";

import React, { useMemo } from "react";
import { isValidEmail, isValidPassword } from "@/core/utilities/validation-patterns";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useGetMe } from "@/features/user/presentation/hooks/use-get-me";
import { useAuth, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

type CreateUserContextProps = {
  email: string;
  password: string;
  repeatPassword: string;
  isClean: boolean;
  isCreating: boolean;
  isReady: boolean;
  isSignedIn: boolean;
  emailError: string | null;
  passwordError: string | null;
  repeatPasswordError: string | null;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  setRepeatPassword?: React.Dispatch<React.SetStateAction<string>>;
  createUser?: () => Promise<void>;
};

type CreateUserProviderProps = {
  children: React.ReactNode;
};

const CreateUserContext = React.createContext<CreateUserContextProps>({
  email: "",
  password: "",
  repeatPassword: "",
  isClean: true,
  isCreating: false,
  isReady: false,
  isSignedIn: false,
  emailError: null,
  passwordError: null,
  repeatPasswordError: null,
});

export function CreateUserProvider(props: CreateUserProviderProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [repeatPassword, setRepeatPassword] = React.useState<string>("");
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const { me, loading: isLoadingMe } = useGetMe();

  const emailError = useMemo(() => {
    if (email) return isValidEmail(email) ? null : "Email tidak valid";
    return null;
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return null;
    return isValidPassword(password) ? null : "Kata sandi harus mengandung huruf besar, kecil, angka dan simbol";
  }, [password]);

  const repeatPasswordError = useMemo(() => {
    if (!repeatPassword) return null;
    return password === repeatPassword ? null : "Kata sandi tidak cocok";
  }, [password, repeatPassword]);

  const isClean = useMemo(
    () => isValidEmail(email) && isValidPassword(password) && password === repeatPassword,
    [email, password, repeatPassword],
  );

  // Single source of truth for "ready to submit" — derived from the same `useSignUp()` instance
  // `createUser()` uses below, plus the `useGetMe()` loading flag. Consumers (e.g. the submit
  // button) must read this instead of calling `useAuth().isLoaded` themselves, which can resolve
  // at a different time and disagree with this provider.
  const isReady = useMemo(() => isLoaded && !isLoadingMe, [isLoaded, isLoadingMe]);

  const createUser = async () => {
    try {
      setIsCreating(true);
      // Intentionally re-derives from the same source flags as `isReady` above, rather than
      // reading `isReady` itself — each check here needs its own distinct `ServerError` code,
      // which one collapsed boolean can't carry. If `isReady` ever gains another dependency,
      // add a matching branch here too.
      if (!isClean || isLoadingMe) throw new ServerError(ErrorCodes.VALIDATION_FAILED);
      if (!isLoaded) throw new ServerError(ErrorCodes.AUTH_NOT_READY);
      if (isSignedIn) throw new ServerError(ErrorCodes.USER_SIGNED_IN);

      // Check if the user already logged in. If so, we will redirect to the home page directly
      // TODO: Change this to use clerk
      if (me) throw new ServerError(ErrorCodes.USER_SIGNED_IN);

      const resource = await signUp.create({ emailAddress: email, password });
      if (resource.status === "complete") await setActive({ session: resource.createdSessionId });
      else throw new ServerError(ErrorCodes.UNKNOWN, { message: resource.status });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      if (isClerkAPIResponseError(err)) {
        // User-visible copy is unchanged (still `err.message`) — the Clerk error code is kept in
        // `details` only, for logging, not surfaced.
        throw new ServerError(ErrorCodes.UNKNOWN, { message: err.message, clerkErrorCode: err.errors[0]?.code });
      }
      console.error(err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <CreateUserContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        repeatPassword,
        setRepeatPassword,
        isClean,
        emailError,
        passwordError,
        repeatPasswordError,
        createUser,
        isCreating,
        isReady,
        isSignedIn: !!isSignedIn,
      }}
    >
      {props.children}
    </CreateUserContext.Provider>
  );
}

export function useCreateUser() {
  return React.useContext(CreateUserContext);
}
