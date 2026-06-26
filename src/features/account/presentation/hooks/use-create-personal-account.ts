import { DateTime } from "luxon";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import useSWRMutation from "swr/mutation";
import {
  CreatePersonalAccountUseCase,
  CreatePersonalAccountUseCaseParams,
} from "@/features/account/domain/usecases/create-personal-account";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ACCOUNT_SWR_KEYS } from "@/features/account/presentation/constants/swr-keys";

type CreatePersonalAccountFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  personal: {
    nationality: string;
    fullName: string;
    idNumber: string;
    occupation: OccupationEntity;
    placeOfBirth: string;
    dateOfBirth: DateTime;
  };
  address: {
    province: ProvinceEntity;
    city: CityEntity;
    district: DistrictEntity;
    subdistrict: SubdistrictEntity;
    address: string;
  };
  documents: {
    idFile: File;
  };
};

type TriggerInput = Omit<CreatePersonalAccountFetcherParams, "clerk">;

async function CreatePersonalAccountFetcher(_: string, params: { arg: CreatePersonalAccountFetcherParams }) {
  const { arg } = params;
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));
  const create = new CreatePersonalAccountUseCase(accountRepository, sessionRepository);
  const createParams = new CreatePersonalAccountUseCaseParams({
    nationality: arg.personal.nationality,
    idNumber: arg.personal.idNumber,
    idDocument: arg.documents.idFile,
    fullName: arg.personal.fullName,
    occupation: arg.personal.occupation,
    pob: arg.personal.placeOfBirth,
    dob: arg.personal.dateOfBirth,
    province: arg.address.province,
    city: arg.address.city,
    district: arg.address.district,
    subdistrict: arg.address.subdistrict,
    address: arg.address.address,
  });

  const account = await create.execute(createParams);
  if (account instanceof DataFailed) throw account.error;
  if (!account.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return account.data;
}

export function useCreatePersonalAccount() {
  const clerk = useClerk();
  const { trigger, ...rest } = useSWRMutation(ACCOUNT_SWR_KEYS.CREATE_PERSONAL_ACCOUNT, CreatePersonalAccountFetcher);

  // Wrapper trigger yang otomatis inject getToken dari Clerk
  const wrappedTrigger = (data: TriggerInput) => trigger({ ...data, clerk });

  return {
    ...rest,
    trigger: wrappedTrigger,
  };
}
