import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { DateTime } from "luxon";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { AccountRepository } from "@/features/account/domain/repositories/account";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type CreatePersonalAccountUseCaseParamsConstructor = {
  nationality: string;
  idNumber: string;
  idDocument: File;
  fullName: string;
  occupation: OccupationEntity;
  pob: string;
  dob: DateTime;
  province: ProvinceEntity;
  city: CityEntity;
  district: DistrictEntity;
  subdistrict: SubdistrictEntity;
  address: string;
};

export class CreatePersonalAccountUseCaseParams {
  public readonly nationality: string;
  public readonly idNumber: string;
  public readonly idDocument: File;
  public readonly fullName: string;
  public readonly occupation: OccupationEntity;
  public readonly pob: string;
  public readonly dob: DateTime;
  public readonly province: ProvinceEntity;
  public readonly city: CityEntity;
  public readonly district: DistrictEntity;
  public readonly subdistrict: SubdistrictEntity;
  public readonly address: string;

  constructor(args: CreatePersonalAccountUseCaseParamsConstructor) {
    this.nationality = args.nationality;
    this.idNumber = args.idNumber;
    this.idDocument = args.idDocument;
    this.fullName = args.fullName;
    this.occupation = args.occupation;
    this.pob = args.pob;
    this.dob = args.dob;
    this.province = args.province;
    this.city = args.city;
    this.district = args.district;
    this.subdistrict = args.subdistrict;
    this.address = args.address;
    Object.freeze(this);
  }
}

export class CreatePersonalAccountUseCase
  implements UseCase<DataState<PersonalAccountEntity>, CreatePersonalAccountUseCaseParams>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreatePersonalAccountUseCaseParams): Promise<DataState<PersonalAccountEntity>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    return this.accountRepository.createPersonal(
      params.nationality,
      params.idNumber,
      params.idDocument,
      params.fullName,
      params.occupation,
      params.pob,
      params.dob,
      params.province,
      params.city,
      params.district,
      params.subdistrict,
      params.address,
      session.data,
    );
  }
}
