"use client";

import { XCircleIcon } from "@heroicons/react/20/solid";
import { useSignInProvider } from "@/features/authentication/presentation/providers/sign-in";

export function InvalidCredAlert() {
  const { showInvalidCred } = useSignInProvider();

  if (!showInvalidCred) return <></>;
  return (
    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">Oops! Email atau password-nya nggak cocok nih. Coba lagi ya!</p>
          </div>
        </div>
      </div>
    </div>
  );
}