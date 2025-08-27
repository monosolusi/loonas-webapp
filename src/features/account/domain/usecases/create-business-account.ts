import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountRepository } from "@/features/account/domain/repositories/account";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";

interface CreateBusinessAccountUseCaseParamsConstructor {
  company: {
    name: string;
    email: string;
    phoneNumber: string;
    address: {
      province: { id: string };
      city: { id: string };
      district: { id: string };
      subdistrict: { id: string };
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
}

export class CreateBusinessAccountUseCaseParams {
  public readonly company: {
    name: string;
    email: string;
    phoneNumber: string;
    address: {
      province: { id: string };
      city: { id: string };
      district: { id: string };
      subdistrict: { id: string };
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

  public readonly director: {
    nationalIdentityCard: File;
  };

  constructor(params: CreateBusinessAccountUseCaseParamsConstructor) {
    this.company = params.company;
    this.director = params.director;
  }
}

export class CreateBusinessAccountUseCase
  implements UseCase<DataState<BusinessAccountEntity>, CreateBusinessAccountUseCaseParams>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateBusinessAccountUseCaseParams): Promise<DataState<BusinessAccountEntity>> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(params.company.email)) throw new ServerError(ErrorCodes.INVALID_EMAIL);

      const parsedPhoneNumber =
        parsePhoneNumberFromString(params.company.phoneNumber, { defaultCountry: "ID" }) ||
        parsePhoneNumberFromString(params.company.phoneNumber, { defaultCountry: "SG" });

      // If still not valid, throw an error
      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) throw new ServerError(ErrorCodes.INVALID_PHONE_NUMBER);

      // Making sure at least have 1 document in company.financial
      if (!params.company.financial.statement && !params.company.financial.bankStatement) {
        throw new ServerError(ErrorCodes.COMPANY_FINANCIAL_OR_BANK_STATEMENT_REQUIRED);
      }

      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.accountRepository.createBusiness(
        {
          company: params.company,
          director: params.director,
        },
        session.data,
      );
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
