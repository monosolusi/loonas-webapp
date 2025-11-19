"use client";

import Image from "next/image";
import React from "react";
import { TextInput } from "@/core/presentations/components/text-input";
import { PasswordInput } from "@/core/presentations/components/password-input";
import { PrimaryButton } from "@/core/presentations/components/primary-button";
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

// "use client";
//
// import React from "react";
// import { EmailInput } from "@/core/presentations/components/email-input";
// import { PasswordInput } from "@/core/presentations/components/password-input";
// import { useSignInProvider } from "@/features/authentication/presentation/providers/sign-in";
// import { FilledButton } from "@/core/presentations/components/filled-button";
// import Link from "next/link";
//
// export function CredentialForm() {
//   const { email, password, setEmail, setPassword, login, loading } = useSignInProvider();
//
//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (!loading) login?.();
//   }
//
//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <EmailInput value={email} onChange={setEmail} required />
//       <PasswordInput value={password} onChange={setPassword} />
//
//       <div className="flex items-center justify-between">
//         <div className="text-sm/6">
//           <Link href="/reset-password" className="font-semibold text-primary-600 hover:text-primary-500">
//             Lupa Kata Sandi?
//           </Link>
//         </div>
//       </div>
//
//       <FilledButton loading={loading}>Masuk</FilledButton>
//     </form>
//   );
// }
