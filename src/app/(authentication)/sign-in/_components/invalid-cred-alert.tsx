"use client";

import { useSignInProvider } from "@/features/authentication/presentation/providers/sign-in";
import Image from "next/image";

export function InvalidCredAlert() {
  const { showInvalidCred } = useSignInProvider();

  if (!showInvalidCred) return <></>;
  return (
    <div className="bg-error-50 border-error-100 mt-8 flex flex-row gap-3 rounded-lg border p-4">
      <Image src="/assets/images/exclamation-circle-w20-h20.svg" alt="Exclamation Icon" width={20} height={20} />
      <span className="text-error-500 text-base">Email atau kata sandi salah. Silakan coba lagi.</span>
    </div>
  );
}
