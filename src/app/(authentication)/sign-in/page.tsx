import React from "react";
import { SignInProvider } from "./_presentations/_providers/sign-in";
import { CredentialForm } from "@/app/(authentication)/sign-in/_presentations/_components/credential-form";
import { InvalidCredAlert } from "@/app/(authentication)/sign-in/_presentations/_components/invalid-cred-alert";

export default function SignInPage() {
  return (
    <SignInProvider>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Loonas"
            src="https://res.cloudinary.com/monosolusi/image/upload/v1740993366/loonas/web-assets/loonas-logo_rspb5c.svg"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Masuk ke Akun Kamu
          </h2>
        </div>

        <InvalidCredAlert />

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            <CredentialForm />
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Belum punya akun?{" "}
            <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
              Daftar Sekarang
            </a>
          </p>
        </div>
      </div>
    </SignInProvider>
  );
}