import { StepIndicatorWithTime } from "@/app/(user)/onboarding-new-user/_components/step-indicator-with-time";
import { StepHeader } from "@/app/(user)/onboarding-new-user/_components/step-header";
import { PreviousButton } from "@/app/(user)/onboarding-new-user/_components/previous-button";
import { NextButton } from "@/app/(user)/onboarding-new-user/_components/next-button";
import React from "react";

type PersonalAccountCreationLayoutProps = {
  personalDetail: React.ReactNode;
  addressDetail: React.ReactNode;
};

export default function PersonalAccountCreationLayout(props: PersonalAccountCreationLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <StepIndicatorWithTime currentStep={3} totalSteps={4} expectedTime="~3 menit" />
      <StepHeader title="Informasi Personal" description="Lengkapi data diri untuk verifikasi identitas Anda." />
      <div className="flex w-full flex-col items-stretch">
        <div className="mb-6 flex flex-row gap-2">
          <div className="bg-primary-300 h-1 w-full flex-1 rounded-full"></div>
          <div className="h-1 w-full flex-1 rounded-full bg-neutral-100"></div>
          <div className="h-1 w-full flex-1 rounded-full bg-neutral-100"></div>
        </div>
        <div>
          {/*{props.personalDetail}*/}
          {props.addressDetail}
        </div>
        <div className="flex flex-row gap-3 border-t border-neutral-100 pt-4">
          <div className="flex-1">
            <PreviousButton />
          </div>
          <div className="flex-1">
            <NextButton />
          </div>
        </div>
      </div>
    </div>
  );
}
