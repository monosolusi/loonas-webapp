"use client";

import {
  PartnerExistingDataItem,
  UpdatePartnerDialog
} from "@/app/(authenticated)/clients/[id]/_components/update-partner-dialog";
import { useGetPartner } from "@/features/partner/presentation/providers/get-partner";
import React, { useMemo } from "react";
import { useUpdatePartner } from "@/features/partner/presentation/providers/update-partner";

interface UpdatePartnerDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdatePartnerDialogImpl(props: UpdatePartnerDialogProps) {
  const { partner, loading, refresh } = useGetPartner();
  const { updatePartner } = useUpdatePartner();

  const formattedPartner: PartnerExistingDataItem | null = useMemo(() => {
    if (!partner) return null;

    return {
      id: partner.id,
      name: partner.name,
      email: partner.email,
      phone: partner.phoneNumber
    };
  }, [partner]);

  const handleClose = () => props.setOpen(false);
  const handleCancel = () => props.setOpen(false);
  const handleSubmit = async (params: {
    id: string;
    name: string;
    email: string;
    phone: string;
  }) => {
    await updatePartner?.({ id: params.id }, { name: params.name, email: params.email, phone: params.phone });
    await refresh?.();
    props.setOpen(false);
  };

  if (loading || !partner || !formattedPartner) return null;
  return (
    <UpdatePartnerDialog
      open={props.open}
      onClose={handleClose}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      existingData={formattedPartner}
    />
  );
}
