"use client";

import { PartnerDetail, PartnerDetailItem } from "@/app/(authenticated)/clients/[id]/detail/_components/partner-detail";
import { useMemo } from "react";
import { useGetPartner } from "@/features/partner/presentation/providers/get-partner";

export function PartnerDetailImpl() {
  const { partner, loading } = useGetPartner();

  const formattedPartner: PartnerDetailItem | null = useMemo(() => {
    if (!partner) return null;

    return {
      id: partner.id,
      fullName: partner.name,
      email: partner.email,
      phoneNumber: partner.phoneNumber
    };
  }, [partner]);

  if (!partner || !formattedPartner || loading) return null;
  return (
    <PartnerDetail
      data={formattedPartner}
    />
  );
}
