"use client";

import { TextInput } from "@/core/presentations/components/text-input";
import React from "react";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyPhoneNumber() {
  const { companyPhoneNumber, setCompanyPhoneNumber } = useCreateBusinessAccountState();

  return (
    <TextInput title="No. Telepon Perusahaan" type="tel" value={companyPhoneNumber} onChange={setCompanyPhoneNumber} />
  );
}
