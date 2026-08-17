import { ProvinceServiceImpl } from "@/core/utilities/address/data/sources/province";
import { CityServiceImpl } from "@/core/utilities/address/data/sources/city";
import { DistrictServiceImpl } from "@/core/utilities/address/data/sources/district";
import { AddressRepositoryImpl } from "@/core/utilities/address/data/repositories/address";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import useSWR from "swr";
import { SubdistrictServiceImpl } from "@/core/utilities/address/data/sources/subdistrict";
import {
  ListSubdistrictUseCase,
  ListSubdistrictUseCaseParams,
} from "@/core/utilities/address/domain/usecases/list-subdistrict";

interface ListSubdistrictFetcherParams {
  districtId?: string;
}

async function ListSubdistrictFetcher([_, params]: [string, ListSubdistrictFetcherParams]) {
  if (!params.districtId) return [];

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

  const lSubdistrict = new ListSubdistrictUseCase(addressRepository);
  const lSubdistrictPrams = new ListSubdistrictUseCaseParams(params.districtId);
  const subdistricts = await lSubdistrict.execute(lSubdistrictPrams);
  if (subdistricts instanceof DataFailed) throw subdistricts.error;
  if (!subdistricts.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return subdistricts.data;
}

export function useListSubdistrict(params: ListSubdistrictFetcherParams) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(["list-subdistrict", params], ListSubdistrictFetcher);

  return {
    subdistricts: data,
    error: error,
    loading: isLoading,
    // True for ANY in-flight request, including a background revalidation over already-loaded data —
    // consumers must gate it on the list being unusable, or a populated field goes inert on refocus.
    validating: isValidating,
    refresh: mutate,
  };
}
