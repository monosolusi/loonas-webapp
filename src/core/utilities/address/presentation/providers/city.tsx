import { createContext, useContext, useEffect, useState } from "react";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AddressRepositoryImpl } from "@/core/utilities/address/data/repositories/address";
import { ProvinceServiceImpl } from "@/core/utilities/address/data/sources/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { ListCityUseCase, ListCityUseCaseParams } from "@/core/utilities/address/domain/usecases/list-city";
import { CityServiceImpl } from "@/core/utilities/address/data/sources/city";
import { SubdistrictServiceImpl } from "@/core/utilities/address/data/sources/subdistrict";
import { DistrictServiceImpl } from "@/core/utilities/address/data/sources/district";

// data, loading
type CityContextProps = [CityEntity[], boolean]

const CityContext = createContext<CityContextProps>([[], false]);

export function CityProvider({ provinceId, children }: { provinceId?: string, children: any }) {
  const [cities, setCities] = useState<CityEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    listCity(provinceId);
  }, [provinceId]);

  async function listCity(provinceId?: string) {
    try {
      if (!provinceId) return;

      setLoading(true);

      const subdistrictService = new SubdistrictServiceImpl();
      const districtService = new DistrictServiceImpl();
      const provinceService = new ProvinceServiceImpl();
      const cityService = new CityServiceImpl();
      const addressRepository = new AddressRepositoryImpl(
        provinceService,
        cityService,
        districtService,
        subdistrictService
      );

      const lCity = new ListCityUseCase(addressRepository);
      const lCityParams = new ListCityUseCaseParams(provinceId);
      const cities = await lCity.execute(lCityParams);
      if (cities instanceof DataFailed) throw cities.error;
      if (!cities.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setCities(cities.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CityContext.Provider value={[cities, loading]}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}