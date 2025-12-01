import { StepIndicatorWithTime } from "@/app/(user)/onboarding/_components/step-indicator-with-time";
import Image from "next/image";
import React from "react";
import { StepHeader } from "@/app/(user)/onboarding/_components/step-header";
import { CreateUserButton } from "@/app/(user)/onboarding/user/_components/create-user-button";
import { CreateUserProvider } from "@/app/(user)/onboarding/user/_providers/create-user";
import { CreateUserInputs } from "@/app/(user)/onboarding/user/_components/create-user-inputs";
import { CreateUserForm } from "@/app/(user)/onboarding/user/_components/create-user-form";

export default function UserStepPage() {
  return (
    <CreateUserProvider>
      <div className="flex flex-col items-center justify-center gap-10">
        <StepIndicatorWithTime currentStep={1} totalSteps={4} expectedTime="~1 menit" />
        <StepHeader title="Buat Akun Baru" description="Mari mulai dengan informasi dasar Anda" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-start gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
            <Image
              src="/assets/images/shield-icon-primary-w16-h16.svg"
              alt="Shield Icon"
              width={20}
              height={20}
              className="mt-1"
            />
            <span className="text-sm leading-5 font-normal text-neutral-500/90">
              Data Anda aman dan terenkripsi. Kami tidak akan membagikan informasi pribadi Anda kepada pihak ketiga.
            </span>
          </div>
          <CreateUserForm>
            <CreateUserInputs />
            <CreateUserButton />
          </CreateUserForm>
          <span className="text-center text-xs leading-5 font-normal text-neutral-200">
            Dengan melanjutkan, Anda menyetujui &nbsp;
            <a href="https://loonas.id" className="text-primary-300">
              Syarat & Ketentuan
            </a>
            &nbsp; dan &nbsp;
            <a href="https://loonas.id" className="text-primary-300">
              Kebijakan Privasi
            </a>
            &nbsp;Loonas.
          </span>
        </div>
      </div>
    </CreateUserProvider>
  );
}
