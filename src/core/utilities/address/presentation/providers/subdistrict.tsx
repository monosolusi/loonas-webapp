import { createContext, useContext, useEffect, useState } from "react";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AddressRepositoryImpl } from "@/core/utilities/address/data/repositories/address";
import { ProvinceServiceImpl } from "@/core/utilities/address/data/sources/province";
import { CityServiceImpl } from "@/core/utilities/address/data/sources/city";
import { DistrictServiceImpl } from "@/core/utilities/address/data/sources/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { ListSubdistrictUseCase, ListSubdistrictUseCaseParams } from "../../domain/usecases/list-subdistrict";
import { SubdistrictServiceImpl } from "@/core/utilities/address/data/sources/subdistrict";

// data, loading
type SubdistrictContextProps = [SubdistrictEntity[], boolean]

const SubdistrictContext = createContext<SubdistrictContextProps>([[], false]);

export function SubdistrictProvider({ districtId, children }: { districtId?: string, children: any }) {
  const [subdistricts, setSubdistricts] = useState<SubdistrictEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    listSubdistrict(districtId);
  }, [districtId]);

  async function listSubdistrict(districtId?: string) {
    try {
      if (!districtId) return;

      setLoading(true);

      const SubdstrictService = new SubdistrictServiceImpl();
      const districtService = new DistrictServiceImpl();
      const provinceService = new ProvinceServiceImpl();
      const cityService = new CityServiceImpl();
      const addressRepository = new AddressRepositoryImpl(
        provinceService,
        cityService,
        districtService,
        SubdstrictService
      );

      const lSubdistrict = new ListSubdistrictUseCase(addressRepository);
      const lSubdistrictPrams = new ListSubdistrictUseCaseParams(districtId);
      const subdistricts = await lSubdistrict.execute(lSubdistrictPrams);
      if (subdistricts instanceof DataFailed) throw subdistricts.error;
      if (!subdistricts.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setSubdistricts(subdistricts.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SubdistrictContext.Provider value={[subdistricts, loading]}>
      {children}
    </SubdistrictContext.Provider>
  );
}

export function useSubdistrict() {
  return useContext(SubdistrictContext);
}