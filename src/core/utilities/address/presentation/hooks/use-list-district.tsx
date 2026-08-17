import { ProvinceServiceImpl } from "@/core/utilities/address/data/sources/province";
import { CityServiceImpl } from "@/core/utilities/address/data/sources/city";
import { DistrictServiceImpl } from "@/core/utilities/address/data/sources/district";
import { SubdistrictServiceImpl } from "@/core/utilities/address/data/sources/subdistrict";
import { AddressRepositoryImpl } from "@/core/utilities/address/data/repositories/address";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import { ListDistrictUseCase, ListDistrictUseCaseParams } from "@/core/utilities/address/domain/usecases/list-district";

interface ListDistrictFetcherParams {
  cityId?: string;
}

async function ListDistrictFetcher([_, params]: [string, ListDistrictFetcherParams]) {
  if (!params.cityId) return [];

  const provinceService = new ProvinceServiceImpl();
  const cityService = new CityServiceImpl();
  const districtService = new DistrictServiceImpl();
  const subdistrictService = new SubdistrictServiceImpl();
  const addressRepository = new AddressRepositoryImpl(
    provinceService,
    cityService,
    districtService,
    subdistrictService,
  );

  const lDistrict = new ListDistrictUseCase(addressRepository);
  const lDistrictParams = new ListDistrictUseCaseParams(params.cityId);
  const districts = await lDistrict.execute(lDistrictParams);
  if (districts instanceof DataFailed) throw districts.error;
  if (!districts.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return districts.data;
}

export function useListDistrict(params: ListDistrictFetcherParams) {
  const { data, error, isLoading, mutate } = useSWR(["list-district", params], ListDistrictFetcher);

  return {
    districts: data,
    error: error,
    loading: isLoading,
    refresh: mutate,
  };
}
