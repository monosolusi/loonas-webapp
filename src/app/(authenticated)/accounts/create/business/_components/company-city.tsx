"use client";

import { SelectCity } from "@/core/utilities/address/presentation/components/select-city";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyCity() {
  const { companyProvince, companyCity, setCompanyCity } = useCreateBusinessAccountState();

  return <SelectCity onChange={setCompanyCity} value={companyCity} province={companyProvince} />;
}
