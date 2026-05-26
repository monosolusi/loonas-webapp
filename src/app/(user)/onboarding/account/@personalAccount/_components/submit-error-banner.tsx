"use client";

import React, { useEffect, useRef } from "react";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";
import { ErrorCard } from "@/core/presentations/components/error-card";

export function PersonalSubmitErrorBanner() {
  const { submitError } = usePersonalAccountData();
  const errorWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitError) {
      errorWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitError]);

  return (
    <div ref={errorWrapperRef} role="status" aria-live="polite" aria-atomic="true">
      {submitError && <ErrorCard>{submitError}</ErrorCard>}
    </div>
  );
}
