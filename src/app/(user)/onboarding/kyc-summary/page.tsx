"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";
import { resolveKycSummaryEntry } from "@/app/(user)/onboarding/kyc-summary/_utils/resolve-kyc-summary-entry";
import { KycSummarySkeleton } from "@/app/(user)/onboarding/kyc-summary/_components/kyc-summary-skeleton";
import { KycSummaryContent } from "@/app/(user)/onboarding/kyc-summary/_components/kyc-summary-content";

export default function KycSummaryPage() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: orgLoaded, organization } = useOrganization();
  // USER-scoped (Bearer token only, no active org required) — safe to call unconditionally even
  // before any org exists. Maps a zero-account NOT_FOUND to `[]`, so `.length` is always safe.
  const { accounts, loading: accountsLoading } = useListAccount();

  const entry = resolveKycSummaryEntry({
    authLoaded,
    isSignedIn,
    orgLoaded,
    organizationId: organization?.id,
    accountsLoading,
    accountCount: accounts?.length ?? 0,
  });

  useEffect(() => {
    if (entry.kind === "redirect") router.replace(entry.to);
  }, [entry, router]);

  if (entry.kind !== "ready") return <KycSummarySkeleton />;
  return <KycSummaryContent organizationId={entry.organizationId} />;
}
