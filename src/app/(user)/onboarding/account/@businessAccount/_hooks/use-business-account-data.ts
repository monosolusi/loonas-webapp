import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useMemo } from "react";
import { isNonEmptyString, isValidFile } from "@/core/utilities/validation-patterns";
import { useCreateBusinessAccount } from "@/features/account/presentation/hooks/use-create-business-account";
import { useOrganizationList } from "@clerk/nextjs";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";

export function useBusinessAccountData() {
  const { accountData, updateBusinessData } = useCreateAccount();
  const { isLoaded, setActive } = useOrganizationList();
  if (accountData?.type !== "business") throw new ServerError(ErrorCodes.INVALID_BUSINESS_ACCOUNT_HOOK_CALL);

  const { trigger, isMutating } = useCreateBusinessAccount();

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
      isValidFile(data.directorNationalIdentityCard) &&
      isValidFile(data.bankStatement)
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
    data.bankStatement,
  ]);

  const createAccount = async (): Promise<BusinessAccountEntity> => {
    if (!isClean) throw new ServerError(ErrorCodes.INCOMPLETE_FORM);
    if (!isLoaded) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

    const account = await trigger({
      company: {
        name: data.companyName!,
        email: data.companyEmail!,
        phoneNumber: data.companyPhone!,
        address: {
          province: data.companyProvince!,
          city: data.companyCity!,
          district: data.companyDistrict!,
          subdistrict: data.companySubdistrict!,
          address: data.companyAddress!,
        },
        deedOfEstablishment: data.deedOfEstablishment!,
        mostRecentDeedOfAmendment: data.mostRecentDeededOfEstablishment ?? undefined,
        businessIdentificationNumber: data.businessRegistrationNumber!,
        financial: { bankStatement: data.bankStatement! },
      },
      director: {
        nationalIdentityCard: data.directorNationalIdentityCard!,
      },
    });

    await setActive({ organization: account.metadata.clerkId });
    return account;
  };

  return { data, update: updateBusinessData, isClean, isCreating: isMutating, createAccount };
}
