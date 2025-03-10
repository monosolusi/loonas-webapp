import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { AddressRepository } from "@/core/utilities/address/domain/repositories/address";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";

export class ListSubdistrictUseCaseParams {
  constructor(public readonly districtId: string) {
  }
}

export class ListSubdistrictUseCase implements UseCase<DataState<SubdistrictEntity[]>, ListSubdistrictUseCaseParams> {
  constructor(private addressRepository: AddressRepository) {
  }

  public async execute(params: ListSubdistrictUseCaseParams): Promise<DataState<SubdistrictEntity[]>> {
    return this.addressRepository.listSubdistrict(params.districtId);
  }
}