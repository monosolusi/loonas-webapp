import { StepIndicatorWithTime } from "@/app/(user)/onboarding-new-user/_components/step-indicator-with-time";
import Image from "next/image";
import { TextInput } from "@/core/presentations/components/text-input";
import { PasswordInput } from "@/core/presentations/components/password-input";
import { PrimaryButton } from "@/core/presentations/components/primary-button";
import React from "react";

export default function UserStepPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <StepIndicatorWithTime currentStep={1} totalSteps={4} expectedTime="~1 menit" />
      <div className="flex flex-col items-center gap-3">
        <span className="text-3xl leading-10 font-semibold tracking-tight text-neutral-500">Buat akun baru</span>
        <span className="text-base leading-6 font-normal text-neutral-200">Mari mulai dengan informasi dasar Anda</span>
      </div>
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
        <div className="flex w-full flex-col gap-4">
          {/* Email Input */}
          <TextInput
            label="Email"
            type="email"
            placeholder="Masukan email Anda"
            description="Gunakan email aktif untuk verifikasi akun"
            leftIcon={<Image src="/assets/images/email-icon-w20-h20.svg" alt="Email Icon" width={20} height={20} />}
          />

          {/* Password Input */}
          <PasswordInput label="Kata Sandi" description="Kombinasi huruf besar, kecil, angka dan simbol" />

          {/*  Re-enter Password Input */}
          <PasswordInput label="Ulangi Kata Sandi" />
        </div>
        <PrimaryButton
          type="button"
          label="Selanjutnya"
          rightIcon={
            <Image src="/assets/images/arrow-right-icon-white-w16-h16.svg" alt="Arrow Right" width={16} height={16} />
          }
        />
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
  );
}
