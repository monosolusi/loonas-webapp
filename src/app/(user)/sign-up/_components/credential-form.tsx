"use client";

import React from "react";
import { PasswordInput } from "./password-input";
import { useSignUpProvider } from "@/features/user/presentation/providers/sign-up";
import { EmailInput } from "@/core/presentations/components/email-input";
import { SubmitButton } from "@/core/presentations/components/submit-button";
import { AgreementCheckbox } from "@/app/(user)/sign-up/_components/agreement-checkbox";

export function CredentialForm() {
  const {
    email,
    password,
    rePassword,
    loading,
    agree,
    setAgree,
    setEmail,
    setPassword,
    setRePassword,
    signUp
  } = useSignUpProvider();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loading) signUp?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EmailInput value={email} onChange={setEmail} />
      <PasswordInput value={password} onChange={setPassword} />
      <PasswordInput label="Ulangi Kata Sandi" value={rePassword} onChange={setRePassword} />

      <AgreementCheckbox checked={agree} onChange={setAgree} />

      <SubmitButton loading={loading} type="submit">
        Daftar
      </SubmitButton>
    </form>
  );
}