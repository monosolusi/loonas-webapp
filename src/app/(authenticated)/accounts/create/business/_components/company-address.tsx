"use client";

import { TextArea } from "@/core/presentations/components/text-area";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyAddress(props: { className?: string }) {
  const { companyAddress, setCompanyAddress } = useCreateBusinessAccountState();

  return (
    <TextArea
      title="Alamat Lengkap Perusahaan"
      className={props.className}
      value={companyAddress}
      onChange={setCompanyAddress}
    />
  );
}
