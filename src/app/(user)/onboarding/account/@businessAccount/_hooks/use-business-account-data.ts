import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useMemo } from "react";
import { isNonEmptyString, isValidFile } from "@/core/utilities/validation-patterns";

export function useBusinessAccountData() {
  const { accountData, updateBusinessData } = useCreateAccount();
  if (accountData?.type !== "business") throw new ServerError(ErrorCodes.INVALID_BUSINESS_ACCOUNT_HOOK_CALL);

  const data = accountData.data;
  const isClean = useMemo(() => {
    return (
      isNonEmptyString(data.companyName) &&
      isNonEmptyString(data.companyEmail) &&
      isNonEmptyString(data.companyPhone) &&
      !!data.companyProvince &&
      !!data.companyCity &&
      !!data.companyDistrict &&
      !!data.companySubdistrict &&
      isNonEmptyString(data.companyAddress) &&
      isValidFile(data.deedOfEstablishment) &&
      isValidFile(data.businessRegistrationNumber) &&
      isValidFile(data.directorNationalIdentityCard)
    );
  }, [
    data.companyName,
    data.companyEmail,
    data.companyPhone,
    data.companyProvince,
    data.companyCity,
    data.companyDistrict,
    data.companySubdistrict,
    data.companyAddress,
    data.deedOfEstablishment,
    data.businessRegistrationNumber,
    data.directorNationalIdentityCard,
  ]);

  return { data, update: updateBusinessData, isClean };
}
