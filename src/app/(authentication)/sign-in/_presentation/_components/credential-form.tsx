"use client";

import React from "react";
import { EmailInput } from "@/core/presentations/components/email-input";
import { PasswordInput } from "@/app/(authentication)/sign-in/_presentation/_components/password-input";
import { useSignInProvider } from "@/app/(authentication)/sign-in/_presentation/_providers/sign-in";
import { SubmitButton } from "@/core/presentations/components/submit-button";
import Link from "next/link";

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
          <Link href="/reset-password" className="font-semibold text-primary-600 hover:text-primary-500">
            Lupa Kata Sandi?
          </Link>
        </div>
      </div>

      <SubmitButton loading={loading}>Masuk</SubmitButton>
    </form>
  );
}