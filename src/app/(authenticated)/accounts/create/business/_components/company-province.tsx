"use client";

import { SelectProvince } from "@/core/utilities/address/presentation/components/select-province";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyProvince() {
  const { companyProvince, setCompanyProvince } = useCreateBusinessAccountState();

  return <SelectProvince value={companyProvince} onChange={setCompanyProvince} />;
}
