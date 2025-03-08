import Link from "next/link";
import { InvalidCredAlert } from "@/app/(user)/sign-up/_presentation/_components/invalid-cred-alert";
import { CredentialForm } from "@/app/(user)/sign-up/_presentation/_components/credential-form";
import { SignUpProvider } from "@/app/(user)/sign-up/_presentation/_providers/sign-up";

export default function SignUpPage() {
  return (
    <SignUpProvider>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Loonas"
            src="https://res.cloudinary.com/monosolusi/image/upload/v1740993366/loonas/web-assets/loonas-logo_rspb5c.svg"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Bikin Akun Baru
          </h2>
        </div>

        <InvalidCredAlert />

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            <CredentialForm />
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Sudah punya akun?{" "}
            <Link href="/sign-in" className="font-semibold text-primary-600 hover:text-primary-500">
              Masuk Disini
            </Link>
          </p>
        </div>
      </div>
    </SignUpProvider>
  );
}