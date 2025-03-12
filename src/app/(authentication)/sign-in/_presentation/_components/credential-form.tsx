"use client";

import React from "react";
import { EmailInput } from "@/app/(authentication)/sign-in/_presentation/_components/email-input";
import { PasswordInput } from "@/app/(authentication)/sign-in/_presentation/_components/password-input";
import { useSignInProvider } from "@/app/(authentication)/sign-in/_presentation/_providers/sign-in";
import { SubmitButton } from "@/core/presentations/submit-button";

export function CredentialForm() {
  const { email, password, setEmail, setPassword, login, loading } = useSignInProvider();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loading) login?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EmailInput value={email} onChange={setEmail} />
      <PasswordInput value={password} onChange={setPassword} />

      <div className="flex items-center justify-between">
        <div className="text-sm/6">
          <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
            Lupa Kata Sandi?
          </a>
        </div>
      </div>

      <SubmitButton loading={loading}>Masuk</SubmitButton>
    </form>
  );
}