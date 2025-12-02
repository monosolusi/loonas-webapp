"use client";

import { StepIndicatorWithTime } from "@/app/(user)/onboarding/_components/step-indicator-with-time";
import { StepHeader } from "@/app/(user)/onboarding/_components/step-header";
import { AccountTypeCard } from "@/app/(user)/onboarding/account/@accountType/_components/account-type-card";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";

export default function SelectAccountTypeStepPage() {
  const { type, setType } = useCreateAccount();

  const onPersonalAccountSelected = () => setType?.("personal");
  const onBusinessAccountSelected = () => setType?.("business");

  if (type) return null; // Do not render this page if the user has already selected an account type.
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <StepIndicatorWithTime currentStep={2} totalSteps={4} expectedTime="~30 detik" />
      <StepHeader title="Pilih Jenis Akun" description="Pilih yang paling sesuai dengan kebutuhan Anda" />
      <div className="flex flex-col gap-6">
        <div className="flex w-full flex-col gap-3">
          <AccountTypeCard
            iconPath="/assets/images/person-icon-primary-w28-h28.svg"
            title="Akun Personal"
            description="Untuk kebutuhan individu, freelancer, dan penggunaan pribadi. Akses lengkap untuk manajemen keuangan personal."
            onClick={onPersonalAccountSelected}
          />
          <AccountTypeCard
            iconPath="/assets/images/building-icon-primary-w28-h28.svg"
            title="Akun Bisnis"
            description="Untuk perusahaan, UMKM, dan organisasi. Fitur lengkap untuk manajemen keuangan bisnis dan tim."
            onClick={onBusinessAccountSelected}
          />
        </div>
        <span className="text-center text-xs leading-6 font-normal text-neutral-200">
          Tidak yakin? Pilih Personal dulu, Anda bisa upgrade ke Bisnis nanti.
        </span>
      </div>
    </div>
  );
}
