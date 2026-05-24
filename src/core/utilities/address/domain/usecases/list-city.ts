import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { AddressRepository } from "@/core/utilities/address/domain/repositories/address";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";

export class ListCityUseCaseParams {
  constructor(public readonly provinceId: string) {
  }
}

export class ListCityUseCase implements UseCase<DataState<CityEntity[]>, ListCityUseCaseParams> {
  constructor(private addressRepository: AddressRepository) {
  }

  public async execute(params: ListCityUseCaseParams): Promise<DataState<CityEntity[]>> {
    return this.addressRepository.listCity(params.provinceId);
  }
}