"use client";

import { StepIndicatorWithTime } from "@/app/(user)/onboarding/_components/step-indicator-with-time";
import { StepHeader } from "@/app/(user)/onboarding/_components/step-header";
import React from "react";
import { PreviousButton } from "@/app/(user)/onboarding/account/_components/previous-button";
import { NextButton } from "@/app/(user)/onboarding/account/_components/next-button";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { StepIndicatorImpl } from "@/app/(user)/onboarding/account/_components/step-indicator.impl";
import { SubmitButton } from "@/app/(user)/onboarding/account/@businessAccount/_components/submit-button";

type PersonalAccountCreationLayoutProps = {};

export default function PersonalAccountCreationLayout(props: PersonalAccountCreationLayoutProps) {
  const { type } = useCreateAccount();

  if (type !== "business") return null; // Do not render this page if the user has not selected a personal account.
  return (
    <form>
      <div className="flex flex-col items-center justify-center gap-10">
        <StepIndicatorWithTime currentStep={3} totalSteps={4} expectedTime="~5 menit" />
        <StepHeader title="Informasi Personal" description="Lengkapi data diri untuk verifikasi identitas Anda." />
        <div className="flex w-full flex-col items-stretch">
          <StepIndicatorImpl />
          <div></div>
          <div className="flex flex-row gap-3 border-t border-neutral-100 pt-4">
            <div className="flex-1">
              <PreviousButton />
            </div>
            <div className="flex-1">
              <NextButton />
              <SubmitButton />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
