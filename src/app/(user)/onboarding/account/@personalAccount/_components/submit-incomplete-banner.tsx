"use client";

import React from "react";
import { IncompleteFormNotice } from "@/app/(user)/onboarding/account/_components/incomplete-form-notice";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_providers/personal-account-provider";

export function PersonalSubmitIncompleteBanner() {
  const { incompleteIssues } = usePersonalAccountData();

  return <IncompleteFormNotice issues={incompleteIssues} />;
}
