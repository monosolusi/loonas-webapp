"use client";

import { NavigationItem } from "@/app/(authenticated)/_components/navigation-item";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function KycReviewNavItem() {
  const { account } = useGetCurrentAccount();
  if (!account?.hasFeature("kyc")) return null;

  return (
    <NavigationItem
      href="/internal/kyc"
      label="KYC Review"
      iconPath="/assets/images/document-icon-neutral-400-w16-h16.svg"
      selectedIconPath="/assets/images/document-icon-primary-300-w16-h16.svg"
    />
  );
}
