import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { AddressRepository } from "@/core/utilities/address/domain/repositories/address";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";

export class ListDistrictUseCaseParams {
  constructor(public readonly cityId: string) {
  }
}

export class ListDistrictUseCase implements UseCase<DataState<DistrictEntity[]>, ListDistrictUseCaseParams> {
  constructor(private addressRepository: AddressRepository) {
  }

  public async execute(params: ListDistrictUseCaseParams): Promise<DataState<DistrictEntity[]>> {
    return this.addressRepository.listDistrict(params.cityId);
  }
}