"use client";

import { TextInput } from "@/core/presentations/components/text-input";
import React from "react";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

interface CompanyNameProps {
  className?: string;
}

export function CompanyName(props: CompanyNameProps) {
  const { companyName, setCompanyName } = useCreateBusinessAccountState();

  return (
    <TextInput className={props.className} title="Nama Perusahaan" value={companyName} onChange={setCompanyName} />
  );
}
