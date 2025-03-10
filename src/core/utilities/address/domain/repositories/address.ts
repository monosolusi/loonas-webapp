import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { DataState } from "@/core/resources/data-state";

export abstract class AddressRepository {
  public abstract listProvince(): Promise<DataState<ProvinceEntity[]>>;
}