import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { DataState } from "@/core/resources/data-state";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";

export abstract class AddressRepository {
  public abstract listProvince(): Promise<DataState<ProvinceEntity[]>>;

  public abstract listCity(provinceId: string): Promise<DataState<CityEntity[]>>;

  public abstract listDistrict(cityId: string): Promise<DataState<DistrictEntity[]>>;
}