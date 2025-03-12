import { createContext, useContext, useEffect, useState } from "react";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AddressRepositoryImpl } from "@/core/utilities/address/data/repositories/address";
import { ProvinceServiceImpl } from "@/core/utilities/address/data/sources/province";
import { CityServiceImpl } from "@/core/utilities/address/data/sources/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { ListDistrictUseCase, ListDistrictUseCaseParams } from "@/core/utilities/address/domain/usecases/list-district";
import { DistrictServiceImpl } from "@/core/utilities/address/data/sources/district";

// data, loading
type DistrictContextProps = [DistrictEntity[], boolean]

const DistrictContext = createContext<DistrictContextProps>([[], false]);

export function DistrictProvider({ cityId, children }: { cityId?: string, children: any }) {
  const [districts, setDistricts] = useState<DistrictEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    listDistrict(cityId);
  }, [cityId]);

  async function listDistrict(cityId?: string) {
    try {
      if (!cityId) return;

      setLoading(true);

      const provinceService = new ProvinceServiceImpl();
      const cityService = new CityServiceImpl();
      const districtService = new DistrictServiceImpl();
      const subdistrictService = new DistrictServiceImpl();
      const addressRepository = new AddressRepositoryImpl(
        provinceService,
        cityService,
        districtService,
        subdistrictService
      );

      const lDistrict = new ListDistrictUseCase(addressRepository);
      const lDistrictParams = new ListDistrictUseCaseParams(cityId);
      const districts = await lDistrict.execute(lDistrictParams);
      if (districts instanceof DataFailed) throw districts.error;
      if (!districts.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setDistricts(districts.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DistrictContext.Provider value={[districts, loading]}>
      {children}
    </DistrictContext.Provider>
  );
}

export function useDistrict() {
  return useContext(DistrictContext);
}