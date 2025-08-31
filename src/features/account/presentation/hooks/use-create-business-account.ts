import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWRMutation from "swr/mutation";
import {
  CreateBusinessAccountUseCase,
  CreateBusinessAccountUseCaseParams,
} from "@/features/account/domain/usecases/create-business-account";
import { DataFailed } from "@/core/resources/data-state";
import { AccountRepositoryImpl } from "@/features/account/data/repositories/account";
import { AccountServiceImpl } from "@/features/account/data/sources/account";
import { HttpRequest } from "@/core/helpers/http-request";

interface CreateBusinessAccountFetcherParams {
  arg: {
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
}

async function CreateBusinessAccountFetcher(_: string, params: CreateBusinessAccountFetcherParams) {
  const { arg } = params;

  // Input will be validated inside the Use Case. This is to split between domain and presentation.
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);

  const http = new HttpRequest();
  const accountService = new AccountServiceImpl(http);
  const accountRepository = new AccountRepositoryImpl(accountService);

  const create = new CreateBusinessAccountUseCase(accountRepository, sessionRepository);
  const createParams = new CreateBusinessAccountUseCaseParams({ company: arg.company, director: arg.director });

  const account = await create.execute(createParams);
  if (account instanceof DataFailed) throw account.error;
  if (!account.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return account.data;
}

export function useCreateBusinessAccount() {
  return useSWRMutation("create-business-account", CreateBusinessAccountFetcher);
}
