"use client";

import React from "react";
import { IncompleteFormNotice } from "@/app/(user)/onboarding/account/_components/incomplete-form-notice";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";

export function BusinessSubmitIncompleteBanner() {
  const { incompleteIssues } = useBusinessAccountData();

  return <IncompleteFormNotice issues={incompleteIssues} />;
}
