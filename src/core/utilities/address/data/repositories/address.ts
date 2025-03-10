import { AddressRepository } from "@/core/utilities/address/domain/repositories/address";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { ProvinceService } from "@/core/utilities/address/data/sources/province";

export class AddressRepositoryImpl implements AddressRepository {
  constructor(private provinceService: ProvinceService) {
  }

  public async listProvince(): Promise<DataState<ProvinceEntity[]>> {
    try {
      const provinces = await this.provinceService.list();
      return new DataSuccess(provinces.map((c) => c.toEntity()));
    } catch (err: any) {
      return new DataFailed(err);
    }
  }


}