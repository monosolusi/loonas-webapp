"use client";

import { TextInput } from "@/core/presentations/components/text-input";
import React from "react";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyEmail() {
  const { companyEmail, setCompanyEmail } = useCreateBusinessAccountState();

  return <TextInput title="Email Perusahaan" type="email" value={companyEmail} onChange={setCompanyEmail} />;
}
