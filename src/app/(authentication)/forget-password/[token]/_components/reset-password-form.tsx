"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PasswordInput } from "@/core/presentations/components/text-inputs/password-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { FeatureItem } from "@/app/(authentication)/sign-in/_components/feature-item";
import { RegisterButton } from "@/app/(authentication)/sign-in/_components/register-button";
import { AuthServiceImpl } from "@/features/authentication/data/sources/auth";
import { AuthRepositoryImpl } from "@/features/authentication/data/repositories/auth";
import {
  VerifyResetTokenUseCase,
  VerifyResetTokenUseCaseParams,
} from "@/features/authentication/domain/usecases/verify-reset-token";
import {
  SubmitNewPasswordUseCase,
  SubmitNewPasswordUseCaseParams,
} from "@/features/authentication/domain/usecases/submit-new-password";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { isValidPassword } from "@/core/utilities/validation-patterns";

type TokenStatus = "loading" | "valid" | "invalid";

export function ResetPasswordForm({ resetToken }: { resetToken: string }) {
  const router = useRouter();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("loading");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ServerError | null>(null);

  useEffect(() => {
    async function verifyToken() {
      const authService = new AuthServiceImpl();
      const authRepository = new AuthRepositoryImpl(authService);
      const useCase = new VerifyResetTokenUseCase(authRepository);
      const result = await useCase.execute(new VerifyResetTokenUseCaseParams(resetToken));

      if (result instanceof DataFailed) {
        setTokenStatus("invalid");
        return;
      }

      setTokenStatus("valid");
    }

    verifyToken();
  }, [resetToken]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError(new ServerError(ErrorCodes.INVALID_RE_PASSWORD));
      return;
    }

    if (password.trim() === "") {
      setError(new ServerError(ErrorCodes.EMPTY_PASSWORD));
      return;
    }

    if (!isValidPassword(password)) {
      setError(new ServerError(ErrorCodes.INVALID_PASSWORD));
      return;
    }

    try {
      setLoading(true);
      const authService = new AuthServiceImpl();
      const authRepository = new AuthRepositoryImpl(authService);
      const useCase = new SubmitNewPasswordUseCase(authRepository);
      const result = await useCase.execute(new SubmitNewPasswordUseCaseParams(resetToken, password));

      if (result instanceof DataFailed) {
        setError(result.error as ServerError);
        return;
      }

      router.replace("/forget-password/completed");
    } catch (err) {
      setError(err instanceof ServerError ? err : new ServerError(ErrorCodes.UNKNOWN));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-row">
      <div className="flex w-full flex-col justify-center px-6 lg:w-1/2 lg:px-24">
        <Image src="/assets/images/logo-w165-h48.png" alt="Loonas Logo" width={165} height={48} />
        {tokenStatus === "loading" && <TokenLoadingState />}
        {tokenStatus === "invalid" && <TokenInvalidState />}
        {tokenStatus === "valid" && (
          <PasswordForm
            password={password}
            repeatPassword={repeatPassword}
            onPasswordChange={setPassword}
            onRepeatPasswordChange={setRepeatPassword}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}
      </div>
      <HeroPanel />
    </div>
  );
}

function TokenLoadingState() {
  return (
    <div className="mt-10 flex flex-col gap-2">
      <div className="h-6 w-48 animate-pulse rounded bg-neutral-200" />
      <div className="h-5 w-72 animate-pulse rounded bg-neutral-200" />
    </div>
  );
}

function TokenInvalidState() {
  return (
    <>
      <div className="mt-10 flex flex-col gap-2">
        <span className="text-base font-medium text-red-600">Tautan Tidak Valid</span>
        <span className="text-base text-neutral-600">
          Tautan reset kata sandi sudah kedaluwarsa atau tidak valid. Silakan minta tautan baru.
        </span>
      </div>
      <div className="mt-8">
        <Link
          href="/forget-password"
          className="bg-primary-300 hover:bg-primary-300/90 inline-block rounded-lg px-6 py-3 text-base font-medium text-white transition-colors duration-200"
        >
          Minta Tautan Baru
        </Link>
      </div>
    </>
  );
}

type PasswordFormProps = {
  password: string;
  repeatPassword: string;
  onPasswordChange: (value: string) => void;
  onRepeatPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: ServerError | null;
};

function PasswordForm({
  password,
  repeatPassword,
  onPasswordChange,
  onRepeatPasswordChange,
  onSubmit,
  loading,
  error,
}: PasswordFormProps) {
  return (
    <>
      <div className="mt-10 flex flex-col gap-2">
        <span className="text-base">Buat Kata Sandi Baru</span>
        <span className="text-base text-neutral-600">
          Masukkan kata sandi baru untuk akun Anda. Minimal 8 karakter dengan huruf besar, angka, dan simbol.
        </span>
      </div>
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <span className="text-sm text-red-600">{error.message}</span>
        </div>
      )}
      <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit}>
        <PasswordInput value={password} onChange={onPasswordChange} label="Kata Sandi Baru" />
        <PasswordInput value={repeatPassword} onChange={onRepeatPasswordChange} label="Ulangi Kata Sandi" />
        <PrimaryButton type="submit" label="Ubah Kata Sandi" loading={loading} />
      </form>
      <div className="mt-6 text-center">
        <Link href="/sign-in" className="text-primary-300 text-base hover:underline">
          Kembali ke halaman masuk
        </Link>
      </div>
    </>
  );
}

function HeroPanel() {
  return (
    <div className="hidden w-1/2 flex-col items-center justify-center p-12 lg:flex">
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
        <Image
          src="/assets/images/hero-w544-h624.png"
          alt="Hero Image"
          width={544}
          height={624}
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-black/0" />
        <div className="relative z-20 flex h-full flex-col items-start justify-between p-10">
          <div className="flex flex-1 flex-col items-start gap-6">
            <div className="rounded-full border border-white/20 bg-white/20 px-4 py-2.5 text-base text-white">
              ✨ Platform Bisnis Modern
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xl font-medium text-white">Kelola Bisnis Anda dengan Lebih Efisien</span>
              <span className="text-base text-white/90">
                Solusi terpadu untuk operasional, inventori, dan keuangan dalam satu platform
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <FeatureItem iconPath="/assets/images/analytic-icon-w16-h16.svg" label="Pantau pertumbuhan real-time" />
              <FeatureItem iconPath="/assets/images/shield-icon-w16-h16.svg" label="Keamanan data terjamin" />
              <FeatureItem iconPath="/assets/images/thunder-icon-w16-h16.svg" label="Otomasi proses bisnis" />
            </div>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col items-start gap-1">
              <span className="text-lg font-medium text-white">Belum punya akun?</span>
              <span className="text-base text-white/80">Daftar dan mulai kelola bisnis Anda</span>
            </div>
            <div className="flex flex-1 flex-row">
              <RegisterButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
