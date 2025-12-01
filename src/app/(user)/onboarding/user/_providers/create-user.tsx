"use client";

import React, { useMemo } from "react";
import { isValidEmail, isValidPassword } from "@/core/utilities/validation-patterns";

type CreateUserContextProps = {
  email: string;
  password: string;
  repeatPassword: string;
  isClean: boolean;
  emailError: string | null;
  passwordError: string | null;
  repeatPasswordError: string | null;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  setRepeatPassword?: React.Dispatch<React.SetStateAction<string>>;
  createUser?: () => void;
};

type CreateUserProviderProps = {
  children: React.ReactNode;
};

const CreateUserContext = React.createContext<CreateUserContextProps>({
  email: "",
  password: "",
  repeatPassword: "",
  isClean: true,
  emailError: null,
  passwordError: null,
  repeatPasswordError: null,
});

export function CreateUserProvider(props: CreateUserProviderProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [repeatPassword, setRepeatPassword] = React.useState<string>("");

  const emailError = useMemo(() => {
    if (!email) return null;
    return isValidEmail(email) ? null : "Email tidak valid";
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
      }}
    >
      {props.children}
    </CreateUserContext.Provider>
  );
}

export function useCreateUser() {
  return React.useContext(CreateUserContext);
}
