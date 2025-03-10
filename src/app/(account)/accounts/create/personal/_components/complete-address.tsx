import React from "react";
import { Label } from "@/app/(account)/accounts/create/personal/_components/label";
import { Select } from "./select";
import { ProvinceSelect } from "@/app/(account)/accounts/create/personal/_components/province-select";

export function CompleteAddress() {
  return (
    <div className="sm:col-span-full grid grid-cols-2 gap-x-6 gap-y-8">
      <div className="col-start-1">
        <ProvinceSelect />
      </div>

      <div className="col-start-2">
        <Label title="Kota / Kabupaten" htmlFor="city" />
        <div className="mt-2">
          <Select
            id="city"
            data={[
              { value: "surabaya", label: "Surabaya" },
              { value: "malang", label: "Malang" },
              { value: "sidoarjo", label: "Sidoarjo" }
            ]}
          />
        </div>
      </div>

      <div className="col-start-1">
        <Label title="Kecamatan" htmlFor="district" />
        <div className="mt-2">
          <Select
            id="state"
            data={[
              { value: "jawa-timur", label: "Jawa Timur" },
              { value: "jawa-tengah", label: "Jawa Tengah" },
              { value: "jawa-barat", label: "Jawa Barat" }
            ]}
          />
        </div>
      </div>

      <div className="col-start-2">
        <Label title="Kelurahan" htmlFor="subdistrict" />
        <div className="mt-2">
          <Select
            id="city"
            data={[
              { value: "surabaya", label: "Surabaya" },
              { value: "malang", label: "Malang" },
              { value: "sidoarjo", label: "Sidoarjo" }
            ]}
          />
        </div>
      </div>

      <div className="col-span-full">
        <Label title="Alamat Lengkap" htmlFor="address" />
        <div className="mt-2">
            <textarea
              id="address"
              name="address"
              rows={3}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              defaultValue=""
            />
        </div>
      </div>

    </div>

  );
}