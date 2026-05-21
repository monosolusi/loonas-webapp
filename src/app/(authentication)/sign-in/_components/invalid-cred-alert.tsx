"use client";

import { SignInError, useSignInProvider } from "@/features/authentication/presentation/providers/sign-in";
import Image from "next/image";

const COPY: Record<NonNullable<SignInError>, string> = {
  wrong_credentials: "Email atau kata sandi salah. Silakan periksa kembali dan coba lagi.",
  too_many_requests: "Terlalu banyak percobaan masuk. Silakan tunggu beberapa saat, lalu coba lagi.",
  network: "Gagal terhubung ke server. Periksa koneksi internet Anda, lalu coba lagi.",
  fallback: "Terjadi kesalahan. Silakan coba lagi atau hubungi support jika masalah berlanjut.",
};

export function InvalidCredAlert() {
  const { signInError } = useSignInProvider();

  if (signInError === null) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="bg-error-50 border-error-100 mt-8 flex flex-row gap-3 rounded-lg border p-4"
    >
      <Image
        src="/assets/images/exclamation-circle-w20-h20.svg"
        alt=""
        aria-hidden="true"
        width={20}
        height={20}
      />
      <span className="text-error-500 text-base">{COPY[signInError]}</span>
    </div>
  );
}
