import { ProvinceServiceImpl } from "@/core/utilities/address/data/sources/province";
import { CityServiceImpl } from "@/core/utilities/address/data/sources/city";
import { DistrictServiceImpl } from "@/core/utilities/address/data/sources/district";
import { AddressRepositoryImpl } from "@/core/utilities/address/data/repositories/address";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import { SubdistrictServiceImpl } from "@/core/utilities/address/data/sources/subdistrict";
import { ListCityUseCase, ListCityUseCaseParams } from "@/core/utilities/address/domain/usecases/list-city";

interface ListCityFetcherParams {
  provinceId?: string;
}

async function ListCityFetcher([_, params]: [string, ListCityFetcherParams]) {
  if (!params.provinceId) return [];

  const subdistrictService = new SubdistrictServiceImpl();
  const districtService = new DistrictServiceImpl();
  const provinceService = new ProvinceServiceImpl();
  const cityService = new CityServiceImpl();
  const addressRepository = new AddressRepositoryImpl(
    provinceService,
    cityService,
    districtService,
    subdistrictService,
  );

  const lCity = new ListCityUseCase(addressRepository);
  const lCityParams = new ListCityUseCaseParams(params.provinceId);
  const cities = await lCity.execute(lCityParams);
  if (cities instanceof DataFailed) throw cities.error;
  if (!cities.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return cities.data;
}

export function useListCity(params: ListCityFetcherParams) {
  const { data, error, isLoading, mutate } = useSWR(["list-city", params], ListCityFetcher);

  return {
    cities: data,
    error: error,
    loading: isLoading,
    refresh: mutate,
  };
}
