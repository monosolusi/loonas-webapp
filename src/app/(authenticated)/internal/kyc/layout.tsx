"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export default function KycReviewLayout({ children }: { children: React.ReactNode }) {
  const { account, loading } = useGetCurrentAccount();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!account?.hasFeature("kyc")) router.replace("/home");
  }, [loading, account, router]);

  if (loading) return null;
  if (!account?.hasFeature("kyc")) return null;

  return <>{children}</>;
}
