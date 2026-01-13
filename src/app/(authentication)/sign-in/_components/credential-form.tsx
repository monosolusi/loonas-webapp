"use client";

import Image from "next/image";
import React from "react";
import { TextInput } from "@/core/presentations/components/text-input";
import { PasswordInput } from "@/core/presentations/components/password-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useSignInProvider } from "@/features/authentication/presentation/providers/sign-in";

export function CredentialForm() {
  const { email, password, setEmail, setPassword, login, loading } = useSignInProvider();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading) login?.();
  };

  return (
    <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit}>
      {/* Email Input*/}
      <TextInput
        label="Email"
        type="email"
        placeholder="Masukan email Anda"
        leftIcon={<Image src="/assets/images/email-icon-w20-h20.svg" alt="Email Icon" width={20} height={20} />}
        value={email}
        onChange={setEmail}
        required
      />

      {/* Password Input */}
      <PasswordInput value={password} onChange={setPassword} required />

      {/*  Forget Password */}
      <div className="flex flex-row-reverse">
        <span className="text-primary-300 cursor-pointer text-base">Lupa kata sandi?</span>
      </div>

      {/*  Sign In Button - Primary Button */}
      <PrimaryButton type="submit" label="Masuk" loading={loading} />
    </form>
  );
}
