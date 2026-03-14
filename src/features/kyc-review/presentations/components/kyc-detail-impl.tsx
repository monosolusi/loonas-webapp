"use client";

import { useGetVerificationWork } from "@/features/kyc-review/presentations/hooks/use-get-verification-work";
import { VerificationWorkDetailEntity } from "@/features/kyc-review/domain/entities/verification-work-detail";

type KycDetailReturnType = {
  work: VerificationWorkDetailEntity | null;
  loading: boolean;
  error: boolean;
  refresh: (() => void) | null;
};

export function useKycDetail(id: string): KycDetailReturnType {
  const { work, loading, error, refresh } = useGetVerificationWork({ id });

  if (loading) return { work: null, loading: true, error: false, refresh: null };
  if (error || !work) return { work: null, loading: false, error: true, refresh: null };
  return { work, loading: false, error: false, refresh };
}
