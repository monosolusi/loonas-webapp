/**
 * This component is not using provider because we only handle one input here which is email.
 * In the future, you might need to change this to handle provider, you can take a look on other
 * pages such as sign-in or sign-up
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EmailInput } from "@/core/presentations/components/email-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import { useRouter } from "next/navigation";
import {
  SendPasswordResetEmailUseCase,
  SendPasswordResetEmailUseCaseParams
} from "../../../features/authentication/domain/usecases/send-password-reset-email";
import { AuthServiceImpl } from "@/features/authentication/data/sources/auth";
import { AuthRepositoryImpl } from "@/features/authentication/data/repositories/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!emailRegex.test(email)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const authService = new AuthServiceImpl();
      const authRepository = new AuthRepositoryImpl(authService);
      const sendEmail = new SendPasswordResetEmailUseCase(authRepository);
      const sendEmailParams = new SendPasswordResetEmailUseCaseParams(email);
      const response = await sendEmail.execute(sendEmailParams);
      if (response instanceof DataFailed) throw response.error;
      router.replace("/reset-password/success");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Loonas"
          src="https://res.cloudinary.com/monosolusi/image/upload/v1740993366/loonas/web-assets/loonas-logo_rspb5c.svg"
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Bikin Password Baru!
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <EmailInput value={email} onChange={setEmail} required />
            <FilledButton loading={loading}>Verifikasi Email</FilledButton>
          </form>
        </div>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Berubah Pikiran?{" "}
          <Link href="/sign-in" className="font-semibold text-primary-600 hover:text-primary-500">
            Coba Masuk Lagi
          </Link>
        </p>
      </div>
    </>
  );
}