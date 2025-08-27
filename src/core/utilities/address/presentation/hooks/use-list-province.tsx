import { ProvinceServiceImpl } from "@/core/utilities/address/data/sources/province";
import { CityServiceImpl } from "@/core/utilities/address/data/sources/city";
import { DistrictServiceImpl } from "@/core/utilities/address/data/sources/district";
import { AddressRepositoryImpl } from "@/core/utilities/address/data/repositories/address";
import { ListProvinceUseCase } from "@/core/utilities/address/domain/usecases/list-province";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";

async function ListProvinceFetcher() {
  const provinceService = new ProvinceServiceImpl();
  const cityService = new CityServiceImpl();
  const districtService = new DistrictServiceImpl();
  const subdistrictService = new DistrictServiceImpl();
  const addressRepository = new AddressRepositoryImpl(
    provinceService,
    cityService,
    districtService,
    subdistrictService,
  );

  const lProvince = new ListProvinceUseCase(addressRepository);
  const provinces = await lProvince.execute();
  if (provinces instanceof DataFailed) throw provinces.error;
  if (!provinces.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return provinces.data;
}

export function useListProvince() {
  const { data, error, isLoading, mutate } = useSWR("list-province", ListProvinceFetcher);

  return {
    provinces: data,
    error: error,
    loading: isLoading,
    refresh: mutate,
  };
}
