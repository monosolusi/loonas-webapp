"use client";

import React from "react";
import { EmailInput } from "@/core/presentations/components/email-input";
import { PasswordInput } from "@/core/presentations/components/password-input";
import { useSignInProvider } from "@/features/authentication/presentation/providers/sign-in";
import { FilledButton } from "@/core/presentations/components/filled-button";
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

      <FilledButton loading={loading}>Masuk</FilledButton>
    </form>
  );
}