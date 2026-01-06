import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useMemo } from "react";
import { isNonEmptyString } from "@/core/utilities/validation-patterns";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";

export function usePersonalAccountData() {
  const { accountData, updatePersonalData } = useCreateAccount();
  if (accountData?.type !== "personal") throw new ServerError(ErrorCodes.INVALID_PERSONAL_ACCOUNT_HOOK_CALL);

  const data = accountData.data;
  const isClean = useMemo(() => {
    return (
      isNonEmptyString(data.nationality) &&
      isNonEmptyString(data.fullName) &&
      isNonEmptyString(data.identityNumber) &&
      isNonEmptyString(data.occupation) &&
      isNonEmptyString(data.placeOfBirth) &&
      !!data.dateOfBirth &&
      data.dateOfBirth.isValid === true &&
      !!data.province &&
      !!data.city &&
      !!data.district &&
      !!data.subDistrict &&
      isNonEmptyString(data.address) &&
      !!data.identityFile &&
      data.identityFile instanceof File &&
      data.identityFile.size > 0 &&
      data.identityFile.size <= 1024 * 1024 * 5
    );
  }, [
    data.nationality,
    data.fullName,
    data.identityNumber,
    data.occupation,
    data.placeOfBirth,
    data.dateOfBirth,
    data.province,
    data.city,
    data.district,
    data.subDistrict,
    data.address,
    data.identityFile,
  ]);

  const createAccount = async (): Promise<PersonalAccountEntity> => {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  };

  return { data, update: updatePersonalData, isClean, createAccount };
}
