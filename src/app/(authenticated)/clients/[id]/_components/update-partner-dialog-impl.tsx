"use client";

import {
  PartnerExistingDataItem,
  UpdatePartnerDialog
} from "@/app/(authenticated)/clients/[id]/_components/update-partner-dialog";
import { useGetPartner } from "@/features/partner/presentation/providers/get-partner";
import React, { useMemo } from "react";

interface UpdatePartnerDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdatePartnerDialogImpl(props: UpdatePartnerDialogProps) {
  const { partner, loading } = useGetPartner();

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

  if (loading || !partner || !formattedPartner) return null;
  return (
    <UpdatePartnerDialog
      open={props.open}
      onClose={handleClose}
      onCancel={handleCancel}
      existingData={formattedPartner}
    />
  );
}
