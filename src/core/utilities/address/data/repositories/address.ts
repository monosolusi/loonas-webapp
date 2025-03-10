import { AddressRepository } from "@/core/utilities/address/domain/repositories/address";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { ProvinceService } from "@/core/utilities/address/data/sources/province";
import { CityEntity } from "../../domain/entities/city";
import { CityService } from "@/core/utilities/address/data/sources/city";
import { DistrictEntity } from "../../domain/entities/district";
import { DistrictService } from "@/core/utilities/address/data/sources/district";

export class AddressRepositoryImpl implements AddressRepository {
  constructor(
    private provinceService: ProvinceService,
    private cityService: CityService,
    private districtService: DistrictService
  ) {
  }

  public async listDistrict(cityId: string): Promise<DataState<DistrictEntity[]>> {
    try {
      const districts = await this.districtService.list(cityId);
      return new DataSuccess(districts.map((c) => c.toEntity()));
    } catch (err: any) {
      return new DataFailed(err);
    }
  }

  public async listCity(provinceId: string): Promise<DataState<CityEntity[]>> {
    try {
      const cities = await this.cityService.list(provinceId);
      return new DataSuccess(cities.map((c) => c.toEntity()));
    } catch (err: any) {
      return new DataFailed(err);
    }
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