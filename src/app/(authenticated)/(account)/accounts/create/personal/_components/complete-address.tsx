import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";
import React from "react";
import { CitySelect } from "./city-select";
import { DistrictSelect } from "./district-select";
import { SubdistrictSelect } from "./subdistrict-select";
import { ProvinceSelect } from "./province-select";
import { Label } from "./label";

export function CompleteAddress() {
  const { address, setAddress } = useCreatePersonalAccount();

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAddress?.(e.target.value.slice(0, 255));
  }


  return (
    <div className="sm:col-span-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
      <div className="sm:col-start-1">
        <ProvinceSelect />
      </div>

      <div className="sm:col-start-2">
        <CitySelect />
      </div>

      <div className="sm:col-start-1">
        <DistrictSelect />
      </div>

      <div className="sm:col-start-2">
        <SubdistrictSelect />
      </div>

      <div className="col-span-full">
        <Label title="Alamat Lengkap" htmlFor="address" />
        <div className="mt-2">
            <textarea
              id="address"
              name="address"
              rows={3}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={address}
              onChange={handleChange}
            />
        </div>
      </div>

    </div>

  );
}