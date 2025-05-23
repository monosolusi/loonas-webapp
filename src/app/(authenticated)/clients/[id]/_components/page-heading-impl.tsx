"use client";

import { PageHeading } from "@/core/presentations/components/page-heading";
import { useGetPartner } from "@/features/partner/presentation/providers/get-partner";

export function PageHeadingImpl() {
  const { partner, loading } = useGetPartner();

  if (!partner || loading) return null;
  return (
    <PageHeading>{partner.name}</PageHeading>
  );
}
