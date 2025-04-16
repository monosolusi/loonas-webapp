"use client";

import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AuthServiceImpl } from "@/features/authentication/data/sources/auth";
import { AuthRepositoryImpl } from "@/features/authentication/data/repositories/auth";
import {
  SubmitNewPasswordUseCase,
  SubmitNewPasswordUseCaseParams
} from "@/features/authentication/domain/usecases/submit-new-password";
import { DataFailed } from "@/core/resources/data-state";
import { PasswordInput } from "@/core/presentations/components/password-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { InvalidCredAlert } from "@/app/(authentication)/reset-password/[id]/_components/invalid-cred-alert";

export function Main({ resetToken }: { resetToken: string }) {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) {
      if (error instanceof ServerError) {
        if (error.code === ErrorCodes.INVALID_RE_PASSWORD.code) setPasswordError(true);
        else if (error.code === ErrorCodes.EMPTY_PASSWORD.code) setPasswordError(true);
        else if (error.code === ErrorCodes.INVALID_PASSWORD.code) setPasswordError(true);
        else throw error;
      } else throw error;
    }
  }, [error]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);

      // Making sure the password match and not empty
      if (password !== repeatPassword) throw new ServerError(ErrorCodes.INVALID_RE_PASSWORD);
      if (password.trim() === "") throw new ServerError(ErrorCodes.EMPTY_PASSWORD);
      if (password.length < 8) throw new ServerError(ErrorCodes.INVALID_PASSWORD);

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
      if (!passwordRegex.test(password)) throw new ServerError(ErrorCodes.INVALID_PASSWORD);

      const authService = new AuthServiceImpl();
      const authRepository = new AuthRepositoryImpl(authService);
      const resetPassword = new SubmitNewPasswordUseCase(authRepository);
      const resetPasswordParams = new SubmitNewPasswordUseCaseParams(resetToken, password);
      const result = await resetPassword.execute(resetPasswordParams);
      if (result instanceof DataFailed) throw result.error;

      router.replace("/reset-password/completed");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        alt="Loonas"
        src="https://res.cloudinary.com/monosolusi/image/upload/v1740993366/loonas/web-assets/loonas-logo_rspb5c.svg"
        className="mx-auto h-12 w-auto"
      />
      <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        Masukan Password Baru Kamu!
      </h2>

      <InvalidCredAlert show={passwordError} error={error} />

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput value={password} onChange={setPassword} />
            <PasswordInput
              id={"repeat-password"}
              value={repeatPassword}
              onChange={setRepeatPassword}
              label={"Ulangi Sandi"}
            />

            <FilledButton loading={loading}>Ubah Password</FilledButton>
          </form>
        </div>
      </div>
    </div>
  );
}