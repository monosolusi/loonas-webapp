"use client";

import React, { useEffect, useRef } from "react";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";
import { ErrorCard } from "@/core/presentations/components/error-card";

export function BusinessSubmitErrorBanner() {
  const { submitError } = useBusinessAccountData();
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
