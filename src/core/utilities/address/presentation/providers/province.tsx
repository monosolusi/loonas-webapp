import { createContext, useContext, useEffect, useState } from "react";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { ListProvinceUseCase } from "@/core/utilities/address/domain/usecases/list-province";
import { AddressRepositoryImpl } from "@/core/utilities/address/data/repositories/address";
import { ProvinceServiceImpl } from "@/core/utilities/address/data/sources/province";
import { CityServiceImpl } from "@/core/utilities/address/data/sources/city";
import { DistrictServiceImpl } from "@/core/utilities/address/data/sources/district";

// The data, loading
type ProvinceContextProps = [ProvinceEntity[], boolean]

const ProvinceContext = createContext<ProvinceContextProps>([[], false]);

export function ProvinceProvider({ children }: { children: any }) {
  const [provinces, setProvinces] = useState<ProvinceEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    listProvince();
  }, []);

  async function listProvince() {
    try {
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

      const lProvince = new ListProvinceUseCase(addressRepository);
      const provinces = await lProvince.execute();
      if (provinces instanceof DataFailed) throw provinces.error;
      if (!provinces.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setProvinces(provinces.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProvinceContext.Provider value={[provinces, loading]}>
      {children}
    </ProvinceContext.Provider>
  );
}

export function useProvince() {
  return useContext(ProvinceContext);
}