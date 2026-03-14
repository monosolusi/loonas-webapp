"use client";

import { useUser } from "@clerk/nextjs";
import { NavigationItem } from "@/app/(authenticated)/_components/navigation-item";

export function KycReviewNavItem() {
  const { user } = useUser();
  if (user?.publicMetadata?.role !== "internal") return null;

  return (
    <NavigationItem
      href="/internal/kyc"
      label="KYC Review"
      iconPath="/assets/images/document-icon-neutral-400-w16-h16.svg"
      selectedIconPath="/assets/images/document-icon-primary-300-w16-h16.svg"
    />
  );
}
