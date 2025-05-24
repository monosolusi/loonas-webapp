import { PartnerDetailImpl } from "@/app/(authenticated)/clients/[id]/detail/_components/partner-detail-impl";
import { UpdatePartnerProvider } from "@/features/partner/presentation/providers/update-partner";
import React from "react";

interface DetailContentProps {
  params: Promise<{ id: string }>;
}

export default async function DetailContent(props: DetailContentProps) {
  const { id } = await props.params;

  return (
    <UpdatePartnerProvider id={id}>
      <PartnerDetailImpl />
    </UpdatePartnerProvider>
  );
}
