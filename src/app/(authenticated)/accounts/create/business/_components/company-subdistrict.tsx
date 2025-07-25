"use client";

import { SelectSubdistrict } from "@/core/utilities/address/presentation/components/select-subdistrict";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanySubdistrict() {
  const { companyDistrict, companySubdistrict, setCompanySubdistrict } = useCreateBusinessAccountState();

  return <SelectSubdistrict value={companySubdistrict} onChange={setCompanySubdistrict} district={companyDistrict} />;
}
