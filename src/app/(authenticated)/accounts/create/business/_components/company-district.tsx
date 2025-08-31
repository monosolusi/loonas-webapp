"use client";

import { SelectDistrict } from "@/core/utilities/address/presentation/components/select-district";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyDistrict() {
  const { companyCity, companyDistrict, setCompanyDistrict } = useCreateBusinessAccountState();

  return <SelectDistrict value={companyDistrict} onChange={setCompanyDistrict} city={companyCity} />;
}
