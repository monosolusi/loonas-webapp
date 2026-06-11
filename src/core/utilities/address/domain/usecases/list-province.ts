import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { AddressRepository } from "@/core/utilities/address/domain/repositories/address";

export class ListProvinceUseCase implements UseCase<DataState<ProvinceEntity[]>, void> {
  constructor(private addressRepository: AddressRepository) {
  }

  public async execute(): Promise<DataState<ProvinceEntity[]>> {
    return this.addressRepository.listProvince();
  }
}