"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { EmailInput } from "@/core/presentations/components/text-inputs/email-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { FeatureItem } from "@/app/(authentication)/sign-in/_components/feature-item";
import { RegisterButton } from "@/app/(authentication)/sign-in/_components/register-button";
import { useSendPasswordResetEmail } from "@/features/authentication/presentation/hooks/use-send-password-reset-email";

export default function ForgetPasswordPage() {
  const { state, submit, cooldownSeconds } = useSendPasswordResetEmail();
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(email);
  };

  const buttonLabel = cooldownSeconds > 0 ? `Kirim Ulang (${cooldownSeconds}d)` : "Kirim Tautan Reset";

  return (
    <div className="flex h-full flex-row">
      <div className="flex w-1/2 flex-col justify-center px-24">
        <Image src="/assets/images/logo-w165-h48.png" alt="Loonas Logo" width={165} height={48} />
        <div className="mt-10 flex flex-col gap-2">
          <span className="text-base">Lupa kata sandi?</span>
          <span className="text-base">Masukkan email Anda untuk menerima tautan reset kata sandi.</span>
        </div>
        {state.success && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-green-500" />
            <span className="text-sm text-green-700">
              Jika email Anda terdaftar, kami telah mengirimkan tautan untuk mengatur ulang kata sandi. Silakan cek
              inbox dan folder spam Anda.
            </span>
          </div>
        )}
        <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit}>
          <EmailInput label="Email" placeholder="Masukan email Anda" value={email} onChange={setEmail} required />
          <PrimaryButton
            type="submit"
            label={buttonLabel}
            loading={state.loading}
            disabled={cooldownSeconds > 0}
          />
        </form>
        <div className="mt-6 text-center">
          <Link href="/sign-in" className="text-primary-300 text-base hover:underline">
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
      <div className="hidden w-1/2 flex-col items-center justify-center p-12 md:flex">
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
    </div>
  );
}
