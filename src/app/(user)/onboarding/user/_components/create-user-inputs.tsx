"use client";

import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import Image from "next/image";
import { PasswordInput } from "@/core/presentations/components/text-inputs/password-input";
import React from "react";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";

export function CreateUserInputs() {
  const {
    email,
    password,
    repeatPassword,
    setEmail,
    setPassword,
    setRepeatPassword,
    emailError,
    passwordError,
    repeatPasswordError,
    status,
  } = useCreateUser();

  // Nothing typed mid-flight is sent — an editable field would be misleading. Covers "succeeded"
  // too: the button is still locked and spinning while the redirect lands, so the fields must not
  // quietly become editable again in that window.
  const disabled = status === "submitting" || status === "succeeded";

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Email Input */}
      <TextInput
        label="Email"
        type="email"
        placeholder="Masukan email Anda"
        description="Gunakan email aktif untuk verifikasi akun"
        leftIcon={<Image src="/assets/images/email-icon-w20-h20.svg" alt="Email Icon" width={20} height={20} />}
        value={email}
        onChange={setEmail}
        error={emailError}
        disabled={disabled}
      />

      {/* Password Input */}
      <PasswordInput
        label="Kata Sandi"
        description="Kombinasi huruf besar, kecil, angka dan simbol"
        value={password}
        onChange={setPassword}
        error={passwordError}
        disabled={disabled}
      />

      {/*  Re-enter Password Input */}
      <PasswordInput
        label="Ulangi Kata Sandi"
        value={repeatPassword}
        onChange={setRepeatPassword}
        error={repeatPasswordError}
        disabled={disabled}
      />
    </div>
  );
}
