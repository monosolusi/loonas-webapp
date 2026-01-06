import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useMemo } from "react";
import { isNonEmptyString } from "@/core/utilities/validation-patterns";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { useCreatePersonalAccount } from "@/features/account/presentation/hooks/use-create-personal-account";

export function usePersonalAccountData() {
  const { accountData, updatePersonalData } = useCreateAccount();
  if (accountData?.type !== "personal") throw new ServerError(ErrorCodes.INVALID_PERSONAL_ACCOUNT_HOOK_CALL);

  const { trigger, isMutating } = useCreatePersonalAccount();

  const data = accountData.data;
  const isClean = useMemo(() => {
    return (
      isNonEmptyString(data.nationality) &&
      isNonEmptyString(data.fullName) &&
      isNonEmptyString(data.identityNumber) &&
      !!data.occupation &&
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
    if (!isClean) throw new ServerError(ErrorCodes.INCOMPLETE_FORM);

    // The empty has been checked before, so we can safely cast it to a non-empty string.
    const account = await trigger({
      personal: {
        nationality: data.nationality!,
        fullName: data.fullName!,
        idNumber: data.identityNumber!,
        occupation: data.occupation!,
        placeOfBirth: data.placeOfBirth!,
        dateOfBirth: data.dateOfBirth!,
      },
      address: {
        province: data.province!,
        city: data.city!,
        district: data.district!,
        subdistrict: data.subDistrict!,
        address: data.address!,
      },
      documents: { idFile: data.identityFile! },
    });

    return account;
  };

  return { data, update: updatePersonalData, isClean, isCreating: isMutating, createAccount };
}
