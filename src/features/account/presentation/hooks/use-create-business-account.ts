import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWRMutation from "swr/mutation";
import {
  CreateBusinessAccountUseCase,
  CreateBusinessAccountUseCaseParams,
} from "@/features/account/domain/usecases/create-business-account";
import { DataFailed } from "@/core/resources/data-state";
import { useClerk } from "@clerk/nextjs";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { HttpRequest } from "@/core/helpers/http-request";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ACCOUNT_SWR_KEYS } from "@/features/account/presentation/constants/swr-keys";

type CreateBusinessAccountProps = {
  company: {
    name: string;
    email: string;
    phoneNumber: string;
    address: {
      province: ProvinceEntity;
      city: CityEntity;
      district: DistrictEntity;
      subdistrict: SubdistrictEntity;
      address: string;
    };
    deedOfEstablishment: File;
    mostRecentDeedOfAmendment?: File;
    businessIdentificationNumber: File;
    financial: {
      statement?: File;
      bankStatement?: File;
    };
  };
  director: {
    nationalIdentityCard: File;
  };
};

type CreateBusinessAccountFetcherParams = CreateBusinessAccountProps & {
  clerk: ReturnType<typeof useClerk>;
};

async function CreateBusinessAccountFetcher(_: string, { arg }: { arg: CreateBusinessAccountFetcherParams }) {
  // Input will be validated inside the Use Case. This is to split between domain and presentation.
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const accountRepository = new AccountRepositoryImpl(new AccountServiceImpl(new HttpRequest()));
  const create = new CreateBusinessAccountUseCase(accountRepository, sessionRepository);
  const createParams = new CreateBusinessAccountUseCaseParams({ company: arg.company, director: arg.director });

  const account = await create.execute(createParams);
  if (account instanceof DataFailed) throw account.error;
  if (!account.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return account.data;
}

export function useCreateBusinessAccount() {
  const clerk = useClerk();
  const { trigger, ...rest } = useSWRMutation(ACCOUNT_SWR_KEYS.CREATE_BUSINESS_ACCOUNT, CreateBusinessAccountFetcher);

  // Wrapper trigger yang otomatis inject getToken dari Clerk
  const wrappedTrigger = (data: CreateBusinessAccountProps) => trigger({ ...data, clerk });

  return {
    ...rest,
    trigger: wrappedTrigger,
  };
}
