"use client";

import React, { useMemo } from "react";
import { isValidEmail, isValidPassword } from "@/core/utilities/validation-patterns";
import { useSignUpAndSignIn } from "@/features/user/presentation/hooks/use-sign-up-and-sign-in";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useGetMe } from "@/features/user/presentation/hooks/use-get-me";

type CreateUserContextProps = {
  email: string;
  password: string;
  repeatPassword: string;
  isClean: boolean;
  isCreating: boolean;
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
  emailError: null,
  passwordError: null,
  repeatPasswordError: null,
});

export function CreateUserProvider(props: CreateUserProviderProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [repeatPassword, setRepeatPassword] = React.useState<string>("");
  const { trigger, isMutating, error } = useSignUpAndSignIn();
  const { me, loading: isLoadingMe } = useGetMe();

  const emailError = useMemo(() => {
    if (error instanceof ServerError) return error.message;
    if (!email) return null;
    return isValidEmail(email) ? null : "Email tidak valid";
  }, [email, error]);

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

  const createUser = async () => {
    if (!isClean || isLoadingMe) throw new ServerError(ErrorCodes.VALIDATION_FAILED);

    // Check if the user already logged in. If so, we will redirect to the home page directly
    if (me) throw new ServerError(ErrorCodes.USER_SIGNED_IN);

    await trigger({ email, password });
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
        isCreating: isMutating,
      }}
    >
      {props.children}
    </CreateUserContext.Provider>
  );
}

export function useCreateUser() {
  return React.useContext(CreateUserContext);
}
